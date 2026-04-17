/**
 * Seedance 国风女性视频技能主入口
 * 状态机驱动的分层交互架构
 */

import { initializeState, SkillState, CreativeStatus, WorkMode, updateCreativeStatus, updateWorkMode, updateCharacterData, updateSceneData, updateVideoStyleData, updateDuration, updateShotData, updateMotionData, updateEffectsData, toggleEffectsLayer, updateCurrentPhase, updateConvergenceConfirmed, addConversationHistory, calculateCreativeGaps, canEnterConvergence, getNextGap, rollbackToPhase, Phase } from './state-manager';
import { processInitialInput, checkModifyRequest, isVagueAnswer, extractDuration } from './input-parser';
import { generateInitialStatusQuestion, generateWorkModeQuestion, generateQuestionForGap, generateConvergenceConfirmQuestion, generateAskUserQuestionCall, QuestionParams } from './question-generator';
import { buildConvergenceEcho } from './convergence-builder';
import { buildOutputForMode } from './prompt-builder';
import { runFullQualityCheck, generateQualityReport } from './quality-checker';

/**
 * 技能执行上下文
 */
interface SkillContext {
  state: SkillState;
  lastQuestion: QuestionParams | null;
  isFirstRun: boolean;
}

/**
 * 初始化上下文
 */
function initializeContext(): SkillContext {
  return {
    state: initializeState(),
    lastQuestion: null,
    isFirstRun: true
  };
}

/**
 * 处理用户回答，更新状态
 */
function processUserAnswer(answer: string, context: SkillContext): SkillContext {
  const { state, lastQuestion } = context;

  if (!lastQuestion) {
    return context;
  }

  // 处理"都不满意"选项，不修改状态，重新生成选项
  if (answer.includes('都不满意')) {
    return context;
  }

  // 添加对话历史
  let newState = addConversationHistory(state, lastQuestion.question, answer);

  // 根据问题类型处理回答
  switch (lastQuestion.header) {
    case '创意状态':
      const creativeStatus: CreativeStatus = answer.includes('已有明确方向') ? 'clear' :
                                         answer.includes('有模糊感觉') ? 'vague' : 'no_idea';
      newState = updateCreativeStatus(newState, creativeStatus);
      break;

    case '工作模式':
      const workMode: WorkMode = answer.includes('仅视频') ? 'video_only' :
                               answer.includes('整链路') ? 'full_chain' : 'character_only';
      newState = updateWorkMode(newState, workMode);
      break;

    case '角色身份':
      newState = updateCharacterData(newState, { identity: answer }, Object.keys(newState.character.data).length >= 4);
      break;

    case '角色气质':
      newState = updateCharacterData(newState, { temperament: answer }, Object.keys(newState.character.data).length >= 4);
      break;

    case '记忆点':
      newState = updateCharacterData(newState, { memoryPoint: answer }, Object.keys(newState.character.data).length >= 4);
      break;

    case '场景空间':
      newState = updateSceneData(newState, { space: answer }, Object.keys(newState.scene.data).length >= 2);
      break;

    case '场景关系':
      newState = updateSceneData(newState, { relationship: answer }, Object.keys(newState.scene.data).length >= 2);
      break;

    case '美学风格':
      newState = updateVideoStyleData(newState, { aestheticDirection: answer }, Object.keys(newState.videoStyle.data).length >= 2);
      break;

    case '色彩风格':
      newState = updateVideoStyleData(newState, { colorPalette: answer }, Object.keys(newState.videoStyle.data).length >= 2);
      break;

    case '视频时长':
      const duration = extractDuration(answer) || 10;
      newState = updateDuration(newState, duration, true);
      break;

    case '入口镜头':
      newState = updateShotData(newState, { entrance: answer }, Object.keys(newState.shot.data).length >= 2);
      break;

    case '收尾镜头':
      newState = updateShotData(newState, { ending: answer }, Object.keys(newState.shot.data).length >= 2);
      break;

    case '动作母题':
      newState = updateMotionData(newState, { motif: answer }, Object.keys(newState.motion.data).length >= 2);
      break;

    case '身体语言':
      newState = updateMotionData(newState, { bodyLanguage: answer }, Object.keys(newState.motion.data).length >= 2);
      break;

    case '特效选择':
      if (answer.includes('不需要')) {
        newState = toggleEffectsLayer(newState, false);
      } else {
        newState = toggleEffectsLayer(newState, true);
        newState = updateEffectsData(newState, { source: answer }, true);
      }
      break;

    case '确认核心要素':
      if (answer.includes('确认无误')) {
        newState = updateConvergenceConfirmed(newState, true);
      } else if (answer.includes('修改角色')) {
        newState = rollbackToPhase(newState, 'character');
      } else if (answer.includes('修改场景')) {
        newState = rollbackToPhase(newState, 'scene');
      } else if (answer.includes('修改风格')) {
        newState = rollbackToPhase(newState, 'style');
      } else if (answer.includes('修改镜头')) {
        newState = rollbackToPhase(newState, 'shot');
      } else if (answer.includes('修改动作')) {
        newState = rollbackToPhase(newState, 'motion');
      } else if (answer.includes('修改特效')) {
        newState = rollbackToPhase(newState, 'effects');
      }
      break;
  }

  // 重新计算创作缺口
  const gaps = calculateCreativeGaps(newState);
  newState.creativeGaps = gaps;

  // 检查是否可以进入收敛阶段
  if (canEnterConvergence(newState) && !newState.convergenceConfirmed) {
    newState.currentPhase = 'convergence';
  } else if (gaps.length > 0) {
    // 根据第一个缺口设置当前阶段
    const firstGap = gaps[0];
    if (firstGap.startsWith('character')) {
      newState.currentPhase = 'character';
    } else if (firstGap.startsWith('scene')) {
      newState.currentPhase = 'scene';
    } else if (firstGap.startsWith('style')) {
      newState.currentPhase = 'style';
    } else if (firstGap.startsWith('shot')) {
      newState.currentPhase = 'shot';
    } else if (firstGap.startsWith('motion')) {
      newState.currentPhase = 'motion';
    } else if (firstGap.startsWith('effects')) {
      newState.currentPhase = 'effects';
    }
  } else if (newState.convergenceConfirmed) {
    newState.currentPhase = 'output';
  }

  return {
    ...context,
    state: newState
  };
}

/**
 * 生成下一个操作
 */
async function generateNextAction(context: SkillContext, userInput?: string): Promise<any> {
  const { state, isFirstRun } = context;

  // 首次运行，处理初始输入
  if (isFirstRun && userInput) {
    let newState = processInitialInput(userInput, state);

    // 如果没有识别到工作模式，询问用户
    if (!newState.workMode) {
      const question = generateWorkModeQuestion();
      return {
        context: {
          ...context,
          state: newState,
          isFirstRun: false,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }

    // 如果是完全没想法，从灵感层开始
    if (newState.creativeStatus === 'no_idea') {
      const question = await generateQuestionForGap('character:temperament', newState);
      return {
        context: {
          ...context,
          state: newState,
          isFirstRun: false,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }

    // 否则计算缺口，生成第一个问题
    const gaps = calculateCreativeGaps(newState);
    if (gaps.length > 0) {
      const question = await generateQuestionForGap(gaps[0], newState);
      return {
        context: {
          ...context,
          state: newState,
          isFirstRun: false,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }

    // 如果所有要素都已确认，直接进入收敛
    if (canEnterConvergence(newState)) {
      newState.currentPhase = 'convergence';
      const echo = buildConvergenceEcho(newState);
      const question = generateConvergenceConfirmQuestion(newState);

      return {
        context: {
          ...context,
          state: newState,
          isFirstRun: false,
          lastQuestion: question
        },
        response: echo,
        toolCall: generateAskUserQuestionCall(question)
      };
    }
  }

  // 处理修改请求
  if (userInput) {
    const modifyRequest = checkModifyRequest(userInput);
    if (modifyRequest.phase) {
      let newState = state;
      switch (modifyRequest.phase) {
        case 'character':
          newState = rollbackToPhase(state, 'character');
          break;
        case 'scene':
          newState = rollbackToPhase(state, 'scene');
          break;
        case 'style':
          newState = rollbackToPhase(state, 'style');
          break;
        case 'duration':
          newState.duration.confirmed = false;
          newState.currentPhase = 'shot';
          break;
        case 'shot':
          newState = rollbackToPhase(state, 'shot');
          break;
        case 'motion':
          newState = rollbackToPhase(state, 'motion');
          break;
        case 'effects':
          newState = rollbackToPhase(state, 'effects');
          break;
      }

      const gaps = calculateCreativeGaps(newState);
      const question = await generateQuestionForGap(gaps[0], newState);

      return {
        context: {
          ...context,
          state: newState,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }

    // 处理"都不满意"选项，重新生成当前问题
    if (userInput.includes('都不满意') && context.lastQuestion) {
      let question: QuestionParams;

      // 根据当前问题的header重新生成对应类型的问题
      switch (context.lastQuestion.header) {
        case '创意状态':
          question = generateInitialStatusQuestion();
          break;
        case '工作模式':
          question = generateWorkModeQuestion();
          break;
        case '确认核心要素':
          question = generateConvergenceConfirmQuestion(state);
          break;
        default:
          // 其他问题类型，根据当前阶段重新生成
          const gaps = calculateCreativeGaps(state);
          question = await generateQuestionForGap(gaps[0], state);
          break;
      }

      return {
        context: {
          ...context,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }

    // 处理模糊回答
    if (isVagueAnswer(userInput) && context.lastQuestion) {
      const gaps = calculateCreativeGaps(state);
      const question = await generateQuestionForGap(gaps[0], state);

      return {
        context: {
          ...context,
          lastQuestion: question
        },
        toolCall: generateAskUserQuestionCall(question)
      };
    }
  }

  // 收敛阶段
  if (state.currentPhase === 'convergence') {
    const echo = buildConvergenceEcho(state);
    const question = generateConvergenceConfirmQuestion(state);

    return {
      context: {
        ...context,
        lastQuestion: question
      },
      response: echo,
      toolCall: generateAskUserQuestionCall(question)
    };
  }

  // 输出阶段
  if (state.currentPhase === 'output' && state.convergenceConfirmed) {
    const qualityCheck = runFullQualityCheck(state);
    const qualityReport = generateQualityReport(qualityCheck);
    const finalOutput = await buildOutputForMode(state);

    return {
      context,
      response: finalOutput + '\n\n' + qualityReport
    };
  }

  // 正常流程，获取下一个缺口的问题
  const nextGap = getNextGap(state);
  if (nextGap) {
    const question = await generateQuestionForGap(nextGap, state);

    return {
      context: {
        ...context,
        lastQuestion: question
      },
      toolCall: generateAskUserQuestionCall(question)
    };
  }

  // 默认情况，询问创意状态
  const question = generateInitialStatusQuestion();
  return {
    context: {
      ...context,
      lastQuestion: question
    },
    toolCall: generateAskUserQuestionCall(question)
  };
}

/**
 * 技能主函数
 */
export async function runSkill(userInput?: string, context?: SkillContext): Promise<any> {
  // 初始化上下文
  let currentContext = context || initializeContext();

  // 处理用户输入
  if (userInput && !currentContext.isFirstRun) {
    currentContext = processUserAnswer(userInput, currentContext);
  }

  // 生成下一个操作
  const nextAction = await generateNextAction(currentContext, userInput);

  return nextAction;
}

// 导出类型
export type { SkillContext };
