1️⃣ Printable “Git Workflow” guide (for PDF)

You can paste this into Word / Google Docs / Notion / VS Code Markdown and then “Print → Save as PDF”.

If you want a file name, use: GIT-WORKFLOW-PRINT.md

# FILEKIT – Git Workflow Quick Guide (Printable)

## 0. Golden Rules

- Never delete: `main`, `dev`
- Always build new stuff on: a `feature/...` branch (created from `dev`)
- Only merge into `main` when `dev` is stable and tested

---

## 1. Start of Day (Before Coding)

1. Open terminal and go to project:

   ```bash
   cd FILEKIT


Switch to dev and pull latest changes:

git checkout dev
git pull
git status











2. Start a New Feature

Examples: new tool, new UI, new backend route.

Make sure you are on dev:

git checkout dev
git pull


Create a feature branch from dev:

git checkout -b feature/<name>


Examples:

git checkout -b feature/compress-pdf-slider
git checkout -b feature/edit-pdf-ui


Confirm branch:

git status   # should say: On branch feature/<name>











3. While Working on a Feature

Repeat whenever you finish a small piece of work:

git status
git add .
git commit -m "feat(frontend): short description"
git push -u origin feature/<name>


You can commit multiple times on the same feature branch.














4. Feature Done → Merge into dev

Go back to dev and update:

git checkout dev
git pull


Merge feature branch into dev:

git merge feature/<name>
git push


(Optional) Delete the feature branch:

git branch -d feature/<name>
git push origin --delete feature/<name>


Now your finished feature lives in dev.













5. Dev Stable → Update main

Do this when:

One or more features are merged into dev

You have tested everything and it works

Switch to main and update it:

git checkout main
git pull


Merge dev into main:

git merge dev
git push


Now main has all stable, tested code.
















6. Quick Commands Reference

Check current branch:

git status
# or
git branch --show-current


List local branches:

git branch


List remote branches:

git branch -r



















7. Ultra-Short Summary
# Start day
git checkout dev
git pull

# New feature
git checkout dev
git pull
git checkout -b feature/<name>

# While working
git status
git add .
git commit -m "feat(...): ..."
git push -u origin feature/<name>

# Feature done → dev
git checkout dev
git pull
git merge feature/<name>
git push
git branch -d feature/<name>
git push origin --delete feature/<name>

# Dev stable → main
git checkout main
git pull
git merge dev
git push








Insert snippet:

Either Ctrl+Shift+P → Insert Snippet → Git Workflow Helper

Or type gitFlow → Ctrl+Space → Enter