# GitHub Publish Checklist

## 本地仓准备

- 确认仓库根目录就是本项目根目录
- 确认 `README.md` 能让不了解上下文的读者快速理解 skill 的作用
- 确认 `.gitignore` 只暴露要公开的内容
- 确认 skill 主文件和 references 已同步

## 建议仓库信息

- Repository name:
  - `seedance-guofeng-female-video-co-creation`
- Suggested description:
  - `A video-first Codex skill for co-creating ancient Chinese female Seedance videos with explicit duration, style, shot, and motion design.`

## 推送步骤

如果你已经在 GitHub 上创建好了远端仓库：

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## 发布前建议再确认

- 是否需要添加 `LICENSE`
- 是否需要补项目封面图
- README 中的 skill 名、触发名、仓库名是否一致
- 是否还残留任何不希望公开的本地配置

