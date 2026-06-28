# Bark React — Extension Ideas

Bark v1 is intentionally tiny. Here is a catalogue of things to build on top of it, grouped by difficulty. Each idea tells you:

- **what it teaches** — the concept the extension is really about
- **where to start** — the file(s) you will touch
- **tests to add** — at least one failing test to write first

Workflow that tends to work well:

1. Pick an idea.
2. Open Claude in `bark-react/`. Paste in the section.
3. Write the failing test together. Run `npm test` and watch it fail.
4. Make it pass. Run `npm test` again and watch it go green.
5. Wire the new behaviour into a page or component so you can see it in the browser.

---

## Starter (no APIs needed)

### 1. Relative timestamps ("5 minutes ago")
- **Teaches:** pure functions, date math.
- **Where:** `src/components/PostCard.tsx` formats with `toLocaleString`. Add `src/lib/relativeTime.ts` that converts ms-since-epoch into a friendly string.
- **Tests:** unit-test the helper. Given `Date.now() - 5*60*1000`, expect `"5 minutes ago"`. Cover seconds, minutes, hours, days.

### 2. Likes
- **Teaches:** evolving the data model, idempotent operations.
- **Where:** add `likes: string[]` (user ids) to the `Post` type. Update `src/posts.ts` with `likePost(postId, userId)` and `unlikePost(postId, userId)`. Add a like button on `PostCard`.
- **Tests:** liking twice does not add twice. The like button toggles when clicked (component test).

### 3. Edit / delete your own posts
- **Teaches:** authorisation, conditional UI.
- **Where:** add `editPost(postId, userId, newContent)` and `deletePost(postId, userId)` to `src/posts.ts`. Reject if `userId !== post.authorId`. Surface buttons on `PostCard` only when `authorId === currentUser.id`.
- **Tests:** the lib rejects editing/deleting someone else's post. The UI hides the buttons for other users' posts.

### 4. Dark mode toggle
- **Teaches:** CSS variables, theme switching.
- **Where:** the `:root { --color-* }` block in `App.css`. Add a `body.dark` selector that overrides the variables. Add a toggle button (probably in `NavBar`). Persist the preference (extra credit: in storage).

### 5. Tabs on the Feed: All / Following
- **Teaches:** joining two pieces of state.
- **Where:** add `getFollowedFeed(userId)` to `src/posts.ts`. In `Feed.tsx`, render two tab buttons. Each tab is a separate filtered list.
- **Tests:** with no follows, the Following tab is empty. With follows, only those authors' posts appear.

### 6. Switch users mid-session (without resetting)
- **Teaches:** reusing existing flows in React.
- **Where:** add a "Switch user" link or button in `NavBar` (or a new page). It should call `setUser(...)` from the context without calling `reset()`. Your follows and posts persist.
- **Tests:** a component test that switches users and asserts the navbar's "My profile" link updates.

---

## Data transformation

### 7. Trending posts (most-liked, last 24h)
- **Teaches:** filtering, sorting, time windows.
- **Where:** depends on Likes (#2). Add `getTrendingPosts(now = Date.now())` to `src/posts.ts`. New page `pages/Trending.tsx` + route + nav link.
- **Tests:** with a fixed `now`, only recent posts appear; ties on like count fall back to recency.

### 8. Hashtag parsing
- **Teaches:** regex, deriving data from text.
- **Where:** derive `hashtags: string[]` from `content` in `posts.ts`. Add `getPostsByHashtag(tag)`. Render hashtags in `PostCard` as `<Link>`s to a new `pages/Hashtag.tsx`.
- **Tests:** `#foo`, `#foo_bar`, multiple tags, none, case sensitivity.

### 9. Infinite scroll / pagination on the feed
- **Teaches:** stateful rendering, intersection observers.
- **Where:** `pages/Feed.tsx`. Show 10 posts at a time. Either a "Load more" button (easy) or an IntersectionObserver-based infinite scroll (medium).
- **Tests:** helper `paginate(items, page, size)` with full coverage. Component test that "Load more" increases the rendered count.

### 10. Notifications badge
- **Teaches:** derived state, persistence of seen state.
- **Where:** add `lastSeenAt` to the store. `getNewPostCount(userId, since)` counts posts from followed users newer than `lastSeenAt`. Show a number badge on the **Feed** nav link. On visiting `/feed`, update `lastSeenAt`.

### 11. Suggested users to follow
- **Teaches:** trivial algorithm design (you are designing the suggestion logic).
- **Where:** new helper `suggestUsers(currentUserId)` in `src/users.ts`. v0: "any user you don't follow yet." v1: "users followed by people you follow." New `pages/Suggested.tsx`.

---

## Free API integrations

These all work without an API key.

### 12. Weather post (Open-Meteo)
- **Teaches:** `fetch`, async UI states (loading / error / success), transforming external JSON.
- **Where:** new helper `src/posts/weather.ts`. Add a "Post current weather" button on `Feed.tsx`. Call `https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current_weather=true`, format the result, save as a post via `createPost`.
- **Tests:** mock `fetch` with `vi.fn()` and assert the formatted post content. Cover the network-error branch.

### 13. Dog facts (on-brand)
- **Teaches:** same as #12. Use the Dog API or `random.dog`.
- **Where:** `src/posts/dogFact.ts`. Button on Feed.

### 14. Quote of the day (ZenQuotes)
- **Teaches:** caching to avoid hammering an API.
- **Where:** `src/posts/quote.ts`. Cache the last fetched quote + timestamp in the store. Only re-fetch after N minutes.
- **Tests:** the second call within N minutes returns the cached quote.

### 15. Real avatars (DiceBear)
- **Teaches:** SVG, composing URLs deterministically.
- **Where:** `src/components/Avatar.tsx` currently draws a colored circle. Add a prop `useImage` that swaps in `<img src={\`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.username}\`} />`. Use it in places where the avatar should be richer than initials.
- **Tests:** the existing Avatar test still passes; add a test that the image variant uses the right URL.

### 16. Trivia post (Open Trivia DB)
- **Teaches:** decoding HTML entities, multi-step UI.
- **Where:** new page `pages/Trivia.tsx`. Fetch a question, render multiple choice, reveal the answer, and offer "Post my score" which writes a post.

---

## Harder

### 17. Mutual friendship handshake
- **Teaches:** state machines, pending vs. accepted edges.
- **Where:** new module `src/friends.ts` (don't replace `follows.ts` — build alongside). Friend requests are pending until accepted. Add `pages/FriendRequests.tsx`.
- **Tests:** pending → accepted, pending → declined, double request is a no-op, you can't friend yourself.

### 18. @mentions
- **Teaches:** parsing, lookups, cross-references.
- **Where:** derive `mentions: string[]` from post content. In `PostCard`, replace matched handles with `<Link to={`/profile/${userId}`}>@handle</Link>`. Add `getMentionsOf(userId)` and a `pages/Mentions.tsx`.
- **Tests:** valid handles, invalid handles, self-mentions, edges (handle at end of string, two in a row).

### 19. Comments on posts
- **Teaches:** nested data, threaded UI.
- **Where:** add `comments: Comment[]` to `Post`. New file `src/comments.ts` with `addComment(postId, authorId, content)`. Render below the post in `PostCard`.

### 20. Direct messages
- **Teaches:** a new top-level entity, list/detail UI.
- **Where:** new module `src/messages.ts`. New routes `/messages` (list of conversations) and `/messages/:userId` (one conversation).

### 21. Settings page
- **Teaches:** putting it all together — multiple controls in one place.
- **Where:** new page `pages/Settings.tsx`. Move the Reset button there. Add dark mode toggle, language preference, default landing page, etc.

---

## Have an idea not on this list?

That is the point. Bark exists so you can build something on top of it. Open Claude, paste in `README.md`, and pitch it your idea. Then start with the failing test.
