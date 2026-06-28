// Static test users and their seed posts.
//
// READ-ONLY at runtime: this file is never written to. The store
// (bark-store.json) only tracks the current user, follows, and posts
// you create. Seed posts and test users always come from here.
//
// Extension ideas:
//   - Generate users programmatically (e.g. from the DiceBear API for avatars).
//   - Read users from a JSON file so non-coders can edit them.
//   - Add more fields (interests, location) and use them in user suggestions.

const t = (iso) => Date.parse(iso);

export const testUsers = [
  {
    id: 'user_alice',
    username: 'alice',
    displayName: 'Alice Chen',
    bio: 'Coffee in one hand, paperback in the other.',
    avatarColor: '#FF6B6B',
  },
  {
    id: 'user_bo',
    username: 'bo',
    displayName: 'Bo Williams',
    bio: 'I left my phone at the trailhead. On purpose.',
    avatarColor: '#4ECDC4',
  },
  {
    id: 'user_chiara',
    username: 'chiara',
    displayName: 'Chiara Rossi',
    bio: 'Indie game dev. Currently fighting a shader.',
    avatarColor: '#FFD93D',
  },
  {
    id: 'user_devon',
    username: 'devon',
    displayName: 'Devon Park',
    bio: 'Line cook by night. Sourdough enjoyer by morning.',
    avatarColor: '#95E1D3',
  },
  {
    id: 'user_emi',
    username: 'emi',
    displayName: 'Emi Tanaka',
    bio: 'Looking up. Always looking up.',
    avatarColor: '#A8DADC',
  },
  {
    id: 'user_finn',
    username: 'finn',
    displayName: "Finn O'Brien",
    bio: 'Three chords and the truth.',
    avatarColor: '#F4A261',
  },
];

export const testPosts = [
  { id: 'post_seed_1', authorId: 'user_alice', content: 'First flat white of the day. Also rereading Le Guin.', timestamp: t('2026-06-23T08:14:00Z') },
  { id: 'post_seed_2', authorId: 'user_alice', content: 'Library haul: 4 books, 0 self-control.', timestamp: t('2026-06-22T17:02:00Z') },

  { id: 'post_seed_3', authorId: 'user_bo', content: 'Made it to the ridge by sunrise. Worth every blister.', timestamp: t('2026-06-23T05:47:00Z') },
  { id: 'post_seed_4', authorId: 'user_bo', content: 'Pro tip: pack the snacks you actually want to eat.', timestamp: t('2026-06-21T14:30:00Z') },

  { id: 'post_seed_5', authorId: 'user_chiara', content: 'Finally fixed the lighting bug. It was, of course, a typo.', timestamp: t('2026-06-22T23:19:00Z') },
  { id: 'post_seed_6', authorId: 'user_chiara', content: 'Day 12 of "I will not start a new project before finishing this one."', timestamp: t('2026-06-20T11:05:00Z') },

  { id: 'post_seed_7', authorId: 'user_devon', content: 'New brunch menu drops Saturday. Trust me on the corn.', timestamp: t('2026-06-23T09:30:00Z') },
  { id: 'post_seed_8', authorId: 'user_devon', content: 'Sourdough loaf #47. Crumb is finally looking right.', timestamp: t('2026-06-19T07:10:00Z') },
  { id: 'post_seed_9', authorId: 'user_devon', content: 'If you put pineapple on pizza, this is a safe space.', timestamp: t('2026-06-18T20:45:00Z') },

  { id: 'post_seed_10', authorId: 'user_emi', content: 'Saturn through a 6-inch tonight. The rings just hit different.', timestamp: t('2026-06-22T22:30:00Z') },
  { id: 'post_seed_11', authorId: 'user_emi', content: 'Clear skies tomorrow. Bringing the scope to Centennial Park if anyone wants to look.', timestamp: t('2026-06-21T19:00:00Z') },

  { id: 'post_seed_12', authorId: 'user_finn', content: "Open mic on Thursday. Doing the new song. Please come or please don't.", timestamp: t('2026-06-23T12:00:00Z') },
  { id: 'post_seed_13', authorId: 'user_finn', content: 'Restrung the Tele. It sounds like a million bucks. (Used strings: $7.99.)', timestamp: t('2026-06-20T16:42:00Z') },
];
