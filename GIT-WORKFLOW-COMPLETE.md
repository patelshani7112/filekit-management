# FILEKIT – Complete Git Workflow Guide

This document explains **exactly** what to do when coding, starting a new feature, merging finished work, updating main, and managing branches. Follow this step-by-step and you will never get confused.

---

# 🧾 0. Golden Rules

- **Never delete:** `main`, `dev`
- **Always build new stuff on:** a `feature/...` branch (created from `dev`)
- **Only merge into `main` when:** `dev` is stable and fully tested

---

# 🟢 START OF DAY – Before Coding

1. Go to your project folder:

```bash
cd FILEKIT





git checkout dev
git pull
git status     # see changes or confirm it's clean





🟡 START A NEW FEATURE

(New tool, new UI, new route, any new functionality)

Examples:

Add Compress PDF slider

Add Edit PDF UI

Add PDF → JPG converter

Add watermark tool

✔ Step 1: Make sure you're on dev
git checkout dev
git pull

✔ Step 2: Create a new feature branch
git checkout -b feature/short-name


Examples:

git checkout -b feature/compress-pdf-slider
git checkout -b feature/edit-pdf-ui
git checkout -b feature/repair-pdf

✔ Step 3: Confirm
git status   # shows: On branch feature/short-name


👉 From now on, write all code for this feature inside this branch.

🟠 WHILE WORKING ON THE FEATURE

Every time you finish a small part of the feature:

git status
git add .
git commit -m "feat(frontend): short description of what you did"
git push -u origin feature/short-name


Examples:

feat(frontend): add slider for compress pdf
feat(backend): add /compress route with quality param
fix(frontend): handle corrupted pdf error


🎯 You can commit many times while working on the same feature branch.

🟣 FEATURE DONE – MERGE BACK INTO dev

You tested it locally, everything works → it’s ready.

✔ Step 1: Go back to dev and update it
git checkout dev
git pull

✔ Step 2: Merge your feature branch into dev
git merge feature/short-name
git push     # send updated dev to GitHub

✔ Step 3: Delete the feature branch (optional but recommended)
git branch -d feature/short-name              # delete locally
git push origin --delete feature/short-name   # delete on GitHub


➡ Your work is now saved inside dev.
Even if you delete the feature branch, you DO NOT lose anything.

🔵 WHEN dev IS STABLE – UPDATE main

Do this only when:

1 or more features are merged into dev

You have tested everything

The code is stable

✔ Step 1: Switch to main and update it
git checkout main
git pull

✔ Step 2: Merge dev into main
git merge dev
git push     # update main on GitHub


➡ Now main contains all stable features.
➡ Your deployment / production should be connected to main.

🔍 QUICK CHECK COMMANDS
Check current branch:
git status
# OR
git branch --show-current

See all branches (local):
git branch

See all branches (remote):
git branch -r

🧠 SUPER SHORT VERSION (Copy This)
✔ Start day
git checkout dev
git pull

✔ New feature
git checkout dev
git pull
git checkout -b feature/<name>

✔ While working
git status
git add .
git commit -m "feat(...): ..."
git push -u origin feature/<name>

✔ Feature done → merge into dev
git checkout dev
git pull
git merge feature/<name>
git push
git branch -d feature/<name>
git push origin --delete feature/<name>

✔ Dev stable → update main
git checkout main
git pull
git merge dev
git push



































And paste everything below 👇

# FILEKIT – Complete Git Workflow Guide

This document explains **exactly** what to do when coding, starting a new feature, merging finished work, updating main, and managing branches. Follow this step-by-step and you will never get confused.

---

# 🧾 0. Golden Rules

- **Never delete:** `main`, `dev`
- **Always build new stuff on:** a `feature/...` branch (created from `dev`)
- **Only merge into `main` when:** `dev` is stable and fully tested

---

# 🟢 START OF DAY – Before Coding

1. Go to your project folder:

```bash
cd FILEKIT


Make sure you're on dev and up to date:

git checkout dev
git pull
git status

🟡 START A NEW FEATURE

(New tool, new UI, new route, any new functionality)

Examples:

Add Compress PDF slider

Add Edit PDF UI

Add PDF → JPG converter

Add watermark tool

✔ Step 1: Make sure you're on dev
git checkout dev
git pull

✔ Step 2: Create a new feature branch
git checkout -b feature/short-name


Examples:

git checkout -b feature/compress-pdf-slider
git checkout -b feature/edit-pdf-ui
git checkout -b feature/repair-pdf

✔ Step 3: Confirm
git status   # should show: On branch feature/short-name


👉 From now on, write all code for this feature inside this branch.

🟠 WHILE WORKING ON THE FEATURE

Every time you finish a small part of the feature:

git status
git add .
git commit -m "feat(frontend): short description of what you did"
git push -u origin feature/short-name


Examples:

feat(frontend): add slider for compress pdf
feat(backend): add /compress route with quality param
fix(frontend): handle corrupted pdf error


🎯 You can commit many times while working on the same feature branch.

🟣 FEATURE DONE – MERGE BACK INTO dev

You tested it locally, everything works → it’s ready.

✔ Step 1: Go back to dev and update it
git checkout dev
git pull

✔ Step 2: Merge your feature branch into dev
git merge feature/short-name
git push

✔ Step 3: Delete the feature branch (optional but recommended)
git branch -d feature/short-name
git push origin --delete feature/short-name


➡ Your work is now safely stored in dev.

🔵 WHEN dev IS STABLE – UPDATE main

Do this only when:

1 or more features are merged into dev

You have tested everything

The code is stable

✔ Step 1: Switch to main and update it
git checkout main
git pull

✔ Step 2: Merge dev into main
git merge dev
git push


➡ Now main contains all stable features.
➡ Your deployment / production should be connected to main.

🔍 QUICK CHECK COMMANDS
Check current branch:
git status
# OR
git branch --show-current

See all branches (local):
git branch

See all branches (remote):
git branch -r

🧠 SUPER SHORT VERSION (Copy This)
✔ Start day
git checkout dev
git pull

✔ New feature
git checkout dev
git pull
git checkout -b feature/<name>

✔ While working
git status
git add .
git commit -m "feat(...): ..."
git push -u origin feature/<name>

✔ Feature done → merge into dev
git checkout dev
git pull
git merge feature/<name>
git push
git branch -d feature/<name>
git push origin --delete feature/<name>

✔ Dev stable → update main
git checkout main
git pull
git merge dev
git push

🎉 That's it!

Follow this workflow every day and your project will stay clean, safe, and organized with zero confusion.

If you want, I can also help you create:

A version-control checklist

A deployment workflow

A VS Code task that shows your current branch automatically

If you'd like, I can also generate: