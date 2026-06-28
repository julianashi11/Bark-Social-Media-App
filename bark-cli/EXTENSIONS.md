# Bark CLI — Extension Ideas

Bark v1 is intentionally tiny. Here is a catalogue of things to build on top of it, grouped by difficulty. Each idea tells you:

- **what it teaches** — the concept the extension is really about
- **where to start** — the file(s) you will touch
- **tests to add** — at least one failing test to write first

Workflow that tends to work well:

1. Pick an idea.
2. Open Claude in `bark-cli/`. Paste in the section.
3. Write the failing test together. Run `npm test` and watch it fail.
4. Make it pass. Run `npm test` again and watch it go green.
5. Wire the new behaviour into a `src/cli/*.js` screen so you can use it.

---

## Starter (no APIs needed)

### 1. Relative timestamps ("5 minutes ago")
- **Teaches:** pure functions, date math.
- **Where:** `src/cli/feed.js` `printPost()` formats the timestamp with `toLocaleString`. Add a `src/lib/relativeTime.js` that converts ms-since-epoch into a friendly string.
- **Tests:** a unit test for the helper. Given `Date.now() - 5*60*1000`, expect `"5 minutes ago"`. Cover seconds, minutes, hours, days.

### 2. Likes
- **Teaches:** evolving the data model, idempotent operations.
- **Where:** add `likes: string[]` (user ids) to each post. Update `src/posts.js` with `likePost(postId, userId)` and `unlikePost(postId, userId)`. Show like count in `printPost()`. Add a "Like a post" menu option.
- **Tests:** liking twice does not add twice. Liking returns the new count. Unliking removes only that user's like.

### 3. Edit / delete your own posts
- **Teaches:** authorisation checks.
- **Where:** `editPost(postId, userId, newContent)` and `deletePost(postId, userId)` in `src/posts.js`. Reject if `userId !== post.authorId`. Surface in a "My posts" menu.
- **Tests:** editing or deleting someone else's post throws. Editing yours updates content. Deleting yours removes it from the feed.

### 4. Sort the feed (newest / oldest / by user)
- **Teaches:** composing operations.
- **Where:** `getAllPosts({ sort })` — or a separate function per mode. Add a menu choice in `cli/feed.js` to pick.
- **Tests:** cover each sort mode against a fixed set of posts.

### 5. ANSI colors and bold text
- **Teaches:** terminal output, adding dependencies.
- **Where:** `npm install chalk`. Use it in `src/cli/feed.js` and `src/ascii.js`. Make handles purple. Make headers bold.

### 6. Switch users mid-session (without resetting)
- **Teaches:** reusing existing flows.
- **Where:** add a "Switch user" menu option in `src/cli/menu.js` that re-runs `pickUser()` but **does not** call `reset()`. Your follows and posts should survive the switch.
- **Tests:** after a switch, `getCurrentUser()` returns the new user. After a switch, the previously-followed users from your old account are still in storage (this is by design — follows are per-follower).

---

## Data transformation

### 7. Trending posts (most-liked in the last 24h)
- **Teaches:** filtering, sorting, time windows.
- **Where:** depends on Likes (#2). Add `getTrendingPosts(now = Date.now())` to `src/posts.js`.
- **Tests:** with a fixed `now`, only recent posts appear; ties on like count fall back to recency.

### 8. Hashtag parsing
- **Teaches:** regex, deriving data from text.
- **Where:** derive `hashtags: string[]` from `content` in `src/posts.js`. Add `getPostsByHashtag(tag)` and a "Search by hashtag" menu option.
- **Tests:** `#foo`, `#foo_bar`, multiple tags in one post, no tags. Case sensitivity (`#Foo` and `#foo` — same tag?).

### 9. Feed pagination
- **Teaches:** stateful iteration in a CLI.
- **Where:** `cli/feed.js` currently dumps every post. Change to 5 at a time with `next / previous / back` choices. Track the current page in local state inside `showFeed()`.
- **Tests:** a helper `paginate(items, page, size)` that returns the right slice and `hasNext/hasPrev`.

### 10. Notifications on startup
- **Teaches:** derived data, persistence of seen state.
- **Where:** add `lastSeenAt` to the store. On startup, count posts from users you follow that are newer than `lastSeenAt`. Display "You have N new posts" before the main menu, then update `lastSeenAt`.
- **Tests:** `getNewPostCount(userId, since)`.

### 11. Followed-only feed
- **Teaches:** joining two pieces of state.
- **Where:** `getFollowedFeed(userId)` in `src/posts.js`. Add a menu choice "Feed (people I follow)".
- **Tests:** with no follows, returns an empty array. With follows, returns only those authors' posts.

---

## Free API integrations

These all work without an API key.

### 12. Weather posts (Open-Meteo)
- **Teaches:** `fetch`, error handling, transforming external JSON into your own data shape.
- **Where:** new file `src/posts/weather.js`. Menu option "Post current weather". Call `https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current_weather=true`, format the result, save as a post.
- **Tests:** stub `fetch` (Vitest has `vi.fn`) and assert the post body matches the formatted weather. Cover the network-error path.

### 13. Dog facts (on-brand!)
- **Teaches:** same skills as #12. The Dog API or `random.dog` is free and on-theme.
- **Where:** `src/posts/dogFact.js`. Menu option "Post a dog fact".

### 14. Quote of the day (ZenQuotes)
- **Teaches:** caching to avoid hammering an API.
- **Where:** `src/posts/quote.js`. Store the last fetched quote + timestamp in the store so you only re-fetch after N minutes.
- **Tests:** the second call within N minutes returns the cached quote.

### 15. Trivia post (Open Trivia DB)
- **Teaches:** decoding HTML entities, presenting a multi-step interaction.
- **Where:** `src/posts/trivia.js`. Fetch a question, present the multiple-choice in the CLI, reveal the answer, and post the result.

### 16. Random avatar URLs (DiceBear)
- **Teaches:** composing URLs deterministically.
- **Where:** in `src/data/testUsers.js`, add `avatarUrl` derived from `https://api.dicebear.com/9.x/thumbs/svg?seed=<username>`. You can't display SVG in the terminal — print the URL, or use an extension to render terminal images.

---

## Harder

### 17. Mutual friendship handshake
- **Teaches:** state machines, pending vs. accepted edges.
- **Where:** new module `src/friends.js`. Friend requests are pending until accepted. Keep follows as-is — friends is a separate concept built on top.
- **Tests:** pending → accepted, pending → declined, double request is a no-op, you can't friend yourself.

### 18. @mentions
- **Teaches:** parsing, lookups, cross-references.
- **Where:** derive `mentions: string[]` from post content (handles like `@alice`). Highlight in feed display. Add `getMentionsOf(userId)`. Add a "Posts that mention me" menu option.
- **Tests:** valid handles, invalid handles, self-mentions, edges (handle at end of string, two in a row).

### 19. Export / import Bark data
- **Teaches:** serialisation and round-trip safety.
- **Where:** menu option "Export Bark data" → write JSON to `bark-export.json`. "Import" → load it (validate first!).
- **Tests:** export then import yields an identical store.

### 20. Testing the interactive CLI itself
- **Teaches:** writing tests for terminal UIs (this is genuinely hard).
- **Where:** look at libraries like `inquirer-test`, or refactor each `src/cli/*.js` so the prompts are injectable. Write a test that drives the menu without a real TTY.
- **Tests:** boot Bark, pick a user, write a post, exit. Verify storage state.

---

## Have an idea not on this list?

That is the point. Bark exists so you can build something on top of it. Open Claude, paste in `README.md`, and pitch it your idea. Then start with the failing test.
