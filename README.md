# Bark

A wireframe social media app — a starting point you are meant to extend.

Bark ships with the bare minimum: pick which test user you are, see a feed of everyone's posts, write your own post, and follow other users. Everything beyond that is your job — and Claude is your pair programmer.

## Two versions, pick one (or do both)

| | Best for | Stack |
|---|---|---|
| [`bark-cli/`](./bark-cli) | Practising backend / data / logic without UI friction | Node.js + Vitest |
| [`bark-react/`](./bark-react) | Practising frontend, components, and styling | Vite + React + TypeScript + Vitest |

Both versions share the **same data model and the same feature set in v1** — they differ only in how the user interacts with the app. That is deliberate: you can change the data model in either version without breaking the other.

## The philosophy

Bark is a **wireframe**, not a finished product. The code is intentionally small, simple, and unambitious. Your job is to make it more interesting. Ideas to start from live in each version's `EXTENSIONS.md`.

Suggested workflow:

1. Pick a version, run it, click/type around until you understand the v1 feature set.
2. Read the version's `README.md` — every file is described so you know where things live.
3. Pick an extension from `EXTENSIONS.md`. Open Claude. Ask for help wiring it up.
4. Write a failing test first, then make it pass. The lib/ folder is small on purpose so this is easy.
5. Repeat.

## What's in v1

- Pick a user at startup (no auth — this is a wireframe)
- Feed showing everyone's posts, newest first
- Write a text post that appears on your profile and in everyone's feed
- View any user's profile
- Follow / unfollow users (one-way, Twitter-style)
- Search for users by username or display name
- Reset state to start over

## What's deliberately missing

Comments, likes, photo posts, hashtags, mentions, edit/delete, notifications, real auth, mutual friendship, multi-user networking, mobile responsiveness.

These are not bugs. They are your assignments. See `EXTENSIONS.md` in each version.

## Setup

### Required

1. **Node.js 20 or newer** (this also installs `npm`).
   - Verify: `node -v` should print `v20.x.x` or higher.
   - Install: download the LTS from <https://nodejs.org>, or `brew install node` on macOS, or use [nvm](https://github.com/nvm-sh/nvm) (`nvm install --lts && nvm use --lts`).
2. **A terminal** — built into macOS/Linux; on Windows use Terminal, PowerShell, WSL, or Git Bash.

### Recommended

3. **A code editor** — VS Code is free and handles JS/TS out of the box: <https://code.visualstudio.com>
4. **Access to Claude** — either Claude.ai (web) or Claude Code in the terminal (`npm install -g @anthropic-ai/claude-code`). The `EXTENSIONS.md` workflow assumes one of these is available.

### Not needed

git (you're unzipping, not cloning), Python, Docker, databases, or a global TypeScript install. All language tooling (React, TypeScript, Vitest, `@inquirer/prompts`, etc.) is pulled in by `npm install` per version.

### Verifying your setup

After unzipping, network access is needed for the first `npm install` in each version (it downloads ~25 packages for CLI, ~150 for React). Then nothing else is hosted — everything runs locally.

From inside the unzipped `Bark/` directory:

```
cd bark-cli      && npm install && npm test    # should say "34 passed"
cd ../bark-react && npm install && npm test    # should say "39 passed"
```

If both go green, you have the right Node version and a working setup.

## Conventions you'll see in this repo

- Storage is local and persistent. A `reset` command wipes it back to factory state.
- Test users and their seed posts are **read-only** — they live in `data/testUsers` and are never written to storage. Storage only tracks what *you* do (who you follow, posts you create, who you logged in as).
- Each logic file has a sibling test file. If you change behaviour, change the test.
- No backend, no server. Everything runs on your machine.
