// Group operations — create groups, manage membership.
// Seed groups and memberships live in data/testUsers.ts (read-only).
// Runtime-created groups and membership changes are stored in localStorage.

import { testGroups, testGroupMembers } from './data/testUsers';
import { load, save } from './storage';
import type { Group } from './types';

let groupSeq = 0;

function nextGroupId(): string {
  groupSeq += 1;
  return `group_user_${Date.now()}_${groupSeq}`;
}

export function createGroup(
  creatorId: string,
  name: string,
  description: string,
  location?: string,
): Group {
  if (!creatorId) throw new Error('createGroup: creatorId is required');
  if (!name || !name.trim()) throw new Error('createGroup: name is required');
  if (!description || !description.trim()) throw new Error('createGroup: description is required');

  const group: Group = {
    id: nextGroupId(),
    name: name.trim(),
    description: description.trim(),
    creatorId,
    ...(location?.trim() && { location: location.trim() }),
    createdAt: Date.now(),
  };

  const store = load();
  store.groups.push(group);
  store.groupMembers[group.id] = [creatorId];
  save(store);

  return group;
}

export function getAllGroups(): Group[] {
  const store = load();
  return [...testGroups, ...store.groups].sort((a, b) => b.createdAt - a.createdAt);
}

export function getGroupById(groupId: string): Group | null {
  return getAllGroups().find((g) => g.id === groupId) ?? null;
}

export function getGroupMembers(groupId: string): string[] {
  const store = load();
  // Once a join/leave has happened for this group, use the runtime list;
  // otherwise fall back to seed membership.
  return store.groupMembers[groupId] ?? testGroupMembers[groupId] ?? [];
}

export function isMember(userId: string, groupId: string): boolean {
  return getGroupMembers(groupId).includes(userId);
}

export function joinGroup(userId: string, groupId: string): void {
  const store = load();
  const members = store.groupMembers[groupId] ?? [...(testGroupMembers[groupId] ?? [])];
  if (!members.includes(userId)) members.push(userId);
  store.groupMembers[groupId] = members;
  save(store);
}

export function leaveGroup(userId: string, groupId: string): void {
  const store = load();
  const members = store.groupMembers[groupId] ?? [...(testGroupMembers[groupId] ?? [])];
  store.groupMembers[groupId] = members.filter((id) => id !== userId);
  save(store);
}

export function getGroupsByMember(userId: string): Group[] {
  return getAllGroups().filter((g) => isMember(userId, g.id));
}

export function filterGroupsByLocation(groups: Group[], query: string): Group[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups.filter((g) => g.location?.toLowerCase().includes(q));
}
