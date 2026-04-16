# Seedance Best Practices

## Scope

This file summarizes high-level Seedance prompting principles based on publicly available Volcengine documentation and practical prompt-design constraints as of `2026-04-12`.

Public references:

- `https://www.volcengine.com/docs/82379/1587797?lang=zh`
- `https://www.volcengine.com/docs/82379/1631633?lang=zh`
- `https://www.volcengine.com/docs/82379/2222480`

Do not invent hidden engine rules. Use this file to organize prompts around stable, public-facing principles:

- natural-language shot design, not keyword piles
- lock主体 / 风格 / 场景 first
- keep reference-image consistency explicit when used
- do not average `展示片` and `动作片` into one blurry axis

## Core Principle

Write prompts as natural-language shot design, not keyword stacks.

Prefer:

- one clear main subject
- one clear scene relationship
- one clear style axis
- one clear total duration
- one clear shot arc
- one clear consistency strategy

## Prompt Assembly Order

Always assemble in this order:

1. 主体锁定
2. 场景锁定
3. 视频风格
4. 总时长 / 传播节奏
5. 开场镜头
6. 中段推进
7. 高光动作
8. 特效句（如需要）
9. 收尾记忆点
10. 一致性约束

If a later sentence is getting vague, go back and strengthen an earlier one instead of piling on more adjectives.

## Recommended Prompt Shape

```text
[视频类型 / 风格 / 画幅]。[主体是谁，穿什么，气质如何，最重要的脸谱记忆点是什么]。[她和场景是什么关系，环境如何压她、托她、藏她，或被她夺回]。

总时长控制在[5-8 秒 / 8-12 秒 / 12-18 秒 / 具体秒数]，传播节奏是[短促传播 / 标准推进 / 展开表达]。

开场先用[入口镜头]呈现[第一眼必须注意到的东西]，[补充光线、天气、材质、环境动势]。

镜头随后[推进 / 后撤 / 跟拍 / 平移]到[中段推进]，[主体动作母题]，[补充空间关系和最重要的服装、道具、环境变化]。

如需要特效，在动作句或空间句之后补一小句，说明特效来源、轨迹 / 材质、强度和与镜头的关系。

最后镜头停在[收尾记忆点]。整体节奏[电影感舒缓 / 展示片克制推进 / 动作片爆点推进]，主体稳定，[补充一致性限制条件]。
```

## If No Reference Image

Use textual consistency, not wishful consistency.

- repeat the role identity clearly
- repeat costume palette and costume structure
- repeat weapon shape
- repeat the most important faceprint anchor
- keep `only this one character` explicit in natural language when needed

When the role drifts, strengthen the主体锁定句 and一致性约束句 before rewriting the whole prompt.

## If There Is a Reference Image

Add an explicit consistency line that locks:

- 脸
- 发型
- 服装配色
- 服装轮廓
- 配饰
- 武器形制

Use the reference image to preserve identity, not to replace scene logic, shot logic, motion logic, or effect logic.

## Showpiece vs Action

Choose one dominant axis.

- 展示片主导: prioritize face, costume, atmosphere, stillness, and elegant motion
- 动作片主导: prioritize rhythm, action readability, weapon logic, and one strong payoff

If the user wants both:

- choose one dominant axis
- keep the other as support
- do not write both at equal weight

## Shot Density and Motion Density

Keep the prompt filmable.

- Usually keep one entrance beat, one build beat, and one payoff beat
- Confirm total duration before increasing shot density
- Avoid listing too many cuts, transitions, or angle names
- Avoid stacking multiple major actions into the same prompt
- If camera language is strong, reduce motion density
- If motion is strong, keep one stable visual anchor on the role

If a prompt feels crowded, delete the second-best shot or action, not the best one.

## Action Wording Rule

Describe how this person moves, not just what action label appears.

Prefer language about:

- shoulders
- neck
- gaze
- hands
- steps
- stillness before release
- force texture such as `轻`, `压`, `断`, `拖`, `藏`, `爆`

Avoid vague action piles such as:

- `帅气打斗`
- `动作很酷`
- `特效炸裂`
- `高燃斩击`

If the motion sounds like any character could do it, it is not ready.

## Effect Usage Rule

Treat effects as a support layer, not a headline.

- Put effect wording after the action sentence or scene sentence, never before主体锁定句
- Describe effects as `来源 + 轨迹 / 材质 + 强度 + 与镜头关系`
- Bind effects to motion or space
- Keep effects light to medium by default
- Avoid using effects to replace body language, shot logic, or scene logic

Avoid vague effect wording such as:

- `特效炸裂`
- `华丽光效`
- `酷炫法术`

If an effect has no source, no timing, or no relation to the role, remove it.

## Common Failures and Repairs

### 角色漂移

- Likely cause: 主体锁定不够强，角色稿稳定点没有重复
- Repair: rewrite主体锁定句 and一致性约束句

### 主体变多

- Likely cause: scene or action wording implies group choreography
- Repair: reinforce single-character constraint in natural language

### 服装或武器跑偏

- Likely cause: costume structure and weapon shape appear only once or too vaguely
- Repair: repeat palette, silhouette, and weapon shape in the consistency line

### 镜头像模板

- Likely cause: using a generic short-video skeleton instead of a role-led entrance
- Repair: rewrite入口镜头 and空间关系句

### 动作像任意角色

- Likely cause: action labels without body language or force expression
- Repair: rewrite动作母题, 身体语言, and力量表达

### 场景像背景板

- Likely cause: place name without role-space relationship
- Repair: rewrite场景锁定句 around how the space is affecting the role

### 特效抢戏

- Likely cause: effect strength too high or effect introduced before role and shot are stable
- Repair: lower特效强度 and move the effect sentence after动作句或空间句

### 特效无来源

- Likely cause: effect described as floating spectacle rather than action or scene residue
- Repair: rewrite effect wording around动作母题 or场景关系

### 特效像游戏 CG，和视频风格冲突

- Likely cause: restrained style mixed with high-density elemental spectacle
- Repair: rewrite视频风格句 first, then downgrade or remove effect density

### 特效盖住角色脸和轮廓

- Likely cause: effects occupy too much of the frame or sit in the wrong shot beat
- Repair: rewrite特效与镜头关系句 and reduce frame coverage

## Silent Self-Check

Before output, silently verify:

- Is there only one main character?
- Can the audience recognize the role immediately?
- Is the scene relationship explicit?
- Can I see the entrance, build, and payoff?
- Is the motion serving the role rather than replacing the role?
- If effects are used, do they have a source and a clear timing?
- If effects are used, do they still leave the face, silhouette, and shot readable?
- Is the dominant axis clear?
- Is this natural-language shot design rather than a keyword pile?
