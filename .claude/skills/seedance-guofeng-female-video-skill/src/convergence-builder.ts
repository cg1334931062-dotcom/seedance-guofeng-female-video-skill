/**
 * 收敛回显模块
 * 所有核心要素确认后，生成结构化回显供用户确认
 */

import { SkillState, WorkMode } from './state-manager';

/**
 * 生成角色定型描述
 */
export function buildCharacterDescription(state: SkillState): string {
  const { identity, temperament, ageSense, clothing, weapon, memoryPoint } = state.character.data;
  const parts: string[] = [];

  if (identity) parts.push(identity);
  if (ageSense) parts.push(ageSense);
  if (temperament) parts.push(temperament);
  if (clothing) parts.push(`身着${clothing}`);
  if (weapon) parts.push(`手持${weapon}`);
  if (memoryPoint) parts.push(`标志性特征：${memoryPoint}`);

  return parts.join('，');
}

/**
 * 生成场景定型描述
 */
export function buildSceneDescription(state: SkillState): string {
  const { space, light, relationship, compositionAnchor } = state.scene.data;
  const parts: string[] = [];

  if (space) parts.push(space);
  if (light) parts.push(`${light}光线`);
  if (relationship) parts.push(relationship);
  if (compositionAnchor) parts.push(`构图聚焦于${compositionAnchor}`);

  return parts.join('，');
}

/**
 * 生成视频风格描述
 */
export function buildStyleDescription(state: SkillState): string {
  const { aestheticDirection, colorPalette, technique, emotionalSpine } = state.videoStyle.data;
  const parts: string[] = [];

  if (aestheticDirection) parts.push(aestheticDirection);
  if (colorPalette) parts.push(`${colorPalette}色调`);
  if (technique) parts.push(`采用${technique}手法`);
  if (emotionalSpine) parts.push(`情绪基调：${emotionalSpine}`);

  return parts.join('，');
}

/**
 * 生成镜头设计描述
 */
export function buildShotDescription(state: SkillState): string {
  const { entrance, progression, ending, rhythm } = state.shot.data;
  const parts: string[] = [];

  if (entrance) parts.push(`入口：${entrance}`);
  if (progression) parts.push(`推进：${progression}`);
  if (ending) parts.push(`收尾：${ending}`);
  if (rhythm) parts.push(`节奏：${rhythm}`);
  if (state.duration.confirmed) parts.push(`总时长：${state.duration.value}秒`);

  return parts.join('，');
}

/**
 * 生成动作设计描述
 */
export function buildMotionDescription(state: SkillState): string {
  const { motif, bodyLanguage, powerExpression } = state.motion.data;
  const parts: string[] = [];

  if (motif) parts.push(`核心动作：${motif}`);
  if (bodyLanguage) parts.push(`身体语言：${bodyLanguage}`);
  if (powerExpression) parts.push(`力量表达：${powerExpression}`);

  return parts.join('，');
}

/**
 * 生成特效描述
 */
export function buildEffectsDescription(state: SkillState): string {
  if (!state.effects.active) return '无特效';

  const { source, intensity, timing, relationship } = state.effects.data;
  const parts: string[] = [];

  if (source) parts.push(source);
  if (intensity) parts.push(`强度：${intensity}`);
  if (timing) parts.push(`时机：${timing}`);
  if (relationship) parts.push(`与角色关系：${relationship}`);

  return parts.length > 0 ? parts.join('，') : '有特效';
}

/**
 * 生成六项收敛回显内容
 */
export function buildConvergenceEcho(state: SkillState): string {
  const characterDesc = buildCharacterDescription(state);
  const sceneDesc = buildSceneDescription(state);

  let echo = `## 六项收敛回显\n\n`;
  echo += `**角色定型**：${characterDesc || '未设定'}\n`;
  echo += `  → 身份、气质、记忆点摘要\n\n`;
  echo += `**场景定型**：${sceneDesc || '未设定'}\n\n`;

  // 仅角色稿模式不需要以下内容
  if (state.workMode === 'character_only') {
    return echo;
  }

  const styleDesc = buildStyleDescription(state);
  const shotDesc = buildShotDescription(state);
  const motionDesc = buildMotionDescription(state);
  const effectsDesc = buildEffectsDescription(state);

  echo += `**视频风格**：${styleDesc || '未设定'}\n\n`;
  echo += `**时长与节奏**：${state.duration.confirmed ? `${state.duration.value}秒` : '未设定'} ${state.shot.data.rhythm || ''}\n\n`;
  echo += `**镜头设计**：${shotDesc || '未设定'}\n\n`;
  echo += `**动作设计**：${motionDesc || '未设定'}\n\n`;

  if (state.effects.active) {
    echo += `**特效设计**：${effectsDesc}\n\n`;
  }

  return echo;
}

/**
 * 生成一句话角色定义（用于输出）
 */
export function buildOneSentenceCharacter(state: SkillState): string {
  const { identity, temperament, clothing } = state.character.data;
  const parts: string[] = [];

  if (temperament) parts.push(temperament);
  if (identity) parts.push(identity);
  if (clothing) parts.push(`穿着${clothing}`);

  return parts.join('的') || '古风女性角色';
}

/**
 * 生成角色脸谱摘要
 */
export function buildCharacterSummary(state: SkillState): string {
  const { identity, temperament, ageSense, hairstyle, makeup, clothing, weapon, memoryPoint } = state.character.data;
  const parts: string[] = [];

  if (identity) parts.push(`身份：${identity}`);
  if (ageSense) parts.push(`年龄感：${ageSense}`);
  if (temperament) parts.push(`气质：${temperament}`);
  if (hairstyle) parts.push(`发型：${hairstyle}`);
  if (makeup) parts.push(`妆容：${makeup}`);
  if (clothing) parts.push(`服装：${clothing}`);
  if (weapon) parts.push(`武器：${weapon}`);
  if (memoryPoint) parts.push(`记忆点：${memoryPoint}`);

  return parts.join(' | ');
}
