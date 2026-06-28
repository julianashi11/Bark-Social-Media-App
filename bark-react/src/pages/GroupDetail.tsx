import { useParams, useNavigate } from 'react-router-dom';
import { getGroupById, getGroupMembers, isMember, joinGroup, leaveGroup } from '../groups';
import { getPostsByGroup } from '../posts';
import { getUserById } from '../users';
import { useCurrentUser } from '../context/CurrentUserContext';
import { useStoreVersion } from '../useStoreVersion';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  useStoreVersion();

  if (!groupId) return null;
  const group = getGroupById(groupId);
  if (!group) {
    return (
      <div>
        <p className="empty">Group not found.</p>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/groups')}>
          Back to Groups
        </button>
      </div>
    );
  }

  const members = getGroupMembers(groupId);
  const posts = getPostsByGroup(groupId);
  const joined = user ? isMember(user.id, groupId) : false;
  const isCreator = user?.id === group.creatorId;

  const handleJoinLeave = () => {
    if (!user) return;
    if (joined) leaveGroup(user.id, groupId);
    else joinGroup(user.id, groupId);
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-ghost back-btn"
        onClick={() => navigate('/groups')}
      >
        ← Groups
      </button>

      <div className="group-detail-header">
        <div className="group-detail-info">
          <h1>{group.name}</h1>
          <p className="group-detail-desc">{group.description}</p>
          <div className="group-card-meta">
            {group.location && (
              <span className="location-badge">📍 {group.location}</span>
            )}
            <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
          </div>
        </div>
        {user && !isCreator && (
          <button
            type="button"
            className={`btn ${joined ? 'btn-ghost' : 'btn-primary'}`}
            onClick={handleJoinLeave}
          >
            {joined ? 'Leave group' : 'Join group'}
          </button>
        )}
        {isCreator && <span className="group-card-owner">You created this</span>}
      </div>

      <div className="group-members-row">
        {members.map((uid) => {
          const u = getUserById(uid);
          return u ? (
            <span key={uid} title={u.displayName}>
              <Avatar user={u} size={32} />
            </span>
          ) : null;
        })}
      </div>

      {joined || isCreator ? (
        <PostComposer groupId={groupId} />
      ) : (
        <p className="empty">Join this group to post.</p>
      )}

      {posts.length === 0 ? (
        <p className="empty">No posts yet. Be the first!</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
