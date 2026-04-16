# Seedance 国风女性视频共创

一个面向 Codex 类智能体的 `Seedance` 古风女性视频共创 skill 项目。

这个仓库的核心不是“做古风女性立绘”，而是把一个容易被模型误解成静态角色设计的问题，重写成一个真正的视频优先工作流：让模型在收敛前明确和用户共创 `角色`、`场景`、`视频风格`、`视频总时长`、`镜头设计`、`动作设计`，再输出可执行的 Seedance 视频提示词包。

## 项目目标

这个项目解决两个常见问题：

1. 模型会把“古风女性角色”类需求误判成 `立绘 / 海报 / 角色设定图`
2. 即使用户明确要视频，模型也常常跳过 `总时长`、`镜头设计`、`动作设计`，过早收敛

为了解决这两个问题，这个 skill 做了三件事：

- 把整个 skill 改造成 `视频优先`
- 把 `视频总时长` 升级为镜头层必谈变量
- 把视频任务的收敛门槛固定为六项显式共创

## Skill 定位

这个 skill 适用于：

- 古风女性 Seedance 视频创作
- 一步一问式的视频共创
- 需要和用户明确讨论视频风格、总时长、镜头、动作
- 想做“角色稿到视频”的整链路，但仍以视频为主

这个 skill 不以以下任务为主：

- 纯角色立绘
- 海报
- 角色卡
- 三视图
- 只做 SeedDream 静态图

## 核心特性

### 1. 视频优先路由

- 默认进入 `仅视频`
- 只有用户明确要求 `先角色稿再视频` 才进入 `整链路`
- 只有用户明确要求 `立绘 / 海报 / SeedDream 静态图` 才进入 `仅角色稿`
- 对“帮我设计一个古风女角色”这类模糊请求，不默认当成立绘任务

### 2. 六项显式共创

对视频任务，最终收敛前必须明确讨论并确认：

- 角色
- 场景
- 视频风格
- 视频总时长
- 镜头设计
- 动作设计

skill 不允许只靠模型自己脑补这些信息后直接给最终 prompt。

### 3. 总时长并入镜头层

这个 skill 把 `视频总时长` 从“可选补充项”提升成镜头设计阶段的核心变量。

默认推荐档位：

- `短促传播型：5-8 秒`
- `标准传播型：8-12 秒`
- `展开表达型：12-18 秒`

如果用户直接给具体秒数，会直接接受为确认时长。

### 4. 六项收敛回显

在最终输出前，skill 会做一次结构化回显：

- 角色
- 场景
- 视频风格
- 视频总时长
- 镜头设计
- 动作设计

只有用户明确确认后，才会进入最终提示词包输出。

### 5. 视频质检闭环

skill 内置视频 prompt 质检逻辑，会检查：

- 角色是否稳定
- 场景关系是否具体
- 风格是否独立清晰
- 镜头是否摆脱模板骨架
- 动作是否有身体语言和力量表达
- 镜头密度 / 动作密度 / 特效密度是否和已确认时长匹配

## 仓库内容

这个仓库发布的是 skill 本体，而不是一个独立 Web 应用。

主 skill 位于：

- [SKILL.md](/Users/elewave/Desktop/CLI_Folder/prompt_gen/.codex/skills/seedance-guofeng-female-video-co-creation/SKILL.md)

仓库结构：

```text
prompt_gen/
├── README.md
├── .gitignore
├── docs/
│   └── github-publish-checklist.md
├── examples/
│   └── usage-examples.md
└── .codex/
    └── skills/
        └── seedance-guofeng-female-video-co-creation/
            ├── SKILL.md
            ├── agents/openai.yaml
            └── references/
```

## 安装方式

如果你要在本地使用这个 skill，可以把目录：

```text
.codex/skills/seedance-guofeng-female-video-co-creation
```

复制到你的 Codex skills 目录：

- `$CODEX_HOME/skills/seedance-guofeng-female-video-co-creation`
- 或 `~/.codex/skills/seedance-guofeng-female-video-co-creation`

如果你直接在这个仓库里开发，通常不需要额外安装步骤。

## 触发方式

推荐触发名：

```text
$seedance国风女性视频共创
```

示例：

```text
$seedance国风女性视频共创 帮我做一个清冷女剑修视频
```

```text
$seedance国风女性视频共创 我想先做角色稿，再做 Seedance 视频
```

```text
$seedance国风女性视频共创 帮我做一个 8 秒的古风女性预告感视频
```

更多示例见：

- [examples/usage-examples.md](/Users/elewave/Desktop/CLI_Folder/prompt_gen/examples/usage-examples.md)

## 工作流概览

对视频任务，skill 的工作顺序大致是：

1. 锁角色
2. 锁场景
3. 锁视频风格
4. 在镜头层锁总时长和传播节奏
5. 锁镜头进入、推进和收尾
6. 锁动作母题、身体语言和力量表达
7. 如有需要，讨论特效
8. 做一次 `六项收敛回显`
9. 输出最终提示词包和质检建议

## 输出内容

`仅视频` 模式下，典型输出包括：

- 角色脸谱摘要
- 一句话角色定义
- 角色设计摘要
- 场景设计摘要
- 视频风格摘要
- 镜头设计摘要
- 动作设计摘要
- 特效设计摘要（如激活）
- Seedance 视频提示词包
- 质检与修正建议

其中 `镜头设计摘要` 会明确包含：

- 视频总时长
- 传播节奏
- 入口镜头
- 情绪推进
- 空间关系
- 收尾方式

## 发布到 GitHub

当前仓库已经整理成一个可独立发布的本地 git 仓库结构。

推荐仓库名：

```text
seedance-guofeng-female-video-co-creation
```

推荐仓库描述：

```text
A video-first Codex skill for co-creating ancient Chinese female Seedance videos with explicit duration, style, shot, and motion design.
```

发布前建议检查：

- README 是否足够让外部读者快速理解
- 触发名是否与 skill 元数据一致
- 仓库中是否还残留不想公开的本地文件
- 是否要补充许可证

详细清单见：

- [docs/github-publish-checklist.md](/Users/elewave/Desktop/CLI_Folder/prompt_gen/docs/github-publish-checklist.md)

## 注意事项

- 本仓库目前未附带 `LICENSE`，如果你要公开传播，建议在正式发布前补一个明确许可证。
- 这是一个 skill 仓库，不是独立应用。
- 仓库根目录通过 `.gitignore` 只暴露这个 skill 的必要内容，不会把本地 `.claude` 配置一起带出去。

