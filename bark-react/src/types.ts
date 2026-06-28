export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  avatarUrl?: string;
  location?: string;
};

export type Dog = {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  age: number;
};

export type Post = {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  groupId?: string;
  timestamp: number;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  location?: string;
  createdAt: number;
};

export type Walk = {
  id: string;
  userId: string;
  distance: number; // miles
  note?: string;
  timestamp: number;
};

export type Store = {
  currentUserId: string | null;
  follows: Record<string, string[]>;
  userPosts: Post[];
  groups: Group[];
  groupMembers: Record<string, string[]>;
  userLocations: Record<string, string>;
  walks: Walk[];
};
