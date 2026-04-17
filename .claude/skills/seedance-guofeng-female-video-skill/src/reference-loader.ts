/**
 * 参考资源加载模块
 * 根据当前创作缺口自动读取对应参考资源，生成差异化的美学选项
 */

import * as fs from 'fs';
import * as path from 'path';

// 参考资源目录路径
const REFERENCES_DIR = path.join(__dirname, '..', 'references');

/**
 * 参考资源类型映射
 */
export const REFERENCE_MAPPING: Record<string, string[]> = {
  // 角色相关缺口
  'character:identity': ['guofeng-female-inspiration.md'],
  'character:temperament': ['guofeng-female-inspiration.md'],
  'character:memoryPoint': ['guofeng-female-inspiration.md'],
  'character:missing_fields': ['guofeng-female-inspiration.md'],

  // 场景相关缺口
  'scene:space': ['scene-design-inspiration.md'],
  'scene:relationship': ['scene-design-inspiration.md'],
  'scene:missing_fields': ['scene-design-inspiration.md'],

  // 风格相关缺口
  'style:aesthetic': ['video-style-inspiration.md'],
  'style:color': ['video-style-inspiration.md'],
  'style:missing_fields': ['video-style-inspiration.md'],

  // 镜头相关缺口
  'shot:entrance': ['guofeng-female-shot-inspiration.md'],
  'shot:ending': ['guofeng-female-shot-inspiration.md'],
  'shot:missing_fields': ['guofeng-female-shot-inspiration.md'],

  // 动作相关缺口
  'motion:motif': ['guofeng-female-motion-inspiration.md'],
  'motion:bodyLanguage': ['guofeng-female-motion-inspiration.md'],
  'motion:missing_fields': ['guofeng-female-motion-inspiration.md'],

  // 特效相关缺口
  'effects': ['effects-design-inspiration.md'],

  // 输出前加载最佳实践
  'output': ['seedream-best-practices.md', 'seeddance-best-practices.md', 'video-prompt-qc.md']
};

/**
 * 读取参考资源文件内容
 */
export async function readReferenceFile(filename: string): Promise<string> {
  const filePath = path.join(REFERENCES_DIR, filename);
  try {
    return await fs.promises.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`读取参考资源文件失败: ${filename}`, error);
    return '';
  }
}

/**
 * 根据缺口类型获取需要读取的参考资源文件列表
 */
export function getReferenceFilesForGap(gap: string): string[] {
  return REFERENCE_MAPPING[gap] || [];
}

/**
 * 解析参考资源内容，提取可选项
 * 假设参考资源文件采用列表格式，每行一个选项，以"- "开头
 */
export function parseReferenceOptions(content: string, maxOptions: number = 5): Array<{
  label: string;
  description: string;
  preview?: string;
}> {
  if (!content) return [];

  const lines = content.split('\n');
  const options: Array<{ label: string; description: string; preview?: string }> = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- ')) {
      const optionText = trimmedLine.substring(2).trim();

      // 尝试解析格式："标签 - 描述 [预览]"
      const parts = optionText.split(/[-：:]/, 2);
      if (parts.length === 2) {
        const label = parts[0].trim();
        const rest = parts[1].trim();

        // 尝试提取预览内容（在[]中）
        const previewMatch = rest.match(/\[(.*?)\]/);
        const description = previewMatch ? rest.replace(/\[(.*?)\]/, '').trim() : rest;
        const preview = previewMatch ? previewMatch[1].trim() : undefined;

        options.push({ label, description, preview });
      } else {
        // 简单格式，只有标签
        options.push({ label: optionText, description: '' });
      }

      if (options.length >= maxOptions) {
        break;
      }
    }
  }

  return options;
}

/**
 * 根据缺口类型加载参考资源并解析为选项
 */
export async function loadOptionsForGap(gap: string, maxOptions: number = 5): Promise<Array<{
  label: string;
  description: string;
  preview?: string;
}>> {
  const referenceFiles = getReferenceFilesForGap(gap);
  let allOptions: Array<{ label: string; description: string; preview?: string }> = [];

  for (const file of referenceFiles) {
    const content = await readReferenceFile(file);
    const options = parseReferenceOptions(content, maxOptions);
    allOptions = [...allOptions, ...options];
  }

  // 去重
  const uniqueOptions = Array.from(new Map(allOptions.map(opt => [opt.label, opt])).values());

  // 随机打乱并返回最多maxOptions个
  return uniqueOptions
    .sort(() => Math.random() - 0.5)
    .slice(0, maxOptions);
}

/**
 * 加载输出模板
 */
export async function loadOutputTemplates(): Promise<Record<string, string>> {
  const content = await readReferenceFile('output-templates.md');
  const templates: Record<string, string> = {};

  // 解析模板，假设模板以## 模板名称开头，然后是内容
  const sections = content.split(/^## /m);
  for (const section of sections.slice(1)) {
    const lines = section.split('\n');
    const name = lines[0].trim();
    const templateContent = lines.slice(1).join('\n').trim();
    templates[name] = templateContent;
  }

  return templates;
}

/**
 * 加载最佳实践
 */
export async function loadBestPractices(): Promise<{
  seedream: string[];
  seeddance: string[];
  qc: string[];
}> {
  const [seedreamContent, seeddanceContent, qcContent] = await Promise.all([
    readReferenceFile('seedream-best-practices.md'),
    readReferenceFile('seeddance-best-practices.md'),
    readReferenceFile('video-prompt-qc.md')
  ]);

  const parseList = (content: string): string[] => {
    return content.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.substring(2).trim());
  };

  return {
    seedream: parseList(seedreamContent),
    seeddance: parseList(seeddanceContent),
    qc: parseList(qcContent)
  };
}
