# Bark React

A wireframe social media app in the browser. Pick a user, write posts, see the feed, follow people.

## Running it

You need **Node.js 20 or newer** (`node -v` to check).

```bash
cd bark-react
npm install
npm run dev
```

Vite will print a local URL (usually <http://localhost:5173>). Open it. You'll land on the **Pick a user** screen.

State is persisted to `localStorage` under the key `bark-store`. To wipe it, click **Reset Bark** in the navigation bar — that clears your follows, your posts, AND your current login, then drops you back at the user picker.

## Running the tests

```bash
npm test
```

Tests live alongside the files they test (e.g. `src/storage.test.ts`). Use `npm run test:watch` while building a new feature.

## Building and typechecking

```bash
npm run build       # typecheck + production build to dist/
npm run typecheck   # typecheck only
npm run preview     # serve the production build locally
```

## What v1 does

- Pick which of 6 test users you are
- See the **feed** — all posts from everyone, newest first
- **Write a post** (text only) from the composer above the feed
- View a **profile** — bio, follow count, and that user's posts
- **Find users** — search by username/displayName; follow or unfollow from results
- **Reset Bark** — clears everything

That's the entire feature set. Everything else is in [`EXTENSIONS.md`](./EXTENSIONS.md).

## Project structure

```
bark-react/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── EXTENSIONS.md
└── src/
    ├── main.tsx                       — React entry point (mounts <App />)
    ├── App.tsx                        — routing + protected-shell wrapper
    ├── App.css                        — single stylesheet (Datadog purple + rounded corners)
    ├── vite-env.d.ts                  — Vite client types (CSS imports etc.)
    ├── test-setup.ts                  — clears localStorage before each test
    ├── types.ts                       — User, Post, Store
    ├── data/
    │   └── testUsers.ts               — static (read-only) test users + seed posts
    ├── storage.ts (+ .test.ts)        — load / save / reset / subscribe (localStorage)
    ├── session.ts (+ .test.ts)        — current-user state (wraps store.currentUserId)
    ├── users.ts   (+ .test.ts)        — getAllUsers, getUserById, searchUsers
    ├── posts.ts   (+ .test.ts)        — createPost, getAllPosts, getPostsByAuthor
    ├── follows.ts (+ .test.ts)        — follow, unfollow, isFollowing, getFollowing
    ├── useStoreVersion.ts             — hook that re-renders on storage changes
    ├── context/
    │   └── CurrentUserContext.tsx     — React context for the logged-in user
    ├── components/
    │   ├── Avatar.tsx (+ .test.tsx)   — colored circle with initials
    │   ├── NavBar.tsx                 — top nav + Reset Bark button
    │   ├── PostCard.tsx               — renders a single post
    │   ├── PostComposer.tsx           — textarea + Post button
    │   └── UserCard.tsx               — user row with Follow/Unfollow button
    └── pages/
        ├── PickUser.tsx               — startup landing (grid of users)
        ├── Feed.tsx                   — composer + all posts
        ├── Profile.tsx                — any user's profile (own or someone else's)
        └── FindUsers.tsx              — search box + results
```

### What each file is for

- **`src/main.tsx`** — Mounts `<App />` into `#root` with `<StrictMode>`. Imports `App.css`.
- **`src/App.tsx`** — `BrowserRouter` + `<Routes>`. Defines `/pick-user`, `/feed`, `/profile/:userId`, `/find`. `ProtectedShell` redirects to `/pick-user` if there is no logged-in user.
- **`src/App.css`** — Every style lives here. CSS variables for color, radius, shadow. Datadog purple is `--color-primary: #632CA6`.
- **`src/types.ts`** — Shared `User`, `Post`, `Store` types. Match the shapes in `data/testUsers.ts`.
- **`src/data/testUsers.ts`** — The six test users and their seed posts. **Read-only.** Edit this file to change who exists in Bark or what they have already posted.
- **`src/storage.ts`** — The only file that touches `localStorage`. Exports `load`, `save`, `reset`, plus `subscribe` so other code can react to changes.
- **`src/useStoreVersion.ts`** — Hook that returns a counter; subscribes to storage on mount. Call it in any component that reads from storage so it re-renders when something changes.
- **`src/session.ts`** — Wraps `store.currentUserId`. `setCurrentUser`, `getCurrentUser`, `clearCurrentUser`. There is no auth — picking a user just records who you are.
- **`src/users.ts`** — Read-only operations on test users: `getAllUsers`, `getUserById`, `searchUsers`.
- **`src/posts.ts`** — `createPost(authorId, content)` writes to storage. `getAllPosts()` returns seed posts ∪ user posts, newest first. `getPostsByAuthor(id)` filters that.
- **`src/follows.ts`** — One-way follow model. `follow(a, b)`, `unfollow`, `isFollowing`, `getFollowing`.
- **`src/context/CurrentUserContext.tsx`** — Provides `{ user, setUser, signOut }`. Subscribes to the store so external resets propagate. Use `useCurrentUser()` from anywhere inside `<App />`.
- **`src/components/*`** — Small, focused, reusable. `Avatar` is a colored circle with initials. `PostCard`/`UserCard` render one entity. `PostComposer` is the create-post form. `NavBar` is the top bar.
- **`src/pages/*`** — One per route. Each reads from the lib layer (and uses `useStoreVersion` if it needs to react to changes), then composes the UI from components.

## How the layers fit together

```
main.tsx
   │
   ▼
App.tsx  ──► <BrowserRouter><Routes><Route ...>
   │           │
   │           ▼
   │       pages/{PickUser, Feed, Profile, FindUsers}.tsx
   │           │
   │           ▼
   │       components/{NavBar, PostCard, PostComposer, UserCard, Avatar}.tsx
   ▼
context/CurrentUserContext.tsx  +  useStoreVersion.ts
   │
   ▼
{session, users, posts, follows}.ts
   │
   ▼
storage.ts  ◄──►  localStorage (key: "bark-store")
```

- The **page layer** owns the route shape and orchestrates the screen.
- The **component layer** is purely presentational (+ tiny local state for forms, follow buttons, etc.).
- The **lib layer** (`session`, `users`, `posts`, `follows`) is pure logic with one dependency: `storage.ts`.
- The **storage layer** is the only thing that touches `localStorage`, and it publishes change events so components re-render.

All tests live on the lib layer + one component (`Avatar`) as a template.

## Where to make changes

| If you want to… | Edit |
|---|---|
| Add a new field to posts (e.g. `likes`) | `src/types.ts`, `src/posts.ts`, `src/posts.test.ts` |
| Add a new field to users (e.g. `location`) | `src/types.ts`, `src/data/testUsers.ts`, `src/users.ts` |
| Add a new page | `src/pages/<Thing>.tsx` + a `<Route>` in `src/App.tsx` + a link in `src/components/NavBar.tsx` |
| Add a new UI component | `src/components/<Thing>.tsx` + a `.test.tsx` next to it |
| Change colors / radii / shadows | The `:root { --color-* }` block at the top of `src/App.css` |
| Change how data is stored | `src/storage.ts` |
| Add a free-API integration | A new file like `src/posts/weather.ts` then wire it into a page or component |

See [`EXTENSIONS.md`](./EXTENSIONS.md) for concrete extensions with hints and test prompts.

## Tips for extending with Claude

- Write a failing test first. Show it to Claude. Ask Claude to implement just enough to make it pass.
- Keep the lib layer pure: it should not know about React. UI lives in `components/` and `pages/`.
- Components that read from storage need `useStoreVersion()` to re-render on changes. If a freshly-created post or follow doesn't appear, that's the first thing to check.
- `npm test` + `npm run typecheck` should both stay green. The bar for shipping a feature is "both go green."
