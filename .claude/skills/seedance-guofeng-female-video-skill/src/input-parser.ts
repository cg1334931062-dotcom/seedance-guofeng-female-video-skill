/**
 * 输入解析模块
 * 解析用户输入，自动识别创意状态和工作模式
 */

import { CreativeStatus, WorkMode, SkillState, updateCreativeStatus, updateWorkMode } from './state-manager';

/**
 * 关键词匹配规则
 */
const KEYWORDS = {
  // 工作模式关键词
  workMode: {
    video_only: ['视频', '镜头', '运镜', '时长', 'Seedance', '动态', '动画', '短片'],
    full_chain: ['先角色稿再视频', '同时要', '角色稿+视频', '整链路', '完整流程', 'SeedDream和Seedance'],
    character_only: ['立绘', '海报', '角色设定图', 'SeedDream', '静态', '图片', '画像']
  },

  // 核心要素关键词
  character: ['女侠', '仙女', '公主', '刺客', '剑客', '法师', '妖女', '舞女', '琴师', '医者', '角色', '人物', '形象'],
  scene: ['场景', '环境', '背景', '山水', '宫殿', '竹林', '沙漠', '雪地', '楼阁', '庭院', '街道'],
  style: ['风格', '质感', '色调', '光影', '唯美', '写实', '水墨', '古风', '仙侠', '武侠', '敦煌', '唐风', '宋韵'],
  duration: ['秒', '时长', '时间', '长度', '5秒', '8秒', '10秒', '15秒', '短', '长'],
  shot: ['镜头', '运镜', '特写', '全景', '中景', '推镜', '拉镜', '摇镜', '跟拍', '转场'],
  motion: ['动作', '舞姿', '剑法', '打斗', '飞舞', '行走', '转身', '抬手', '眼神', '表情'],
  effects: ['特效', '光影', '粒子', '法术', '仙气', '妖气', '光芒', '烟雾', '火花', '星光']
};

/**
 * 解析用户输入，提取关键词
 */
export function extractKeywords(input: string): {
  workModeKeywords: string[];
  characterKeywords: string[];
  sceneKeywords: string[];
  styleKeywords: string[];
  durationKeywords: string[];
  shotKeywords: string[];
  motionKeywords: string[];
  effectsKeywords: string[];
} {
  const lowerInput = input.toLowerCase();

  return {
    workModeKeywords: Object.values(KEYWORDS.workMode).flat().filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    characterKeywords: KEYWORDS.character.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    sceneKeywords: KEYWORDS.scene.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    styleKeywords: KEYWORDS.style.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    durationKeywords: KEYWORDS.duration.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    shotKeywords: KEYWORDS.shot.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    motionKeywords: KEYWORDS.motion.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    ),
    effectsKeywords: KEYWORDS.effects.filter(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    )
  };
}

/**
 * 识别创意状态
 * 完全没想法：无任何核心要素关键词
 * 有模糊感觉：存在1-3个核心要素关键词，但无具体细节
 * 已有明确方向：存在3个以上核心要素关键词，且有具体描述
 */
export function identifyCreativeStatus(input: string, keywords: ReturnType<typeof extractKeywords>): CreativeStatus {
  const coreKeywordCount =
    keywords.characterKeywords.length +
    keywords.sceneKeywords.length +
    keywords.styleKeywords.length +
    keywords.durationKeywords.length +
    keywords.shotKeywords.length +
    keywords.motionKeywords.length;

  if (coreKeywordCount === 0) {
    return 'no_idea';
  } else if (coreKeywordCount <= 3) {
    // 检查是否有具体描述（字数超过15字且有形容词）
    const hasSpecificDescription = input.length > 15 && /的|很|非常|超级|比较/.test(input);
    return hasSpecificDescription ? 'clear' : 'vague';
  } else {
    return 'clear';
  }
}

/**
 * 识别工作模式
 * 优先级：整链路 > 仅角色稿 > 仅视频（默认）
 */
export function identifyWorkMode(keywords: ReturnType<typeof extractKeywords>): WorkMode {
  // 检查整链路关键词
  if (keywords.workModeKeywords.some(kw => KEYWORDS.workMode.full_chain.includes(kw))) {
    return 'full_chain';
  }

  // 检查仅角色稿关键词
  if (keywords.workModeKeywords.some(kw => KEYWORDS.workMode.character_only.includes(kw))) {
    return 'character_only';
  }

  // 默认仅视频模式
  return 'video_only';
}

/**
 * 提取时长信息
 */
export function extractDuration(input: string): number | null {
  // 匹配数字+秒的格式
  const durationMatch = input.match(/(\d+)\s*秒/);
  if (durationMatch) {
    return parseInt(durationMatch[1], 10);
  }

  // 匹配模糊描述
  if (/短|短视频|快|快速/.test(input)) {
    return 6; // 默认6秒
  }
  if (/长|长视频|慢/.test(input)) {
    return 15; // 默认15秒
  }

  return null;
}

/**
 * 处理用户初始输入，更新状态
 */
export function processInitialInput(input: string, state: SkillState): SkillState {
  const keywords = extractKeywords(input);
  const creativeStatus = identifyCreativeStatus(input, keywords);
  const workMode = identifyWorkMode(keywords);
  const duration = extractDuration(input);

  let newState = updateCreativeStatus(state, creativeStatus);
  newState = updateWorkMode(newState, workMode);

  // 如果提取到时长，更新到状态
  if (duration) {
    newState.duration.value = duration;
    // 如果有明确的时长数字，标记为已确认
    if (/\d+\s*秒/.test(input)) {
      newState.duration.confirmed = true;
    }
  }

  return newState;
}

/**
 * 检查用户是否想要修改某个要素
 */
export function checkModifyRequest(input: string): { phase: string | null; field: string | null } {
  const lowerInput = input.toLowerCase();

  // 匹配修改请求
  if (/改|修改|调整|换|想要改|我要改/.test(lowerInput)) {
    // 角色相关
    if (/角色|人物|形象|脸|发型|服装|气质/.test(lowerInput)) {
      return { phase: 'character', field: null };
    }
    // 场景相关
    if (/场景|环境|背景|光线/.test(lowerInput)) {
      return { phase: 'scene', field: null };
    }
    // 风格相关
    if (/风格|色调|光影|质感/.test(lowerInput)) {
      return { phase: 'style', field: null };
    }
    // 时长相关
    if (/时长|时间|秒|长度/.test(lowerInput)) {
      return { phase: 'duration', field: null };
    }
    // 镜头相关
    if (/镜头|运镜|转场|画面/.test(lowerInput)) {
      return { phase: 'shot', field: null };
    }
    // 动作相关
    if (/动作|舞姿|表情|眼神/.test(lowerInput)) {
      return { phase: 'motion', field: null };
    }
    // 特效相关
    if (/特效|光影|法术|效果/.test(lowerInput)) {
      return { phase: 'effects', field: null };
    }
  }

  return { phase: null, field: null };
}

/**
 * 检查是否是模糊回答
 */
export function isVagueAnswer(input: string): boolean {
  const vaguePhrases = ['差不多', '都行', '你定', '随便', '都可以', '无所谓', '看着办', '随便吧', '都行吧', '都ok'];
  return vaguePhrases.some(phrase => input.includes(phrase));
}
