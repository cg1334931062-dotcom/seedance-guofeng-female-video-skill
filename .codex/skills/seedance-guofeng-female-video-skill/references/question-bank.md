# Question Generation Constraints

## Purpose

This file is not a question menu.  
It is a constraint library for generating better questions.

Use it to decide:

- what kind of question to ask next
- what creative gap the question should close
- what a good question must accomplish
- what a bad question looks like

Do not lift wording from this file unless there is a very specific reason to do so.

## Global Rule

Generate each question from the live user context.  
Do not reuse stock wording.  
Do not present reference phrases as if they were a fixed questionnaire.
When options are useful, synthesize the option directions yourself before consulting any reference file.
References may validate, sharpen, or diversify the set, but they should not be copied into user-facing options one-for-one.

Every question should do at least one of these:

- discover taste
- sharpen distinctiveness
- resolve a contradiction
- translate vague language into design language
- move the role from generic to memorable
- move the concept from static to filmable
- make the scene usable, not decorative
- decide whether特效 should exist at all

For video or整链路 tasks, do not silently infer any of `角色`、`场景`、`视频风格`、`总时长`、`镜头设计`、`动作设计` and then stop. If any one of them has not been explicitly discussed or explicitly provided, generate the next question to close that gap.
For video or整链路 tasks, do not treat `角色` as complete when the model only knows身份和气质. `容貌/脸感`、`发型/头部轮廓`、`服装轮廓` must also be explicit before the skill moves on.

## Task Routing Guardrails

This skill is video-first.

- Treat `视频`、`运镜`、`镜头`、`动态`、`预告`、`节奏`、`时长`、`Seedance` as strong video signals.
- Do not treat a bare `帮我设计一个古风女角色` as a static-image request by default.
- Only route to static-only logic when the user explicitly asks for `立绘`、`海报`、`角色设定图`、`SeedDream 静态图`.
- For obvious video requests, the first question should usually target视频目标、成片感觉、或总时长与传播节奏, not hair / makeup / weapon first.

## Confirmation Rule

- For video or整链路 tasks, require explicit confirmation for `角色`、`场景`、`视频风格`、`总时长`、`镜头设计`、`动作设计`.
- For video or整链路 tasks, `角色` confirmation must include `容貌/脸感`、`发型/头部轮廓`、`服装轮廓`, and not only身份与气质.
- A structured recap plus explicit user confirmation counts.
- Replies like `差不多`、`都行`、`你定` do not count as confirmation.
- If the user gives a full brief in the first turn, still produce one structured recap before the final prompt.

## Option Generation Rule

When you give options:

- create them dynamically from current context
- keep them aesthetically distinct
- avoid repeating the same semantic cluster from recent turns
- make at least one option a genuinely new direction
- make at least one option a recommended convergence direction
- make the set feel authored for this exact turn, not extracted from a library page
- if the runtime supports structured interactive input, emit the options through that interactive surface rather than as normal assistant prose
- if the runtime does not support structured interactive input, do not output pseudo-clickable numbered or bulleted menus; rewrite the turn as one concise freeform question instead

Avoid options that feel like:

- form fields
- template category dumps
- direct lifts of section headings from references
- near-synonyms
- repeated stock menus
- fake buttons or fake multiple-choice lists

## 1. Discovery Layer

### Goal

Help the user discover what they want the audience to remember first.

### Ask this layer when

- the user has no clear role in mind
- the user only gives a mood word
- the user says things like `高级一点` or `有感觉`
- the user is still describing reaction rather than design

### Good question qualities

- ask about first impression, emotional temperature, or memory hook
- avoid forcing identity too early
- help the user discover taste instead of select a role label
- when the task smells like video, tilt toward the memory of the finished piece, not a static portrait sheet

### Avoid

- starting with role occupation
- starting with rigid model/task mode if the role still does not exist
- starting with hair / makeup / weapon details too early
- assuming a static-image deliverable when the request could just as easily be a video brief

### Minimal example

Instead of:

`你要古风女侠还是仙门剑修？`

Prefer a question that asks what the role should feel like before naming her.

## 2. Faceprint Layer

### Goal

Turn a vague feeling into a recognizable person.

### Ask this layer when

- the user has a mood but not a face
- the role still feels generic
- the user has style but no person

### Required design domains

The model should gradually make clear:

- role identity
- age / face age
- face / eye feeling
- hair / head silhouette
- costume / weapon silhouette
- signature detail

For video or整链路 tasks, these are not optional refinements. The skill should not enter场景层 before `face / eye feeling`、`hair / head silhouette`、`costume silhouette` are explicit enough to be described back to the user.

### Good question qualities

- increase distinctiveness
- make the role nameable
- create a visible silhouette
- produce a memorable anchor
- remind the model that the faceprint is for video stability, not automatically for a static role sheet
- make sure the user can actually imagine her face, head silhouette, and costume silhouette before the skill moves to scene or style

### Avoid

- asking all appearance fields in a checklist sequence
- splitting hair, makeup, costume, weapon into a mechanical four-step form
- reusing the same stock options for every role
- jumping to场景、风格、镜头 when `容貌/脸感`、`发型`、`服装轮廓` are still vague

### Minimal example

Instead of:

`发型选长发半束还是高马尾？`

Prefer a question that asks what kind of presence the head silhouette should create.

## 3. Scene Design Constraints

### Goal

Place the role inside a coherent visual space that can support both video and, when explicitly requested, role-sheet imagery.

### Ask this layer when

- the role exists but does not yet live in a usable world
- the scene still feels generic
- the environment does not yet amplify the faceprint
- the user keeps naming locations but not relationships

### Resolve these questions

- what kind of space makes this role strongest
- whether the space presses on her, opens around her, hides her, or gets taken over by her
- what in the environment is moving for her
- what light / weather / material quality should define the frame
- what compositional anchor the audience should remember

### Good question qualities

- connect character to space
- connect environment dynamics to emotion
- make the scene feel irreplaceable
- give the camera something specific to enter through

### Avoid

- dumping fixed location menus
- offering scenic choices that do not relate to the current role
- treating scene as a wallpaper behind an already-finished role
- letting “style” answer scene questions by accident

### Minimal example

Do not just ask where to place her. Ask what kind of space makes her strongest, and what that space is doing to her.

## 4. Video Layer

### Goal

Turn the role into a filmable moving experience.

### Ask this layer when

- the role is already real enough to survive motion
- the user wants rhythm, motion, or storyboard
- the task is video or full chain

### Good question qualities

- clarify what the video should make the audience feel
- clarify whether the piece is showcase, conflict, atmosphere, preview, or explosive montage
- clarify the rhythm and payoff shape
- connect motion design back to the role faceprint
- when possible, connect the ask to传播节奏 rather than only镜头名词

### Avoid

- jumping into video types before the role exists
- using fixed video template names as the first move
- asking storyboard structure before emotional direction is clear
- starting with static appearance fields when the prompt is obviously asking for a video

### Minimal example

Ask what kind of cinematic experience the user wants, then narrow into structure.

## 5. Video Style Constraints

### Goal

Make the finished piece feel like a specific kind of film object, not just a role in a location.

### Ask this layer when

- the role exists
- the scene exists
- but the finished piece still has no explicit screen identity
- the user talks in broad words like `高级` or `电影感`
- the user says `游戏CG风格`、`水墨感`、`动漫电影感` but has not yet narrowed the style base

### Resolve these questions

- what rendering base this belongs to
- what the image texture feels like
- what the clarity / air relationship feels like
- what the emotional axis feels like
- what kind of finished piece this is closest to
- why that style suits this role and scene
- whether any style conflict must be resolved before镜头层

### Good question qualities

- ask the style layer in order: `渲染基底 -> 虚实关系 / 空气感 -> 情绪主轴 -> 成片对象 -> 适配理由`
- ask whether the piece is closer to `仙侠过场 CG`、`宣传主视觉 CG`、`国风动漫电影感`、`写意水墨`、`插画动效感`、`柔光梦境感实拍 / 拟实拍`
- ask what the piece should feel like when watched
- ask whether the people and space should land as `人清景雾`、`人景都清`, or `人景都柔`
- ask whether it should feel cold, airy, heavy, dreamy, wet, sharp, or restrained
- ask whether it resembles a剧情过场、角色 PV、海报延展、梦境凝视, or情绪碎片
- ask how the style amplifies the role rather than just decorating her
- make the user explicitly choose or confirm a screen identity before the skill moves on
- if the style directions conflict, ask the user to choose the dominant axis before leaving this layer
- if options are used, rewrite the style choices into current-project language instead of repeating reference taxonomies

### Avoid

- reducing style to a fixed menu only
- turning the current style library into the user-facing option set with minimal rewriting
- skipping style because scene and role are already clear
- letting the camera layer answer style questions by accident
- treating `电影感`、`高级`、`氛围感` as sufficient style lock without one more explicit narrowing turn
- treating `游戏CG风格`、`水墨感`、`动漫感` as sufficient style lock without one more基底 narrowing turn
- moving into镜头层 before `渲染基底`、`虚实关系 / 空气感`、`成片对象` are explicit
- carrying unresolved conflicts such as `留白 + 高燃` or `水墨 + 强特效游戏 CG` forward into shot design

### Minimal example

Ask whether the piece is closer to `仙侠过场 CG` or `写意水墨` before asking how the camera should move. If the user already says `游戏CG风格`, first ask what kind of CG object it should be, not how many shots it has.

## 6. Shot Design Constraints

### Goal

Design how the audience enters the role and how the video gains cinematic force.

### Ask this layer when

- the role exists but the video still feels generic
- the scene exists but the camera has no clear relationship to it
- the user knows they want video but not how it should move
- the answer is still too close to a reusable short-video template

### Resolve these questions

- how long the finished piece should be
- what传播节奏 that duration implies
- what is the entrance shot
- what should the audience notice first
- where does emotional intensity rise
- how does the camera relate to the role and the space
- how should the ending stay in memory

### Good question qualities

- ask total duration early inside the shot layer because duration controls shot density
- prefer recommended duration bands first:
  - `短促传播型：5-8 秒`
  - `标准传播型：8-12 秒`
  - `展开表达型：12-18 秒`
- let the model recommend one band based on the current role / scene / style, then ask the user to confirm or adjust
- accept a specific second count immediately when the user gives one
- ask how the audience enters the character
- ask how emotion escalates or accumulates
- ask whether the environment presses on the role or opens around her
- ask whether the ending should freeze, push in, pull away, or leave contrast
- make the user explicitly choose or confirm duration / entrance / progression / ending logic before final packaging

### Avoid

- starting with a rigid three-part skeleton
- defaulting to `近景抓脸 -> 中景动作 -> 定格`
- leaving `总时长` until after the storyboard is already fixed
- turning the camera layer into a menu of fixed shot names
- treating a generic skeleton as sufficient just because the rest of the prompt is already usable
- when the shot design still feels generic, switch to `guofeng-female-shot-inspiration.md` and ask from directorial relationship rather than template structure

### Minimal example

Instead of asking for a ready-made storyboard skeleton, ask what duration档位 makes this role传播得最强，再问那种时长下最合适的入口方式。

## 7. Motion Design Constraints

### Goal

Design movement that serves the role, rather than generic action labels.

### Ask this layer when

- the role exists and the shot logic exists
- the motion is still generic
- the user wants more energy but not necessarily more fighting

### Resolve these questions

- what movement logic this person has
- what her body language feels like
- how she expresses force
- whether motion supports or contrasts her气质
- whether the motion density still fits the confirmed total duration

### Good question qualities

- ask about shoulders, neck, hands, steps, stillness, and release
- ask whether the force is light, pressing, breaking, dragging, hidden, or explosive
- ask whether motion should sharpen the role or reveal a contradiction in her
- make sure the action density still matches the chosen duration band or exact second count

### Avoid

- reducing motion to stock labels only
- assuming `高燃` always means stronger attack actions
- using the same action motifs for every archetype
- ignoring the confirmed duration when proposing action density
- when motion still sounds like label selection, switch to `guofeng-female-motion-inspiration.md` and ask from body language, force texture, and role congruence

### Minimal example

Instead of asking only `转身抬剑还是踏风前冲`, ask what kind of身体语言 and力量感 this role should carry within the confirmed duration.

## 8. Effects Design Constraints

### Goal

Decide whether effects are needed, then make them serve the role, shot logic, and scene logic.

### Ask this layer when

- the video core is already stable
- the action has a payoff that might benefit from an effect
- the scene has dynamic media worth amplifying
- the user explicitly asks for effects

### Resolve these questions

- whether effects are needed at all
- what the effect is coming from
- how much of the frame the effect should occupy
- whether the effect strengthens the role or creates a deliberate contrast
- when the effect appears and when it should recede
- whether effect density still fits the confirmed duration

### Good question qualities

- ask whether the effect should make her feel more dangerous, divine, airy, or simply louder
- ask whether the audience should see the person first, or the abnormal trace she leaves behind
- ask whether the effect lives in the space, in the weapon, in the movement, or in the light
- ask how to keep the effect from overpowering the face, silhouette, and shot

### Avoid

- directly asking the user to choose fire, lightning, ice, or wind as a menu
- treating effects as a spell list
- asking about effect color or particle type before the role and motion are stable

### Minimal example

Do not ask “你要火雷冰风哪个特效”. Ask what kind of异象 should appear, why it belongs to her, and whether it should be seen as pressure, residue, or release.

## 9. Vague Language Handling

### Goal

Translate broad taste words into usable aesthetic differences.

### Use when

- the user says `高级`
- the user says `仙气`
- the user says `好看`
- the user says `有感觉`
- the user says `短一点`

### Good model behavior

- propose several materially different interpretations
- recommend one dominant reading
- ask a follow-up that narrows taste or duration, not just one more label

### Avoid

- echoing the vague word back unchanged
- treating one broad word as enough to continue

## 10. Contradiction Handling

### Goal

Resolve tension before it spreads into the whole design.

### Use when

- the user wants mutually pulling directions
- the role’s faceprint and video mode are fighting
- aesthetic temperature and action mode conflict
- restrained style and strong effects are fighting
- total duration and desired narrative density are fighting

### Good model behavior

- name the conflict plainly
- explain the design consequence
- propose a main axis and a supporting axis
- ask for a priority choice

### Avoid

- preserving every direction equally
- pretending conflict is not a problem
- stacking contradictory tags into the final result

## 11. Uniqueness Upgrade

### Goal

Push the role past generic prettiness.

### Use when

- the role sounds attractive but familiar
- the answer could describe too many characters
- the role is still just a clean combination of labels

### Good model behavior

- add one stronger memory anchor
- sharpen one contrast
- add one fate or social aura dimension
- name the role in a way that proves distinctiveness

### Avoid

- adding random decoration
- adding more tags without changing identity

## 12. Final Confirmation Constraints

### Goal

Lock the video-ready decision set before final packaging.

### Use when

- all six core items are already stable enough
- the user is asking for the final prompt
- the brief looked complete from the start and now needs one explicit lock

### Good model behavior

- recap `角色`、`场景`、`视频风格`、`总时长`、`镜头`、`动作` in six short lines
- ask for explicit confirmation or adjustment
- keep this step convergent, not divergent

### Avoid

- reopening multiple alternative directions at this stage
- treating `差不多`、`都行`、`你定` as acceptance
- skipping the recap because the brief looked detailed

## 13. Stop Rule Support

Do not stop because the schema is full.  
Stop only when:

- the role can be visualized
- the role can be named in one line
- the role feels distinct from a generic template
- the role includes explicit `容貌/脸感`、`发型/头部轮廓`、`服装轮廓`, not just身份和气质
- the scene can be described as a specific role-space relationship
- the video style is explicit
- the video style has been explicitly discussed or explicitly provided, not only inferred
- the total duration has been explicitly discussed or explicitly provided, not only guessed from pace words
- the shot structure can grow naturally from that role, scene, and confirmed duration
- the shot logic has been explicitly discussed or explicitly provided, not only guessed from style words
- the motion design feels like this person, not just a motion label
- one structured recap has explicitly confirmed `角色`、`场景`、`视频风格`、`总时长`、`镜头`、`动作`
- if effects are activated, the effect has a clear source, weight, timing, and anti-overpowering rule
