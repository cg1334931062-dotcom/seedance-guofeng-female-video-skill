# Interaction Flow

## Overview

This file defines the guided interview state machine for `仅视频`, `整链路`, and `仅角色稿`.

Default assumption: this is a video-first skill.  
If the prompt is ambiguous, bias toward `仅视频`, not `仅角色稿`.

Use it to decide:

- what to ask next
- when to give a checkpoint summary
- when to give the final `六项收敛回显`
- when to stop asking and produce the result

## Task Routing And Anti-Misread

- Route to `仅视频` when the user mentions `视频`、`镜头`、`运镜`、`分镜`、`节奏`、`动态`、`预告`、`时长`、`Seedance`、`成片`.
- Route to `整链路` only when the user clearly asks for `先角色稿再视频`、`从静态图到视频`、`先参考图再视频`、`同时要 SeedDream 和 Seedance`.
- Route to `仅角色稿` only when the user clearly asks for `立绘`、`海报`、`角色设定图`、`SeedDream 静态图` or a static-only deliverable.
- If the user only says `帮我设计一个古风女角色`, do not silently route to `仅角色稿`. Ask a mode question and recommend `仅视频`.

## Zero-Idea Entry

If the user does not know what kind of character or video they want, do not force task mode first.  
Instead, first classify the user into one of:

- `完全没想法`
- `有模糊感觉`
- `已有明确方向`

### Entry Rule

- If the user says things like:
  - `我不知道要设计什么`
  - `帮我想一个角色`
  - `我没什么想法`
  - `想做一个有感觉的角色`
  then start with `灵感层`.
- If the user already names a role type, visual direction, or task mode, skip straight to the corresponding flow.

## Shared Rules

- Default to one high-value question per turn.
- Ask two tightly coupled questions only when that clearly reduces mechanical friction.
- Prefer dynamic, context-specific options first, freeform second.
- Recommend one direction when the user is vague or conflicted.
- Keep the user moving toward a producible design, not a vague moodboard.
- Do not ask questions whose answers are already stable enough.
- For role-led video tasks, actively lock enough role detail to make the subject visually memorable.
- Unless the user has already provided them clearly, proactively cover at least:
  - 角色身份
  - 容貌 / 脸感
  - 发型或头部轮廓
  - 服装 / 武器轮廓
  - 至少一个记忆点
  - 场景关系
- For zero-idea users, first help them discover what they want the audience to remember, then translate that into a角色脸谱.
- Treat the template library as hidden support. Only surface template-like options when the user is clearly stuck or explicitly wants option sets.
- Maintain these hidden states:
  - `当前创作缺口`
  - `当前角色独特性`
  - `当前方向冲突度`
  - `当前 Prompt QA 风险`
  - `角色已讨论`
  - `角色已确认`
  - `场景已讨论`
  - `场景已确认`
  - `视频风格已讨论`
  - `视频风格已确认`
  - `总时长已讨论`
  - `总时长已确认`
  - `镜头已讨论`
  - `镜头已确认`
  - `动作已讨论`
  - `动作已确认`
  - `六项收敛回显已完成`
- Choose the next question by creative gap, not by checklist order.
- Do not ask the next question by following the order of a reference file.
- Prefer generating the next question from current context and current gap, then use references only to validate that the question is not weak or templated.
- For video and整链路 tasks, do not stop until `角色`、`场景`、`视频风格`、`总时长`、`镜头设计`、`动作设计` 都已经明确 enough to support one stable Seedance prompt.
- For video and整链路 tasks, do not treat `视频风格`、`总时长`, or `镜头设计` as solved just because they can be inferred from角色、场景, or broad pace words. They must be explicitly discussed or explicitly provided by the user.
- For video and整链路 tasks, do not treat the角色层 as solved until `容貌/脸感`、`发型/头部轮廓`、`服装轮廓` are explicit enough to be confirmed.
- If the user gives a detailed brief in the first turn, still produce one structured `六项收敛回显` before output.
- If the user replies with `差不多`、`都行`、`你定`, do not mark the six core items as confirmed yet.
- If the role still lacks `容貌/脸感`、`发型`、`服装轮廓`, the next question must stay in角色层 rather than jump to场景层或视频风格层.
- If角色层和场景层 are stable but style is still implicit, the next question should target `视频风格层`.
- If `视频风格层` is stable but `总时长` or `镜头层` is still generic or unconfirmed, the next question should target `镜头层`.
- If `镜头层` is stable but `动作层` is still generic or unconfirmed, the next question should target `动作层`.
- If the user asks to finalize early, use one compact bridging question when needed, but do not skip the six core items or the final `六项收敛回显`.

## Mode Selection

If the user has not made the task mode clear, ask a mode question first and recommend `仅视频`.

Classify into one of:

- `仅视频`
- `整链路`
- `仅角色稿`

Use `整链路` only when the user clearly wants both the image prompt stage and the video prompt stage.

## Model-Led Question Selection

Before every question, decide:

1. What is the current creative gap?
2. Is the role still generic?
3. Is the scene still decorative?
4. Is the total duration still unconfirmed?
5. Is the特效层 inactive, candidate, or already activated?
6. Is the user stuck, vague, conflicted, or ready to converge?
7. Would a dynamic question be better than a template example here?

Preferred creative gaps:

- 角色气场不清
- 脸谱不清
- 容貌 / 发型 / 服装不清
- 场景与角色关系不清
- 视频风格不清
- 总时长与传播节奏不清
- 镜头进入方式不清
- 动作逻辑不清
- 特效是否需要不清

Question rule:

- If a role is generic, ask the question that most increases distinctiveness.
- If `容貌/脸感`、`发型`、`服装轮廓` are still unconfirmed, ask that before场景、视频风格、镜头、或动作.
- If the scene is generic, ask the question that most clarifies角色与空间关系.
- If the task is video or整链路 and `视频风格` is not explicit yet, ask that before总时长、动作、或特效.
- If the task is video or整链路 and `视频风格` is explicit but `总时长` or `镜头设计` is not, ask that before动作或 final packaging.
- If the task is video or整链路 and `总时长` is only described vaguely, narrow it before completing镜头层.
- If the特效层 is only a candidate, do not ask about it until视频风格、总时长、镜头、动作已经基本稳定.
- If the user is vague, ask a discovery question.
- If the user is conflicted, ask a contrast question.
- If the user is clear, ask a convergence question.
- For古风女角色, if the role still sounds like a generic archetype, read `guofeng-female-inspiration.md` and expand the next question around finer气质微差异 before continuing.
- For video or整链路 tasks, if the scene still sounds replaceable or decorative, read `scene-design-inspiration.md` before asking the next场景层问题.
- Do not lift the next question from any reference section verbatim.
- For古风女角色视频, if the shot design still sounds like a reusable skeleton, read `guofeng-female-shot-inspiration.md` before asking the next镜头层问题.
- For古风女角色视频, if the motion design still sounds like action labels only, read `guofeng-female-motion-inspiration.md` before asking the next动作层问题.
- If the特效层 is activated or strongly justified, read `effects-design-inspiration.md` before asking the next特效层问题.

Repetition rule:

- Avoid repeating the same semantic bucket across consecutive rounds.
- Unless you are intentionally confirming a tension, do not ask near-duplicate option sets.
- If the user keeps saying broad words like `仙气`、`高级`、`清冷`、`好看`, switch to finer-grained aesthetic differentiation using `guofeng-female-inspiration.md`.

## Layered Design Model

For all role-involved tasks, use this layered order:

1. `灵感层`
2. `脸谱层`
3. `场景层`
4. `视频风格层`
5. `镜头层`
6. `动作层`
7. `特效层（可选）`
8. `六项收敛回显`

### 灵感层

Lock what should be remembered first:

- 气质
- 危险感
- 贵气
- 仙气
- 动作爆点
- 服装印象
- 脸部印象

Use this layer to help the user discover a direction, not to force a label too early.

### 脸谱层

Lock the role into a recognizable visual identity:

- 角色身份
- 年龄脸感
- 发型
- 妆容
- 服装轮廓
- 武器
- 记忆点

Do not leave this layer until the role can be imagined as a distinct person.
For video and整链路 tasks, do not leave this layer until `角色身份`、`容貌/脸感`、`发型/头部轮廓`、`服装轮廓`、`记忆点` have all been discussed, and can be confirmed through one `角色定型回显`.

### 场景层

Lock:

- 场景空间
- 角色与场景关系
- 环境压迫 / 释放方式
- 光线 / 天气质感
- 构图锚点

Do not leave this layer until the scene feels like it belongs to this role and this video, not like a replaceable backdrop.
If this layer still sounds generic, use `scene-design-inspiration.md` before asking again.

### 视频风格层

Lock:

- 画面质感
- 情绪主轴
- 成片感觉
- 与角色脸谱和场景设计的匹配关系

Do not skip this layer in video tasks. The video should not move into镜头层 before the style of the finished piece is explicit enough to guide how it should look.
Do not leave this layer until the conversation has explicitly co-created or explicitly confirmed the style direction. A silent internal inference is not enough.

### 镜头层

Lock:

- 视频总时长
- 传播节奏
- 视频类型
- 入口镜头
- 情绪推进
- 视线设计
- 空间关系
- 收尾方式

Use总时长 to control传播节奏 and shot density instead of treating it as a late refinement.
Prefer recommending one of these duration bands first:

- `短促传播型：5-8 秒`
- `标准传播型：8-12 秒`
- `展开表达型：12-18 秒`

If the user gives an exact second count, accept it directly.
Do not enter this layer by asking for a fixed skeleton too early. First decide how long the piece is, then how the audience should enter the character and the space.
Do not leave this layer until the conversation has explicitly co-created or explicitly confirmed both总时长 and shot logic. A generic default like `近景抓脸 -> 中景动作 -> 定格` does not count as locked.
If this layer still sounds generic, use `guofeng-female-shot-inspiration.md` to widen the directorial possibilities before asking again.

### 动作层

Lock:

- 动作母题
- 身体语言
- 力量表达
- 动作与气质关系
- 参考图策略

Only enter the动作层 after the镜头层 is stable enough that movement can serve the role rather than replace it.
Make sure action density still fits the confirmed total duration.
If this layer still collapses into stock action labels, use `guofeng-female-motion-inspiration.md` to reopen body language and force expression.

### 特效层（可选）

Only activate this layer when at least one of these is true:

- the user explicitly asks for effects
- the video style naturally needs effects, such as暗黑东方奇幻, 强预告感, 术法感
- the action design involves力量释放, 武器轨迹, 术法, 元素, or a clear payoff beat
- the scene contains dynamic media worth amplifying, such as风、雨、雾、雪、水、火、碎光

Do not proactively activate this layer for:

- 仅角色稿
- 极简留白
- 写意水墨
- 诗意空镜
- 强克制展示片

Lock:

- 特效来源
- 特效主轴
- 特效强度
- 特效出现时机
- 特效占画面比例
- 特效与角色关系
- 特效与镜头关系
- 不抢戏约束

Only enter the特效层 after视频风格、总时长、镜头、动作已经稳定 enough that effects can serve them rather than replace them.

### 六项收敛回显

Use this step after the six core items are stable enough to support one prompt:

- 角色
- 场景
- 视频风格
- 总时长
- 镜头
- 动作

The recap should be short, structured, and confirmable in one turn.
Do not stop until the user explicitly confirms or adjusts this recap.

## Mode: 仅角色稿

### State Order

1. `灵感层`
2. `脸谱层`
3. `场景层`
4. `停止并输出`

### Required Information

- 角色身份
- 核心气质
- 年龄 / 脸感
- 发型或头部轮廓
- 服装 / 武器轮廓
- 至少一个记忆点
- 核心风格
- 场景或背景方向

### Optional Refinement

- 妆容
- 色彩倾向
- 构图重点
- 用途偏向: 角色设定图 / 角色立绘 / 海报
- 角色与场景关系
- 光线 / 天气质感
- 用户明确要求时的轻量特效描述

### Checkpoints

- After `角色身份 + 年龄脸感 + 核心气质 + 外观轮廓` are stable: `角色定型回显`
- In video tasks, `角色定型回显` should explicitly cover `身份 + 容貌/脸感 + 发型 + 服装/武器轮廓 + 记忆点`
- After `风格方向 + 场景方向` are stable: `风格定型回显`

### Stop Condition

Stop once the role can be rendered as a stable SeedDream prompt and the角色脸谱 is formed:

- 角色身份
- 核心气质
- 年龄脸感
- 发型或头部轮廓
- 服装 / 武器轮廓
- 至少一个记忆点
- 风格方向
- 场景方向
- and the role feels distinguishable from a generic archetype

## Mode: 仅视频

### State Order

1. `灵感层`
2. `脸谱层`
3. `场景层`
4. `视频风格层`
5. `镜头层`
6. `动作层`
7. `特效层（可选）`
8. `六项收敛回显`
9. `停止并输出`

### Required Information

- 视频目标
- 角色身份
- 角色气质
- 年龄脸感
- 发型或头部轮廓
- 服装 / 武器轮廓
- 至少一个记忆点
- 场景
- 角色与场景关系
- 环境压迫 / 释放方式
- 光线 / 天气质感
- 构图锚点
- 画面质感
- 情绪主轴
- 成片感觉
- 视频总时长
- 视频类型
- 传播节奏
- 入口镜头
- 情绪推进
- 空间关系
- 收尾方式
- 动作母题
- 身体语言
- 力量表达
- 参考图策略
- 六项收敛回显已确认
- if特效层 activated:
  - 特效来源
  - 特效主轴
  - 特效强度
  - 特效出现时机
  - 特效占画面比例
  - 特效与角色和镜头关系

### Optional Refinement

- 画幅
- 运镜偏好
- 妆容
- 角色细节强化
- 视觉记忆点
- 视线设计
- 一致性限制条件

### Checkpoints

- After角色身份 + 年龄脸感 + 气质 + 外观轮廓 + 记忆点 are stable: `角色定型回显`
- After场景关系 + 光线天气 + 画面质感 + 情绪主轴 + 成片感觉 are stable: `风格定型回显`
- After视频总时长 + 入口镜头 + 情绪推进 + 收尾方式 are stable: `分镜定型回显`

### Stop Condition

Stop once a strong Seedance video prompt can be written with:

- clear role identity
- a formed角色脸谱
- with `容貌/脸感`、`发型/头部轮廓`、`服装轮廓` explicit enough that the role can be recognized before scene and motion layers add pressure
- a clear scene design, not just a location label
- a defined video style that was explicitly discussed or explicitly provided
- a confirmed total duration that was explicitly discussed or explicitly provided
- a clear entrance shot
- a clear emotional progression or visual escalation
- a clear ending payoff
- a clear action motif, body language, and force expression
- a clear reference-image strategy
- a role distinctive enough to remain recognizable inside moving shots
- and at least one distinctive场景设计, 镜头设计, or动作设计 choice beyond a generic template
- and explicit confirmation of角色、场景、视频风格、总时长、镜头、动作 in one `六项收敛回显`
- and, when the特效层 is activated, a clear source, strength, timing, and anti-overpowering rule

## Mode: 整链路

### State Order

1. `灵感层`
2. `脸谱层`
3. `场景层`
4. `视频风格层`
5. `镜头层`
6. `动作层`
7. `特效层（可选）`
8. `六项收敛回显`
9. `停止并输出`

### Required Information

- enough to produce a role-sheet prompt
- enough to produce a video prompt
- 角色脸谱已定型
- 场景设计已定型
- 视频风格已定型
- 视频总时长已定型
- 镜头进入方式已明确
- 动作表达逻辑已明确
- 六项收敛回显已确认
- whether video should assume no reference image or also include a reference-enhanced version
- if特效层 activated: 特效规则已定型

### Checkpoints

- After角色身份、年龄脸感、气质、外观轮廓 and记忆点 stabilize: `角色定型回显`
- After场景关系、光线天气、画面质感、情绪主轴 and成片感觉 stabilize: `风格定型回显`
- After视频总时长、视频入口、推进 and收尾 stabilize: `分镜定型回显`

### Stop Condition

Stop once you can produce:

- one SeedDream role-sheet prompt
- reference image selection notes
- one Seedance no-reference version
- one Seedance reference-enhanced version
- with role identity and完整角色脸谱 stable enough to survive cross-stage reuse
- with `容貌/脸感`、`发型`、`服装轮廓` explicit enough to survive cross-stage reuse
- with scene design explicit enough to survive cross-stage reuse
- with a video style that is explicit rather than implied and was explicitly discussed or explicitly provided
- with a total duration that was explicitly discussed or explicitly provided and can govern shot density
- with shot logic that was explicitly discussed or explicitly provided, not silently inferred from vibe words
- with enough distinctiveness that the role can be named in one line
- with video logic that is more than a borrowed skeleton
- with action design that still feels like this person, not any person
- with one explicit `六项收敛回显` confirming角色、场景、视频风格、总时长、镜头、动作
- and, when the特效层 is activated, with effect logic that still serves this person and this shot logic

## Conflict Handling

If the user gives conflicting directions:

- name the conflict plainly
- recommend one dominant direction
- ask the user to confirm or adjust

Common examples:

- `清冷仙气` + `高燃混剪打斗`
- `极简水墨` + `强特效游戏 CG`
- `稳定角色稿` + `超复杂大动作海报`
- `5-8 秒短视频` + `想讲很完整的剧情起承转合`

## Shot, Duration, and Motion Tension

When总时长、镜头 and动作 compete, prefer the role first and keep the density executable.

- If the confirmed duration is `5-8 秒`, avoid trying to fit multiple shot reversals plus multiple major actions.
- If the confirmed duration is `8-12 秒`, one clear entrance, one build beat, and one payoff beat is usually enough.
- If the confirmed duration is `12-18 秒`, expand rhythm carefully instead of adding noise.
- If the role is `清冷 / 空灵 / 悲悯`, do not default to dense aggressive motion.
- If the role is `危险 / 明媚英气 / 孤绝天才`, stronger motion escalation is more natural.
- If the user wants `既高级又猛`, resolve whether the dominant axis is:
  - `电影感主导`
  - `动作爆点主导`

If the shot logic and motion logic cannot both intensify at once, preserve角色脸谱、总时长可执行性 and镜头气质 before adding more动作爆点.
When镜头主导:

- lower motion density
- keep the role readable
- let the environment and gaze do more work

When动作主导:

- do not let motion erase the faceprint
- keep one stable visual anchor on the role
- make the action feel like this person, not any person

## Effect Tension

When特效 and角色 / 镜头 compete, prefer角色 and镜头 first.

- If the effect has no clear source, do not keep it.
- If the effect covers the face, weapon silhouette, or body line, reduce it or remove it.
- If the effect starts to define the video more than the role does, treat that as a drift signal.
- If the user asks for very strong effects inside a restrained style, name the conflict plainly before proceeding.

## Vague Answer Handling

If the user uses vague words like:

- `高级`
- `好看`
- `有感觉`
- `仙一点`
- `短一点`

then:

1. interpret the likely design tension
2. present 3 to 6 concrete directions or duration bands
3. recommend one
4. ask the next narrow question

## Uniqueness Check

Before stopping, silently test:

- Can this role be named in one sentence?
- Before leaving角色层, are `容貌/脸感`、`发型`、`服装轮廓` actually explicit, or only implied by archetype words?
- Would two different users with similar high-level taste still end up with different roles?
- Is the role more than a pile of labels?
- If the scene were swapped out, would the design lose force?
- In a video task, have `角色`、`场景`、`视频风格`、`总时长`、`镜头设计`、`动作设计` all been explicitly covered with the user?
- Has one `六项收敛回显` been shown and explicitly confirmed?
- If the motion were removed, would the role still be recognizable?
- If activated, could the effect be removed without destroying the whole design?

If the answer is no, ask one more question aimed at uniqueness or executability rather than completeness.
