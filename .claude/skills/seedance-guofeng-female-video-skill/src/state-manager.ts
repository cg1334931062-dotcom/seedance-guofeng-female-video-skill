/**
 * 状态管理模块
 * 跟踪用户选择、已确认要素和当前流程阶段，计算创作缺口
 */

// 创意状态类型
export type CreativeStatus = 'no_idea' | 'vague' | 'clear';

// 工作模式类型
export type WorkMode = 'video_only' | 'full_chain' | 'character_only';

// 流程阶段类型
export type Phase = 'inspiration' | 'character' | 'scene' | 'style' | 'shot' | 'motion' | 'effects' | 'convergence' | 'output';

// 角色数据接口
export interface CharacterData {
  identity?: string; // 身份
  ageSense?: string; // 年龄感
  temperament?: string; // 气质
  hairstyle?: string; // 发型
  makeup?: string; // 妆容
  clothing?: string; // 服装
  weapon?: string; // 武器
  memoryPoint?: string; // 记忆点
}

// 场景数据接口
export interface SceneData {
  space?: string; // 空间
  light?: string; // 光线
  relationship?: string; // 与角色的关系
  compositionAnchor?: string; // 构图锚点
}

// 视频风格数据接口
export interface VideoStyleData {
  aestheticDirection?: string; // 美学方向
  colorPalette?: string; // 色彩
  technique?: string; // 手法
  emotionalSpine?: string; // 情绪主轴
}

// 镜头数据接口
export interface ShotData {
  entrance?: string; // 入口镜头
  progression?: string; // 推进
  ending?: string; // 收尾
  rhythm?: string; // 传播节奏
}

// 动作数据接口
export interface MotionData {
  motif?: string; // 动作母题
  bodyLanguage?: string; // 身体语言
  powerExpression?: string; // 力量表达
}

// 特效数据接口
export interface EffectsData {
  source?: string; // 来源
  intensity?: string; // 强度
  timing?: string; // 时机
  relationship?: string; // 与角色的关系
}

// 技能状态接口
export interface SkillState {
  // 用户状态
  creativeStatus: CreativeStatus;
  workMode: WorkMode;

  // 核心要素确认状态
  character: {
    confirmed: boolean;
    data: CharacterData;
  };
  scene: {
    confirmed: boolean;
    data: SceneData;
  };
  videoStyle: {
    confirmed: boolean;
    data: VideoStyleData;
  };
  duration: {
    confirmed: boolean;
    value: number; // 秒数
  };
  shot: {
    confirmed: boolean;
    data: ShotData;
  };
  motion: {
    confirmed: boolean;
    data: MotionData;
  };
  effects: {
    active: boolean;
    confirmed: boolean;
    data: EffectsData;
  };

  // 流程状态
  currentPhase: Phase;
  creativeGaps: string[]; // 当前待补充的创作缺口
  convergenceConfirmed: boolean;
  conversationHistory: Array<{
    question: string;
    answer: string;
    timestamp: number;
  }>;
}

/**
 * 初始化默认状态
 */
export function initializeState(): SkillState {
  return {
    creativeStatus: 'no_idea',
    workMode: 'video_only',

    character: {
      confirmed: false,
      data: {}
    },
    scene: {
      confirmed: false,
      data: {}
    },
    videoStyle: {
      confirmed: false,
      data: {}
    },
    duration: {
      confirmed: false,
      value: 0
    },
    shot: {
      confirmed: false,
      data: {}
    },
    motion: {
      confirmed: false,
      data: {}
    },
    effects: {
      active: false,
      confirmed: false,
      data: {}
    },

    currentPhase: 'inspiration',
    creativeGaps: [],
    convergenceConfirmed: false,
    conversationHistory: []
  };
}

/**
 * 更新创意状态
 */
export function updateCreativeStatus(state: SkillState, status: CreativeStatus): SkillState {
  return {
    ...state,
    creativeStatus: status
  };
}

/**
 * 更新工作模式
 */
export function updateWorkMode(state: SkillState, mode: WorkMode): SkillState {
  return {
    ...state,
    workMode: mode
  };
}

/**
 * 更新角色数据
 */
export function updateCharacterData(state: SkillState, data: Partial<CharacterData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    character: {
      ...state.character,
      data: {
        ...state.character.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.character.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新场景数据
 */
export function updateSceneData(state: SkillState, data: Partial<SceneData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    scene: {
      ...state.scene,
      data: {
        ...state.scene.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.scene.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新视频风格数据
 */
export function updateVideoStyleData(state: SkillState, data: Partial<VideoStyleData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    videoStyle: {
      ...state.videoStyle,
      data: {
        ...state.videoStyle.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.videoStyle.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新时长
 */
export function updateDuration(state: SkillState, duration: number, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    duration: {
      ...state.duration,
      value: duration
    }
  };

  if (confirmed !== undefined) {
    newState.duration.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新镜头数据
 */
export function updateShotData(state: SkillState, data: Partial<ShotData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    shot: {
      ...state.shot,
      data: {
        ...state.shot.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.shot.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新动作数据
 */
export function updateMotionData(state: SkillState, data: Partial<MotionData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    motion: {
      ...state.motion,
      data: {
        ...state.motion.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.motion.confirmed = confirmed;
  }

  return newState;
}

/**
 * 更新特效数据
 */
export function updateEffectsData(state: SkillState, data: Partial<EffectsData>, confirmed?: boolean): SkillState {
  const newState = {
    ...state,
    effects: {
      ...state.effects,
      data: {
        ...state.effects.data,
        ...data
      }
    }
  };

  if (confirmed !== undefined) {
    newState.effects.confirmed = confirmed;
  }

  return newState;
}

/**
 * 激活/禁用特效层
 */
export function toggleEffectsLayer(state: SkillState, active: boolean): SkillState {
  return {
    ...state,
    effects: {
      ...state.effects,
      active
    }
  };
}

/**
 * 更新当前阶段
 */
export function updateCurrentPhase(state: SkillState, phase: Phase): SkillState {
  return {
    ...state,
    currentPhase: phase
  };
}

/**
 * 更新收敛确认状态
 */
export function updateConvergenceConfirmed(state: SkillState, confirmed: boolean): SkillState {
  return {
    ...state,
    convergenceConfirmed: confirmed
  };
}

/**
 * 添加对话历史
 */
export function addConversationHistory(state: SkillState, question: string, answer: string): SkillState {
  return {
    ...state,
    conversationHistory: [
      ...state.conversationHistory,
      {
        question,
        answer,
        timestamp: Date.now()
      }
    ]
  };
}

/**
 * 计算创作缺口
 * 按照优先级返回需要补充的要素列表
 */
export function calculateCreativeGaps(state: SkillState): string[] {
  const gaps: string[] = [];

  // 角色独特性优先级最高
  if (!state.character.confirmed) {
    const characterFields = Object.keys(state.character.data);
    if (characterFields.length < 3) {
      gaps.push('character:identity');
      gaps.push('character:temperament');
      gaps.push('character:memoryPoint');
    } else if (!state.character.data.identity || !state.character.data.temperament) {
      gaps.push('character:missing_fields');
    }
  }

  // 场景关联性
  if (!state.scene.confirmed) {
    const sceneFields = Object.keys(state.scene.data);
    if (sceneFields.length < 2) {
      gaps.push('scene:space');
      gaps.push('scene:relationship');
    } else if (!state.scene.data.space || !state.scene.data.relationship) {
      gaps.push('scene:missing_fields');
    }
  }

  // 风格明确性
  if (!state.videoStyle.confirmed && state.workMode !== 'character_only') {
    const styleFields = Object.keys(state.videoStyle.data);
    if (styleFields.length < 2) {
      gaps.push('style:aesthetic');
      gaps.push('style:color');
    } else if (!state.videoStyle.data.aestheticDirection || !state.videoStyle.data.colorPalette) {
      gaps.push('style:missing_fields');
    }
  }

  // 时长确定性
  if (!state.duration.confirmed && state.workMode !== 'character_only') {
    gaps.push('duration');
  }

  // 镜头逻辑性
  if (!state.shot.confirmed && state.workMode !== 'character_only') {
    const shotFields = Object.keys(state.shot.data);
    if (shotFields.length < 2) {
      gaps.push('shot:entrance');
      gaps.push('shot:ending');
    } else if (!state.shot.data.entrance || !state.shot.data.ending) {
      gaps.push('shot:missing_fields');
    }
  }

  // 动作匹配性
  if (!state.motion.confirmed && state.workMode !== 'character_only') {
    const motionFields = Object.keys(state.motion.data);
    if (motionFields.length < 2) {
      gaps.push('motion:motif');
      gaps.push('motion:bodyLanguage');
    } else if (!state.motion.data.motif || !state.motion.data.bodyLanguage) {
      gaps.push('motion:missing_fields');
    }
  }

  // 特效（如果激活）
  if (state.effects.active && !state.effects.confirmed && state.workMode !== 'character_only') {
    gaps.push('effects');
  }

  return gaps;
}

/**
 * 检查是否可以进入收敛阶段
 */
export function canEnterConvergence(state: SkillState): boolean {
  const baseRequirements = state.character.confirmed && state.scene.confirmed;

  if (state.workMode === 'character_only') {
    return baseRequirements;
  }

  return baseRequirements &&
    state.videoStyle.confirmed &&
    state.duration.confirmed &&
    state.shot.confirmed &&
    state.motion.confirmed &&
    (!state.effects.active || state.effects.confirmed);
}

/**
 * 获取下一个需要处理的缺口
 */
export function getNextGap(state: SkillState): string | null {
  const gaps = calculateCreativeGaps(state);
  return gaps.length > 0 ? gaps[0] : null;
}

/**
 * 回退到指定阶段进行修改
 */
export function rollbackToPhase(state: SkillState, phase: Phase): SkillState {
  const newState = { ...state };

  // 重置对应阶段的确认状态
  switch (phase) {
    case 'character':
      newState.character.confirmed = false;
      break;
    case 'scene':
      newState.scene.confirmed = false;
      break;
    case 'style':
      newState.videoStyle.confirmed = false;
      break;
    case 'shot':
      newState.shot.confirmed = false;
      break;
    case 'motion':
      newState.motion.confirmed = false;
      break;
    case 'effects':
      newState.effects.confirmed = false;
      break;
  }

  newState.currentPhase = phase;
  newState.convergenceConfirmed = false;

  return newState;
}
