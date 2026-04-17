/**
 * 提示词生成模块
 * 按照模板和最佳实践自动组装三种工作模式的提示词包
 */

import { SkillState, WorkMode } from './state-manager';
import { buildCharacterDescription, buildSceneDescription, buildStyleDescription, buildShotDescription, buildMotionDescription, buildOneSentenceCharacter, buildCharacterSummary } from './convergence-builder';
import { loadBestPractices } from './reference-loader';

/**
 * 生成SeedDream角色稿提示词
 */
export async function buildSeedreamPrompt(state: SkillState): Promise<string> {
  const bestPractices = await loadBestPractices();
  const characterDesc = buildCharacterDescription(state);
  const sceneDesc = buildSceneDescription(state);

  let prompt = `# SeedDream 角色提示词\n\n`;
  prompt += `## 角色设定\n`;
  prompt += `${characterDesc}\n\n`;
  prompt += `## 场景设定\n`;
  prompt += `${sceneDesc}\n\n`;
  prompt += `## 风格设定\n`;
  prompt += `古风，国风，高质量，8K，细节丰富\n\n`;
  prompt += `## 最佳实践提示\n`;
  prompt += bestPractices.seedream.slice(0, 5).map(item => `- ${item}`).join('\n');

  return prompt;
}

/**
 * 生成Seedance视频提示词
 */
export async function buildSeeddancePrompt(state: SkillState, withReference: boolean = false): Promise<string> {
  const bestPractices = await loadBestPractices();
  const characterDesc = buildCharacterDescription(state);
  const sceneDesc = buildSceneDescription(state);
  const styleDesc = buildStyleDescription(state);
  const shotDesc = buildShotDescription(state);
  const motionDesc = buildMotionDescription(state);

  let prompt = `# Seedance 视频提示词\n\n`;

  if (withReference) {
    prompt += `## 参考图说明\n`;
    prompt += `使用已生成的SeedDream角色图作为参考，保持角色一致性\n\n`;
  }

  prompt += `## 核心角色\n`;
  prompt += `${characterDesc}\n\n`;
  prompt += `## 场景环境\n`;
  prompt += `${sceneDesc}\n\n`;
  prompt += `## 视觉风格\n`;
  prompt += `${styleDesc}\n\n`;
  prompt += `## 镜头设计\n`;
  prompt += `${shotDesc}\n\n`;
  prompt += `## 动作设计\n`;
  prompt += `${motionDesc}\n\n`;

  if (state.effects.active && state.effects.confirmed) {
    const { source, intensity, timing } = state.effects.data;
    prompt += `## 特效设计\n`;
    prompt += `${source}，强度：${intensity}，时机：${timing}\n\n`;
  }

  prompt += `## 最佳实践提示\n`;
  prompt += bestPractices.seeddance.slice(0, 5).map(item => `- ${item}`).join('\n');

  return prompt;
}

/**
 * 生成质量检查报告
 */
export async function buildQualityCheckReport(state: SkillState): Promise<string> {
  const bestPractices = await loadBestPractices();
  const checks: string[] = [];

  // 时长检查
  if (state.duration.confirmed) {
    const duration = state.duration.value;
    const shotCount = Object.keys(state.shot.data).length;
    if (duration <= 6 && shotCount > 2) {
      checks.push(`⚠️ 时长匹配度：${duration}秒视频建议镜头切换不超过2次，当前有${shotCount}个镜头设计，可能节奏过快`);
    } else if (duration <= 10 && shotCount > 3) {
      checks.push(`⚠️ 时长匹配度：${duration}秒视频建议镜头切换不超过3次，当前有${shotCount}个镜头设计，可能节奏过快`);
    } else {
      checks.push(`✅ 时长匹配度：${duration}秒视频与镜头设计匹配良好`);
    }
  } else {
    checks.push(`⚠️ 时长匹配度：未设置视频时长`);
  }

  // 信息完整性检查
  const requiredFields = [
    state.character.confirmed ? '角色设定' : null,
    state.scene.confirmed ? '场景设定' : null,
    state.workMode !== 'character_only' && state.videoStyle.confirmed ? '风格设定' : null,
    state.workMode !== 'character_only' && state.duration.confirmed ? '时长设定' : null,
    state.workMode !== 'character_only' && state.shot.confirmed ? '镜头设定' : null,
    state.workMode !== 'character_only' && state.motion.confirmed ? '动作设定' : null
  ].filter(Boolean);

  if (requiredFields.length === (state.workMode === 'character_only' ? 2 : 6)) {
    checks.push(`✅ 信息完整性：所有核心要素均已确认`);
  } else {
    checks.push(`⚠️ 信息完整性：缺少${(state.workMode === 'character_only' ? 2 : 6) - requiredFields.length}项核心要素`);
  }

  // 特效风险检查
  if (state.effects.active) {
    checks.push(`⚠️ 特效风险：已启用特效，建议控制特效强度避免遮挡角色主体`);
  } else {
    checks.push(`✅ 特效风险：无特效，不会出现特效抢戏问题`);
  }

  // 清晰度检查
  const characterParts = Object.keys(state.character.data).length;
  if (characterParts >= 4) {
    checks.push(`✅ 提示词清晰度：角色设定细节丰富，生成结果一致性高`);
  } else {
    checks.push(`⚠️ 提示词清晰度：角色设定细节较少，可能导致生成结果不稳定`);
  }

  let report = `## 质检与修正建议\n\n`;
  report += checks.join('\n\n');
  report += `\n\n`;
  report += `### 参考最佳实践\n`;
  report += bestPractices.qc.slice(0, 3).map(item => `- ${item}`).join('\n');

  return report;
}

/**
 * 生成仅角色稿模式的完整输出
 */
export async function buildCharacterOnlyOutput(state: SkillState): Promise<string> {
  const characterSummary = buildCharacterSummary(state);
  const oneSentenceCharacter = buildOneSentenceCharacter(state);
  const seedreamPrompt = await buildSeedreamPrompt(state);
  const qcReport = await buildQualityCheckReport(state);

  let output = `# ${oneSentenceCharacter} 角色设定\n\n`;
  output += `## 角色脸谱摘要\n`;
  output += `${characterSummary}\n\n`;
  output += `## 一句话角色定义\n`;
  output += `${oneSentenceCharacter}\n\n`;
  output += `${seedreamPrompt}\n\n`;
  output += `${qcReport}`;

  return output;
}

/**
 * 生成仅视频模式的完整输出
 */
export async function buildVideoOnlyOutput(state: SkillState): Promise<string> {
  const characterSummary = buildCharacterSummary(state);
  const oneSentenceCharacter = buildOneSentenceCharacter(state);
  const seeddancePrompt = await buildSeeddancePrompt(state, false);
  const qcReport = await buildQualityCheckReport(state);

  let output = `# ${oneSentenceCharacter} Seedance 视频提示词\n\n`;
  output += `## 角色脸谱摘要\n`;
  output += `${characterSummary}\n\n`;
  output += `## 一句话角色定义\n`;
  output += `${oneSentenceCharacter}\n\n`;
  output += `## 角色设计摘要\n`;
  output += `${buildCharacterDescription(state)}\n\n`;
  output += `## 场景设计摘要\n`;
  output += `${buildSceneDescription(state)}\n\n`;
  output += `## 视频风格摘要\n`;
  output += `${buildStyleDescription(state)}\n\n`;
  output += `## 镜头设计摘要\n`;
  output += `${buildShotDescription(state)}\n\n`;
  output += `## 动作设计摘要\n`;
  output += `${buildMotionDescription(state)}\n\n`;
  output += `${seeddancePrompt}\n\n`;
  output += `${qcReport}`;

  return output;
}

/**
 * 生成整链路模式的完整输出
 */
export async function buildFullChainOutput(state: SkillState): Promise<string> {
  const characterSummary = buildCharacterSummary(state);
  const oneSentenceCharacter = buildOneSentenceCharacter(state);
  const seedreamPrompt = await buildSeedreamPrompt(state);
  const seeddancePromptNoRef = await buildSeeddancePrompt(state, false);
  const seeddancePromptWithRef = await buildSeeddancePrompt(state, true);
  const qcReport = await buildQualityCheckReport(state);

  let output = `# ${oneSentenceCharacter} 整链路提示词包\n\n`;
  output += `## 角色脸谱摘要\n`;
  output += `${characterSummary}\n\n`;
  output += `## 一句话角色定义\n`;
  output += `${oneSentenceCharacter}\n\n`;
  output += `---\n\n`;
  output += `## SeedDream 角色稿提示词\n`;
  output += `${seedreamPrompt.replace('# SeedDream 角色提示词\n\n', '')}\n\n`;
  output += `### 参考图筛选要点\n`;
  output += `- 角色五官、脸型符合设定\n`;
  output += `- 服装、发型、配饰准确\n`;
  output += `- 气质、表情符合角色定位\n\n`;
  output += `---\n\n`;
  output += `## Seedance 视频提示词（无参考图版本）\n`;
  output += `${seeddancePromptNoRef.replace('# Seedance 视频提示词\n\n', '')}\n\n`;
  output += `---\n\n`;
  output += `## Seedance 视频提示词（有参考图版本）\n`;
  output += `${seeddancePromptWithRef.replace('# Seedance 视频提示词\n\n', '')}\n\n`;
  output += `---\n\n`;
  output += `${qcReport}`;

  return output;
}

/**
 * 根据工作模式生成对应的输出
 */
export async function buildOutputForMode(state: SkillState): Promise<string> {
  switch (state.workMode) {
    case 'character_only':
      return await buildCharacterOnlyOutput(state);
    case 'video_only':
      return await buildVideoOnlyOutput(state);
    case 'full_chain':
      return await buildFullChainOutput(state);
    default:
      return await buildVideoOnlyOutput(state);
  }
}
