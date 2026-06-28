import { Link } from 'react-router-dom';
import type { User } from '../types';
import { follow, unfollow, isFollowing } from '../follows';
import { useCurrentUser } from '../context/CurrentUserContext';
import { useStoreVersion } from '../useStoreVersion';
import Avatar from './Avatar';

type Props = { user: User };

export default function UserCard({ user }: Props) {
  useStoreVersion();
  const { user: me } = useCurrentUser();
  if (!me) return null;

  const isSelf = me.id === user.id;
  const following = isFollowing(me.id, user.id);

  const toggle = () => {
    if (following) unfollow(me.id, user.id);
    else follow(me.id, user.id);
  };

  return (
    <article className="user-card">
      <Link to={`/profile/${user.id}`} className="user-card-link">
        <Avatar user={user} size={44} />
        <div>
          <div className="user-name">{user.displayName}</div>
          <div className="user-handle">@{user.username}</div>
          <div className="user-bio">{user.bio}</div>
        </div>
      </Link>
      {!isSelf && (
        <button
          type="button"
          className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`}
          onClick={toggle}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      )}
    </article>
  );
}
