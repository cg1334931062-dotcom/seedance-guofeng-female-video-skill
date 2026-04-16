# Seedance 国风女性视频 Skill

一个视频优先的 Codex skill，用来一步一问地共创古风女性 `Seedance` 视频，而不是默认滑向角色立绘或静态海报。

它的核心能力是：在最终输出前，明确和用户共创 `角色`、`场景`、`视频风格`、`视频总时长`、`镜头设计`、`动作设计`，再产出可执行的视频提示词包和质检建议。

## 这是什么

这是一个单 skill 仓库，核心 skill 位于：

- [`./.codex/skills/seedance-guofeng-female-video-skill/SKILL.md`](./.codex/skills/seedance-guofeng-female-video-skill/SKILL.md)

这个 skill 主要面向：

- 古风女性 Seedance 视频创作
- 一步一问式的视频共创
- 需要明确讨论视频风格、总时长、镜头、动作的场景
- 希望支持“角色稿到视频”的整链路，但仍以视频为主的工作流

## 快速开始

1. 克隆这个仓库

```bash
git clone <your-repo-url>
cd prompt_gen
```

2. 把 skill 目录复制到你的 Codex skills 目录

```bash
cp -R ./.codex/skills/seedance-guofeng-female-video-skill "$CODEX_HOME/skills/"
```

如果没有设置 `CODEX_HOME`，通常可以复制到：

```bash
cp -R ./.codex/skills/seedance-guofeng-female-video-skill ~/.codex/skills/
```

3. 用下面的触发名开始使用

```text
$seedance国风女性视频skill
```

## 如何触发

推荐触发方式：

```text
$seedance国风女性视频skill 帮我做一个清冷女剑修视频
```

```text
$seedance国风女性视频skill 我想先做角色稿，再做 Seedance 视频
```

```text
$seedance国风女性视频skill 帮我做一个 8 秒的古风女性预告感视频
```

更多可复制示例见：

- [`./examples/usage-examples.md`](./examples/usage-examples.md)

## 为什么这个 skill 不同

很多模型在接到“古风女性角色”类需求时，会默认滑向：

- 立绘
- 海报
- 角色设定图

即使用户其实要的是视频，模型也常常会跳过：

- 视频风格
- 视频总时长
- 镜头设计
- 动作设计

这个 skill 的重点就是把这种偏移纠正回来，让整个流程回到“视频导演式共创”，而不是“静态角色问卷”。

## 核心特性

### 视频优先路由

- 默认进入 `仅视频`
- 只有用户明确要求 `先角色稿再视频` 才进入 `整链路`
- 只有用户明确要求 `立绘 / 海报 / SeedDream 静态图` 才进入 `仅角色稿`
- 对“帮我设计一个古风女角色”这类模糊请求，不默认当成立绘任务

### 六项显式共创

对视频任务，最终收敛前必须明确讨论并确认：

- 角色
- 场景
- 视频风格
- 视频总时长
- 镜头设计
- 动作设计

### 视频风格分层收敛

`视频风格` 不再只靠 `电影感 / 高级 / 氛围感 / 仙气` 这类大词收住。

skill 会把风格按下面的顺序继续收窄：

- `渲染基底`
- `虚实关系 / 空气感`
- `情绪主轴`
- `成片对象`
- `为什么适合当前角色与场景`

也就是说，像 `游戏CG风格`、`电影感`、`水墨感` 这样的回答，不会被直接视为已锁定风格，而是会继续细分到可执行层。

### 总时长进入镜头层

`视频总时长` 不再是补充字段，而是镜头设计阶段必须明确的变量。

默认推荐档位：

- `短促传播型：5-8 秒`
- `标准传播型：8-12 秒`
- `展开表达型：12-18 秒`

### 六项收敛回显

在最终输出前，skill 会做一次结构化回显，确认：

- 角色
- 场景
- 视频风格
- 视频总时长
- 镜头设计
- 动作设计

### 交互选项规则

- 如果宿主支持结构化交互输入，skill 应该把探索型选项渲染成可点击选择，而不是普通文本列表
- 如果宿主当前不支持这类交互输入，skill 应该退回成自由问答，不输出看起来像按钮的编号/项目符号选项
- 也就是说，纯文本里的 `1. 2. 3.` 或 `- 方向A` 这种伪选项，不是这个 skill 期望的交互形态

### 视频质检闭环

skill 会在输出前检查：

- 角色是否稳定
- 场景关系是否具体
- 风格是否独立清晰
- 镜头是否摆脱模板骨架
- 动作是否具备身体语言和力量表达
- 镜头密度 / 动作密度 / 特效密度是否和已确认时长匹配

## 示例

### 默认仅视频

```text
$seedance国风女性视频skill 帮我做一个清冷女剑修视频
```

### 明确整链路

```text
$seedance国风女性视频skill 先帮我做角色稿，再做视频
```

### 明确静态图

```text
$seedance国风女性视频skill 帮我做一张古风女角色立绘海报
```

### 明确时长

```text
$seedance国风女性视频skill 做一个 8 秒的女剑修 Seedance 视频
```

### 风格宽词细化

```text
$seedance国风女性视频skill 我想做一个游戏CG风格的古风女视频
```

## 仓库结构

```text
prompt_gen/
├── README.md
├── .gitignore
├── examples/
│   └── usage-examples.md
└── .codex/
    └── skills/
        └── seedance-guofeng-female-video-skill/
            ├── SKILL.md
            ├── agents/openai.yaml
            └── references/
```

## 安装方式

如果你只想安装这个 skill，本仓库里真正需要复制的目录是：

```text
.codex/skills/seedance-guofeng-female-video-skill
```

安装目标通常是：

- `$CODEX_HOME/skills/seedance-guofeng-female-video-skill`
- `~/.codex/skills/seedance-guofeng-female-video-skill`

## 适合谁

适合：

- 想做古风女性 Seedance 视频
- 想一步一问式和模型共创视频
- 想把视频风格、总时长、镜头、动作讨论清楚再出 prompt
- 想做“角色稿到视频”的整链路，但视频是主目标

不适合：

- 只想做静态立绘
- 只想做海报
- 想做泛化的通用角色系统
- 不需要共创流程，只想要一个一次性 prompt

## 关键文件

- [`./.codex/skills/seedance-guofeng-female-video-skill/SKILL.md`](./.codex/skills/seedance-guofeng-female-video-skill/SKILL.md)
  skill 主说明，定义定位、模式路由、收敛规则和输出规则。
- [`./.codex/skills/seedance-guofeng-female-video-skill/agents/openai.yaml`](./.codex/skills/seedance-guofeng-female-video-skill/agents/openai.yaml)
  UI 展示名、短描述和默认提示词。
- [`./.codex/skills/seedance-guofeng-female-video-skill/references/interaction-flow.md`](./.codex/skills/seedance-guofeng-female-video-skill/references/interaction-flow.md)
  交互状态机和停止条件。
- [`./.codex/skills/seedance-guofeng-female-video-skill/references/question-bank.md`](./.codex/skills/seedance-guofeng-female-video-skill/references/question-bank.md)
  提问约束和共创规则。
- [`./examples/usage-examples.md`](./examples/usage-examples.md)
  典型触发示例。
