/**
 * 问题生成模块
 * 所有交互严格使用AskUserQuestion工具，生成2-5个美学差异明显的选项
 */

import { SkillState, WorkMode } from './state-manager';
import { loadOptionsForGap } from './reference-loader';

/**
 * AskUserQuestion选项接口
 */
export interface QuestionOption {
  label: string;
  description: string;
  preview?: string;
}

/**
 * AskUserQuestion参数接口
 */
export interface QuestionParams {
  question: string;
  header: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

/**
 * 缺口类型对应的问题模板
 */
const QUESTION_TEMPLATES: Record<string, {
  question: string;
  header: string;
  multiSelect?: boolean;
}> = {
  // 初始创意状态选择
  'initial_status': {
    question: '请问您当前的创意状态是？',
    header: '创意状态'
  },

  // 工作模式选择
  'work_mode': {
    question: '请问您需要哪种工作模式？',
    header: '工作模式'
  },

  // 角色相关问题
  'character:identity': {
    question: '请问这个角色的身份是？',
    header: '角色身份'
  },
  'character:temperament': {
    question: '请问这个角色的核心气质是？',
    header: '角色气质'
  },
  'character:memoryPoint': {
    question: '请问这个角色最让人印象深刻的记忆点是？',
    header: '记忆点'
  },
  'character:missing_fields': {
    question: '请问您想先补充角色的哪个方面？',
    header: '角色完善'
  },

  // 场景相关问题
  'scene:space': {
    question: '请问这个角色处于什么场景中？',
    header: '场景空间'
  },
  'scene:relationship': {
    question: '请问场景与角色的关系是？',
    header: '场景关系'
  },
  'scene:missing_fields': {
    question: '请问您想先补充场景的哪个方面？',
    header: '场景完善'
  },

  // 风格相关问题
  'style:aesthetic': {
    question: '请问视频的美学方向是？',
    header: '美学风格'
  },
  'style:color': {
    question: '请问视频的主色调是？',
    header: '色彩风格'
  },
  'style:missing_fields': {
    question: '请问您想先补充风格的哪个方面？',
    header: '风格完善'
  },

  // 时长相关问题
  'duration': {
    question: '请问视频的总时长是多少秒？',
    header: '视频时长'
  },

  // 镜头相关问题
  'shot:entrance': {
    question: '请问视频的入口镜头是？',
    header: '入口镜头'
  },
  'shot:ending': {
    question: '请问视频的收尾镜头是？',
    header: '收尾镜头'
  },
  'shot:missing_fields': {
    question: '请问您想先补充镜头的哪个方面？',
    header: '镜头完善'
  },

  // 动作相关问题
  'motion:motif': {
    question: '请问视频的核心动作母题是？',
    header: '动作母题'
  },
  'motion:bodyLanguage': {
    question: '请问角色的身体语言特点是？',
    header: '身体语言'
  },
  'motion:missing_fields': {
    question: '请问您想先补动作的哪个方面？',
    header: '动作完善'
  },

  // 特效相关问题
  'effects': {
    question: '请问是否需要添加特效？如果需要，特效类型是？',
    header: '特效选择'
  },

  // 收敛确认
  'convergence_confirm': {
    question: '请问以上核心要素是否确认？如果需要修改，请选择要调整的部分。',
    header: '确认核心要素',
    multiSelect: false
  }
};

/**
 * 生成初始创意状态选择问题
 */
export function generateInitialStatusQuestion(): QuestionParams {
  return {
    question: QUESTION_TEMPLATES['initial_status'].question,
    header: QUESTION_TEMPLATES['initial_status'].header,
    options: [
      {
        label: '已有明确方向',
        description: '已有具体的角色、风格或场景想法',
        preview: '我已经知道想要什么样的内容'
      },
      {
        label: '有模糊感觉',
        description: '有大致方向但细节模糊',
        preview: '有大概的想法，但需要帮忙细化'
      },
      {
        label: '完全没想法',
        description: '无明确角色、场景或风格方向',
        preview: '不知道要做什么，给我一些灵感'
      },
      {
        label: '都不满意',
        description: '这些选项都不符合我的想法，换一批试试',
        preview: '重新生成新的选项'
      }
    ]
  };
}

/**
 * 生成工作模式选择问题
 */
export function generateWorkModeQuestion(): QuestionParams {
  return {
    question: QUESTION_TEMPLATES['work_mode'].question,
    header: QUESTION_TEMPLATES['work_mode'].header,
    options: [
      {
        label: '仅视频',
        description: '视频优先，直接生成Seedance视频提示词',
        preview: '只需要动态视频提示词'
      },
      {
        label: '整链路',
        description: '先出SeedDream角色稿，再出视频提示词',
        preview: '需要静态角色图+动态视频两套提示词'
      },
      {
        label: '仅角色稿',
        description: '仅输出静态角色设定SeedDream提示词',
        preview: '只需要静态角色图片提示词'
      },
      {
        label: '都不满意',
        description: '这些选项都不符合我的想法，换一批试试',
        preview: '重新生成新的选项'
      }
    ]
  };
}

/**
 * 生成模糊回答的细化问题
 */
export function generateVagueAnswerQuestion(gap: string): QuestionParams {
  const template = QUESTION_TEMPLATES[gap] || QUESTION_TEMPLATES['character:temperament'];

  return {
    question: `为了给您提供更精准的选项，请问您更倾向于哪种方向？`,
    header: template.header,
    options: [
      {
        label: '仙气清冷',
        description: '不食人间烟火，疏离感强',
        preview: '白衣胜雪，气质出尘，眼神淡漠'
      },
      {
        label: '英气飒爽',
        description: '干练果决，充满力量感',
        preview: '劲装束发，眼神锐利，动作干脆'
      },
      {
        label: '妩媚妖娆',
        description: '风情万种，充满诱惑力',
        preview: '华服美艳，眼波流转，姿态撩人'
      },
      {
        label: '温婉柔美',
        description: '温柔贤淑，气质典雅',
        preview: '长裙曳地，眉眼温柔，举止优雅'
      },
      {
        label: '都不满意',
        description: '这些选项都不符合我的想法，换一批试试',
        preview: '重新生成新的选项'
      }
    ]
  };
}

/**
 * 根据缺口类型生成问题
 */
export async function generateQuestionForGap(gap: string, state: SkillState): Promise<QuestionParams> {
  const template = QUESTION_TEMPLATES[gap];
  if (!template) {
    // 默认返回角色气质问题
    return generateVagueAnswerQuestion('character:temperament');
  }

  // 加载参考选项
  const referenceOptions = await loadOptionsForGap(gap, 3);

  // 如果参考选项不足，使用默认选项
  let options = referenceOptions;
  if (options.length < 2) {
    options = generateDefaultOptionsForGap(gap);
  }

  // 最多3个业务选项，留1个位置给"都不满意"
  options = options.slice(0, 3);

  // 添加"都不满意"选项
  options.push({
    label: '都不满意',
    description: '这些选项都不符合我的想法，换一批试试',
    preview: '重新生成新的选项'
  });

  return {
    question: template.question,
    header: template.header,
    options: options,
    multiSelect: template.multiSelect || false
  };
}

/**
 * 生成默认选项（当参考资源不足时）
 */
function generateDefaultOptionsForGap(gap: string): QuestionOption[] {
  const defaultOptions: Record<string, QuestionOption[]> = {
    'duration': [
      { label: '6秒', description: '短视频，适合快节奏内容', preview: '快速展示核心亮点' },
      { label: '10秒', description: '中等长度，适合讲故事', preview: '有足够时间展示起承转合' },
      { label: '15秒', description: '较长视频，适合复杂内容', preview: '充分展示细节和氛围' }
    ],
    'effects': [
      { label: '不需要特效', description: '纯实拍风格，无后期特效', preview: '写实风格，更真实自然' },
      { label: '仙气特效', description: '光影、粒子、烟雾等仙气效果', preview: '增加飘渺出尘的氛围感' },
      { label: '武侠特效', description: '剑气、刀光、能量波等武打效果', preview: '增强动作的冲击力和力量感' }
    ]
  };

  return defaultOptions[gap] || [
    { label: '选项1', description: '风格1', preview: '预览1' },
    { label: '选项2', description: '风格2', preview: '预览2' },
    { label: '选项3', description: '风格3', preview: '预览3' }
  ];
}

/**
 * 生成收敛确认问题
 */
export function generateConvergenceConfirmQuestion(state: SkillState): QuestionParams {
  const options = [
    {
      label: '确认无误',
      description: '所有核心要素都已确认，可以生成最终提示词',
      preview: '直接生成最终结果'
    },
    {
      label: '修改角色/场景',
      description: '调整角色身份、气质、服装、场景等设定',
      preview: '返回角色或场景设定阶段修改'
    },
    {
      label: '修改风格/时长',
      description: '调整美学方向、色彩、时长、节奏等设定',
      preview: '返回风格和时长设定阶段修改'
    },
    {
      label: '修改镜头/动作',
      description: '调整镜头运动、动作设计、特效等设定',
      preview: '返回镜头和动作设定阶段修改'
    }
  ];

  return {
    question: QUESTION_TEMPLATES['convergence_confirm'].question,
    header: QUESTION_TEMPLATES['convergence_confirm'].header,
    options: options,
    multiSelect: false
  };
}

/**
 * 生成AskUserQuestion工具调用
 */
export function generateAskUserQuestionCall(params: QuestionParams): any {
  return {
    name: 'AskUserQuestion',
    parameters: {
      question: params.question,
      header: params.header,
      options: params.options.map(opt => ({
        label: opt.label,
        description: opt.description,
        ...(opt.preview && { preview: opt.preview })
      })),
      multiSelect: params.multiSelect || false
    }
  };
}
