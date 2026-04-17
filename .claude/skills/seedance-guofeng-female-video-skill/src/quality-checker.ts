/**
 * 自动质检模块
 * 输出前自动检查时长匹配度、信息密度、特效风险、提示词清晰度等
 */

import { SkillState, WorkMode } from './state-manager';

/**
 * 质检结果接口
 */
export interface QualityCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

/**
 * 检查时长匹配度
 */
export function checkDurationMatch(state: SkillState): { passed: boolean; warning?: string } {
  if (!state.duration.confirmed || state.workMode === 'character_only') {
    return { passed: true };
  }

  const duration = state.duration.value;
  const shotCount = Object.keys(state.shot.data).filter(key => key !== 'rhythm').length;

  // 时长与镜头数量匹配规则
  const maxShots: Record<number, number> = {
    5: 2,
    6: 2,
    8: 3,
    10: 3,
    12: 4,
    15: 4,
    20: 5
  };

  // 找到最接近的时长档位
  const durationKeys = Object.keys(maxShots).map(Number).sort((a, b) => a - b);
  let maxAllowedShots = 3; // 默认值

  for (const key of durationKeys) {
    if (duration <= key) {
      maxAllowedShots = maxShots[key];
      break;
    }
  }

  if (shotCount > maxAllowedShots) {
    return {
      passed: false,
      warning: `${duration}秒视频建议镜头切换不超过${maxAllowedShots}次，当前有${shotCount}个镜头设计，可能导致节奏过快`
    };
  }

  return { passed: true };
}

/**
 * 检查信息密度
 */
export function checkInformationDensity(state: SkillState): { passed: boolean; warning?: string } {
  const characterFieldCount = Object.keys(state.character.data).length;
  const sceneFieldCount = Object.keys(state.scene.data).length;

  const warnings: string[] = [];

  // 角色信息检查
  if (characterFieldCount < 3) {
    warnings.push('角色设定信息较少，建议补充更多细节以提高生成结果一致性');
  }

  // 场景信息检查
  if (sceneFieldCount < 2) {
    warnings.push('场景设定信息较少，建议补充更多细节以提高生成结果稳定性');
  }

  // 视频模式额外检查
  if (state.workMode !== 'character_only') {
    const styleFieldCount = Object.keys(state.videoStyle.data).length;
    const motionFieldCount = Object.keys(state.motion.data).length;

    if (styleFieldCount < 2) {
      warnings.push('视频风格设定信息较少，建议补充更多细节');
    }

    if (motionFieldCount < 2) {
      warnings.push('动作设计信息较少，建议补充更多细节');
    }
  }

  return {
    passed: warnings.length === 0,
    warning: warnings.join('；')
  };
}

/**
 * 检查特效风险
 */
export function checkEffectsRisk(state: SkillState): { passed: boolean; warning?: string } {
  if (!state.effects.active || state.workMode === 'character_only') {
    return { passed: true };
  }

  const effectsFields = Object.keys(state.effects.data).length;

  if (effectsFields === 0) {
    return {
      passed: false,
      warning: '已启用特效但未设置具体参数，建议补充特效细节'
    };
  }

  // 检查是否有遮挡风险
  if (state.effects.data.intensity === '高' || state.effects.data.intensity === '极强') {
    return {
      passed: false,
      warning: '特效强度设置较高，请注意避免特效遮挡角色面部和身体主体'
    };
  }

  return { passed: true };
}

/**
 * 检查提示词清晰度
 */
export function checkPromptClarity(state: SkillState): { passed: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const vagueWords = ['好看', '漂亮', '酷炫', '牛逼', '一般', '普通'];

  // 检查角色描述中的模糊词汇
  const characterDesc = Object.values(state.character.data).join(' ');
  for (const word of vagueWords) {
    if (characterDesc.includes(word)) {
      warnings.push(`角色描述中包含模糊词汇"${word}"，建议替换为更具体的描述`);
    }
  }

  // 检查场景描述中的模糊词汇
  const sceneDesc = Object.values(state.scene.data).join(' ');
  for (const word of vagueWords) {
    if (sceneDesc.includes(word)) {
      warnings.push(`场景描述中包含模糊词汇"${word}"，建议替换为更具体的描述`);
    }
  }

  return {
    passed: warnings.length === 0,
    warnings
  };
}

/**
 * 检查要素冲突
 */
export function checkElementConflicts(state: SkillState): { passed: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const temperament = state.character.data.temperament || '';
  const motion = state.motion.data.motif || '';
  const style = state.videoStyle.data.aestheticDirection || '';

  // 气质与动作冲突检查
  if ((temperament.includes('清冷') || temperament.includes('温柔') || temperament.includes('娴静')) &&
      (motion.includes('打斗') || motion.includes('奔跑') || motion.includes('剧烈'))) {
    warnings.push('角色气质偏安静，但动作设计偏剧烈，可能存在风格冲突');
  }

  // 风格与场景冲突检查
  if ((style.includes('写实') || style.includes('真实')) &&
      (state.scene.data.space?.includes('天宫') || state.scene.data.space?.includes('仙境'))) {
    warnings.push('视频风格偏写实，但场景设定偏玄幻，可能存在风格冲突');
  }

  return {
    passed: warnings.length === 0,
    warnings
  };
}

/**
 * 执行完整质量检查
 */
export function runFullQualityCheck(state: SkillState): QualityCheckResult {
  const result: QualityCheckResult = {
    passed: true,
    warnings: [],
    errors: [],
    suggestions: []
  };

  // 时长匹配检查
  const durationCheck = checkDurationMatch(state);
  if (!durationCheck.passed && durationCheck.warning) {
    result.warnings.push(durationCheck.warning);
  }

  // 信息密度检查
  const densityCheck = checkInformationDensity(state);
  if (!densityCheck.passed && densityCheck.warning) {
    result.warnings.push(densityCheck.warning);
  }

  // 特效风险检查
  const effectsCheck = checkEffectsRisk(state);
  if (!effectsCheck.passed && effectsCheck.warning) {
    result.warnings.push(effectsCheck.warning);
  }

  // 提示词清晰度检查
  const clarityCheck = checkPromptClarity(state);
  if (!clarityCheck.passed) {
    result.warnings.push(...clarityCheck.warnings);
  }

  // 要素冲突检查
  const conflictCheck = checkElementConflicts(state);
  if (!conflictCheck.passed) {
    result.warnings.push(...conflictCheck.warnings);
  }

  // 必须项检查
  if (!state.character.confirmed) {
    result.errors.push('角色设定未确认，无法生成最终提示词');
  }

  if (!state.scene.confirmed) {
    result.errors.push('场景设定未确认，无法生成最终提示词');
  }

  if (state.workMode !== 'character_only') {
    if (!state.videoStyle.confirmed) {
      result.errors.push('视频风格设定未确认，无法生成最终提示词');
    }
    if (!state.duration.confirmed) {
      result.errors.push('视频时长未确认，无法生成最终提示词');
    }
    if (!state.shot.confirmed) {
      result.errors.push('镜头设计未确认，无法生成最终提示词');
    }
    if (!state.motion.confirmed) {
      result.errors.push('动作设计未确认，无法生成最终提示词');
    }
  }

  // 总体通过判断
  result.passed = result.errors.length === 0;

  // 生成建议
  if (result.warnings.length > 0) {
    result.suggestions.push('建议根据以上警告调整相关设定，以获得更好的生成效果');
  }

  if (result.passed) {
    result.suggestions.push('所有核心要素已确认，可以生成最终提示词');
  }

  return result;
}

/**
 * 生成质检报告文本
 */
export function generateQualityReport(result: QualityCheckResult): string {
  let report = '## 质量检查报告\n\n';

  if (result.passed) {
    report += '✅ **检查通过**：所有核心要素均已完整确认\n\n';
  } else {
    report += '❌ **检查未通过**：存在以下必须修正的问题\n\n';
    for (const error of result.errors) {
      report += `- ${error}\n`;
    }
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += '⚠️ **警告信息**：存在以下可能影响生成效果的问题\n\n';
    for (const warning of result.warnings) {
      report += `- ${warning}\n`;
    }
    report += '\n';
  }

  if (result.suggestions.length > 0) {
    report += '💡 **优化建议**\n\n';
    for (const suggestion of result.suggestions) {
      report += `- ${suggestion}\n`;
    }
  }

  return report;
}
