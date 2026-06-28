import { useNavigate } from 'react-router-dom';
import type { Group } from '../types';
import { isMember, joinGroup, leaveGroup, getGroupMembers } from '../groups';
import { useCurrentUser } from '../context/CurrentUserContext';
import { useStoreVersion } from '../useStoreVersion';

type Props = { group: Group };

export default function GroupCard({ group }: Props) {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  useStoreVersion();

  const memberCount = getGroupMembers(group.id).length;
  const joined = user ? isMember(user.id, group.id) : false;
  const isCreator = user?.id === group.creatorId;

  const handleJoinLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (joined) {
      leaveGroup(user.id, group.id);
    } else {
      joinGroup(user.id, group.id);
    }
  };

  return (
    <div className="group-card" onClick={() => navigate(`/groups/${group.id}`)}>
      <div className="group-card-body">
        <div className="group-card-name">{group.name}</div>
        <div className="group-card-desc">{group.description}</div>
        <div className="group-card-meta">
          {group.location && (
            <span className="location-badge">📍 {group.location}</span>
          )}
          <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
        </div>
      </div>
      {user && !isCreator && (
        <button
          type="button"
          className={`btn ${joined ? 'btn-ghost' : 'btn-primary'}`}
          onClick={handleJoinLeave}
        >
          {joined ? 'Leave' : 'Join'}
        </button>
      )}
      {user && isCreator && (
        <span className="group-card-owner">Owner</span>
      )}
    </div>
  );
}
