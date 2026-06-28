# Bark CLI

A wireframe social media app that lives in the terminal. Pick a user, write posts, see the feed, follow people.

## Running it

You need **Node.js 20 or newer** (`node -v` to check).

```bash
cd bark-cli
npm install
npm start
```

That prints an ASCII dog, asks which test user you'd like to be, then drops you into the main menu.

State is persisted to `bark-store.json` in this directory. To wipe it:

```bash
npm run reset
```

…or pick **Reset Bark** from the in-app menu. Reset clears your follows, your posts, **and your current login** — you will pick a user again on next start.

## Running the tests

```bash
npm test
```

Tests live alongside the files they test (e.g. `src/storage.test.js`). Use `npm run test:watch` while building a new feature.

## What v1 does

- Pick which of 6 test users you are
- See the **feed** — all posts from everyone, newest first
- **Write a post** (text only)
- View **your profile** — bio + posts + who you follow
- **Find users** — search by username or display name, then view their profile or follow/unfollow them
- **Reset Bark** — wipe state and log out

That is the entire feature set. Everything else is in [`EXTENSIONS.md`](./EXTENSIONS.md).

## Project structure

```
bark-cli/
├── bark.js                  — entry point: ASCII dog, pick user, start menu loop
├── package.json
├── bark-store.json          — created on first run; your follows, posts, current login
├── EXTENSIONS.md            — extension ideas (this is where you go next)
└── src/
    ├── ascii.js             — the ASCII dog and welcome banner
    ├── data/
    │   └── testUsers.js     — static (read-only) test users + their seed posts
    ├── storage.js           — load / save / reset bark-store.json
    ├── session.js           — current-user (login) state
    ├── users.js             — getAllUsers, getUserById, searchUsers (over test users)
    ├── posts.js             — createPost, getAllPosts (feed), getPostsByAuthor
    ├── follows.js           — follow, unfollow, isFollowing, getFollowing
    ├── ui/
    │   └── prompt.js        — thin wrapper around @inquirer/prompts
    └── cli/
        ├── menu.js          — main menu loop
        ├── pickUser.js      — startup screen
        ├── feed.js          — render the feed
        ├── compose.js       — write a new post
        ├── profile.js       — render a user's profile + posts
        ├── findFriends.js   — search users + follow/unfollow
        └── reset.js         — confirmation flow for Reset Bark
```

### What each file is for

- **`bark.js`** — Entry point. Handles `--reset`, prints the banner, asks for a user if none is logged in, then enters the menu loop.
- **`src/ascii.js`** — The dog and the welcome text. Pure presentation, no logic.
- **`src/data/testUsers.js`** — The six test users and their seed posts. **Read-only at runtime.** Edit this file to change who exists in Bark or what they have already posted.
- **`src/storage.js`** — The only file that touches the filesystem. Exports `load()`, `save()`, `reset()`, and `setStorePath()` (used by tests to point at a temp file).
- **`src/session.js`** — Wraps `storage.currentUserId`. `setCurrentUser`, `getCurrentUser`, `clearCurrentUser`. There is no auth — picking a user just records who you are.
- **`src/users.js`** — Read-only operations on the static user list: `getAllUsers`, `getUserById`, `searchUsers`.
- **`src/posts.js`** — `createPost(authorId, content)` writes to storage. `getAllPosts()` returns seed posts ∪ user posts, newest first. `getPostsByAuthor(id)` filters that.
- **`src/follows.js`** — One-way follow model. `follow(a, b)` makes A follow B; `unfollow`, `isFollowing`, `getFollowing` do what they say.
- **`src/ui/prompt.js`** — Re-exports `select`, `input`, `confirm` from `@inquirer/prompts` plus a `pressEnter()` helper. Customise prompt behaviour (colors, sound, etc.) here.
- **`src/cli/*`** — One file per screen. Each is an async function that prompts the user, calls into the lib layer, and returns to the main menu.

## How the layers fit together

```
bark.js
   │
   ▼
src/cli/menu.js  ──►  src/cli/{pickUser, feed, compose, profile, findFriends, reset}.js
   │                                  │
   │                                  ▼
   │                          src/ui/prompt.js  ──►  @inquirer/prompts
   ▼
src/{session, users, posts, follows}.js
   │
   ▼
src/storage.js  ◄──►  bark-store.json
```

- The **CLI layer** prompts the user and orchestrates a screen.
- The **lib layer** (`session`, `users`, `posts`, `follows`) is pure logic with one dependency: `storage.js`.
- All tests live on the lib layer because it is the only layer whose behaviour matters. The CLI layer is interactive and intentionally not unit-tested — testing interactive prompts is an extension idea in itself.

## Where to make changes

| If you want to… | Edit |
|---|---|
| Add a new menu option | `src/cli/menu.js` + a new `src/cli/<thing>.js` |
| Add a new field to posts (e.g. `likes`) | `src/posts.js` and `src/posts.test.js` |
| Add a new field to users (e.g. `location`) | `src/data/testUsers.js` and `src/users.js` |
| Change how/where data is stored | `src/storage.js` |
| Change the ASCII dog | `src/ascii.js` |
| Add a free-API integration | A new file under `src/posts/`, then call it from a new `src/cli/<thing>.js` |

See [`EXTENSIONS.md`](./EXTENSIONS.md) for concrete extensions with hints and test prompts.

## Tips for extending with Claude

- Write a failing test first. Show it to Claude. Ask Claude to implement just enough to make it pass.
- Keep the lib layer pure: a function should take its inputs and return its outputs. Side effects belong in `storage.js` or `cli/*`.
- After any change, run `npm test`. The bar for shipping a feature is "all tests pass."
