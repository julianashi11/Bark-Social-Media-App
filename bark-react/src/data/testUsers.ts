// Static test users, dogs, groups, and seed posts.
//
// READ-ONLY at runtime: never written to storage. The store
// (localStorage) only tracks the current user, follows, posts
// you create, groups you create, and group memberships.

import type { User, Dog, Post, Group, Walk } from '../types';

const t = (iso: string) => Date.parse(iso);

export const testUsers: User[] = [
  {
    id: 'user_alice',
    username: 'luna',
    displayName: 'Luna',
    bio: 'Champion fetch-er. Part-time couch potato. Full-time good girl.',
    avatarColor: '#FF6B6B',
    avatarUrl: 'https://placedog.net/300/300?id=1',
    location: 'Brooklyn, NY',
  },
  {
    id: 'user_bo',
    username: 'bear',
    displayName: 'Bear',
    bio: "If you can't find me, I'm on the trail. Or napping. Probably napping.",
    avatarColor: '#4ECDC4',
    avatarUrl: 'https://placedog.net/300/300?id=8',
    location: 'Denver, CO',
  },
  {
    id: 'user_chiara',
    username: 'pixel',
    displayName: 'Pixel',
    bio: 'Will herd you. Nothing personal. It is simply my calling.',
    avatarColor: '#FFD93D',
    avatarUrl: 'https://placedog.net/300/300?id=15',
    location: 'San Francisco, CA',
  },
  {
    id: 'user_devon',
    username: 'mochi',
    displayName: 'Mochi',
    bio: 'Such wow. Very independent. Much dignity. Also wants your snack.',
    avatarColor: '#95E1D3',
    avatarUrl: 'https://placedog.net/300/300?id=22',
    location: 'Austin, TX',
  },
  {
    id: 'user_emi',
    username: 'cosmo',
    displayName: 'Cosmo',
    bio: 'Howling at the moon. Always looking up. Zoomies at 2am.',
    avatarColor: '#A8DADC',
    avatarUrl: 'https://placedog.net/300/300?id=30',
    location: 'Seattle, WA',
  },
  {
    id: 'user_finn',
    username: 'riff',
    displayName: 'Riff',
    bio: 'Will eat anything. Will love anyone. No exceptions whatsoever.',
    avatarColor: '#F4A261',
    avatarUrl: 'https://placedog.net/300/300?id=37',
    location: 'Nashville, TN',
  },
];

export const testDogs: Dog[] = [
  { id: 'dog_luna',  ownerId: 'user_alice',  name: 'Luna',  breed: 'Golden Retriever',      age: 3 },
  { id: 'dog_bear',  ownerId: 'user_bo',     name: 'Bear',  breed: 'Bernese Mountain Dog',   age: 5 },
  { id: 'dog_pixel', ownerId: 'user_chiara', name: 'Pixel', breed: 'Corgi',                  age: 2 },
  { id: 'dog_mochi', ownerId: 'user_devon',  name: 'Mochi', breed: 'Shiba Inu',              age: 4 },
  { id: 'dog_cosmo', ownerId: 'user_emi',    name: 'Cosmo', breed: 'Husky',                  age: 1 },
  { id: 'dog_riff',  ownerId: 'user_finn',   name: 'Riff',  breed: 'Labrador',               age: 6 },
];

export const testGroups: Group[] = [
  {
    id: 'group_morning_run',
    name: 'Morning Run Crew',
    description: 'Early risers and their dogs. 6am trail runs, all paces welcome.',
    creatorId: 'user_alice',
    location: 'Denver, CO',
    createdAt: t('2026-06-15T07:00:00Z'),
  },
  {
    id: 'group_small_dogs',
    name: 'Small Dog Squad',
    description: 'Big personalities, tiny paws. Meetups for dogs under 25 lbs.',
    creatorId: 'user_chiara',
    location: 'San Francisco, CA',
    createdAt: t('2026-06-18T11:00:00Z'),
  },
  {
    id: 'group_weekend_park',
    name: 'Weekend Park Gang',
    description: 'Saturday and Sunday off-leash hours at Centennial Park. All sizes welcome.',
    creatorId: 'user_bo',
    location: 'Denver, CO',
    createdAt: t('2026-06-20T09:00:00Z'),
  },
];

// Seed group memberships: { groupId: [userId, ...] }
export const testGroupMembers: Record<string, string[]> = {
  group_morning_run: ['user_alice', 'user_bo', 'user_emi'],
  group_small_dogs:  ['user_chiara', 'user_devon'],
  group_weekend_park: ['user_bo', 'user_alice', 'user_finn', 'user_devon'],
};

export const testPosts: Post[] = [
  { id: 'post_seed_1', authorId: 'user_alice', content: 'Someone threw the ball and then had the audacity not to throw it again. I brought it back 14 times. Still not enough.', timestamp: t('2026-06-23T08:14:00Z') },
  { id: 'post_seed_2', authorId: 'user_alice', content: 'Napped in a sunbeam for 4 hours. Woke up. Found a better sunbeam. Napped again. Today was perfect.', timestamp: t('2026-06-22T17:02:00Z') },

  { id: 'post_seed_3', authorId: 'user_bo', content: 'Reached the top of the trail at sunrise. Rolled in something incredible up there. Got a bath immediately after. Worth it.', timestamp: t('2026-06-23T05:47:00Z') },
  { id: 'post_seed_4', authorId: 'user_bo', content: 'Pro tip: if you sit close enough and stare hard enough, the snacks will eventually come to you. Patience is a virtue.', timestamp: t('2026-06-21T14:30:00Z') },

  { id: 'post_seed_5', authorId: 'user_chiara', content: 'There was a squirrel in the yard. Then there was no squirrel. I will never know what happened and it haunts me.', timestamp: t('2026-06-22T23:19:00Z') },
  { id: 'post_seed_6', authorId: 'user_chiara', content: 'Day 12 of trying to fit on a lap that is clearly too small for me. I will not give up. I will never give up.', timestamp: t('2026-06-20T11:05:00Z') },

  { id: 'post_seed_7', authorId: 'user_devon', content: 'Someone left a sock on the floor. I have the sock now. This is my sock. I do not know what to do with the sock.', timestamp: t('2026-06-23T09:30:00Z') },
  { id: 'post_seed_8', authorId: 'user_devon', content: 'Heard a noise outside. Barked at it for 4 minutes. The noise stopped. You are welcome, everyone.', timestamp: t('2026-06-19T07:10:00Z') },
  { id: 'post_seed_9', authorId: 'user_devon', content: 'They said "no" when I tried to eat the pizza crust off the floor. But then they dropped a piece and said nothing. Interesting.', timestamp: t('2026-06-18T20:45:00Z') },

  { id: 'post_seed_10', authorId: 'user_emi', content: 'Howled at the moon for twenty minutes. It did not respond. I will try again tomorrow. The moon and I have unfinished business.', timestamp: t('2026-06-22T22:30:00Z') },
  { id: 'post_seed_11', authorId: 'user_emi', content: 'Had the zoomies at 3am for no reason. Felt amazing. Went back to sleep. 10 out of 10, would zoom again.', timestamp: t('2026-06-21T19:00:00Z') },

  { id: 'post_seed_12', authorId: 'user_finn', content: 'Ate my breakfast in four seconds. Stared at the empty bowl for another ten minutes just to make a point.', timestamp: t('2026-06-23T12:00:00Z') },
  { id: 'post_seed_13', authorId: 'user_finn', content: 'A stranger pet me on the walk today. I acted like I had never been touched before in my life. They loved it. I loved it.', timestamp: t('2026-06-20T16:42:00Z') },

  { id: 'post_seed_g1', authorId: 'user_alice', groupId: 'group_morning_run', content: 'Ran 4 miles this morning and still had enough energy to sprint the last block. My human did not. I waited politely.', timestamp: t('2026-06-23T06:45:00Z') },
  { id: 'post_seed_g2', authorId: 'user_bo',    groupId: 'group_morning_run', content: 'Hit the ridge trail at sunrise. Smelled 47 different things. This is what living feels like.', timestamp: t('2026-06-22T06:30:00Z') },
  { id: 'post_seed_g3', authorId: 'user_chiara', groupId: 'group_small_dogs', content: 'A big dog tried to sniff me today. I gave him a piece of my mind. Size is just a number.', timestamp: t('2026-06-22T14:10:00Z') },
  { id: 'post_seed_g4', authorId: 'user_bo',    groupId: 'group_weekend_park', content: 'Saturday at the park. I will be wearing the bandana. It is embarrassing but I look incredible.', timestamp: t('2026-06-21T18:00:00Z') },
];
