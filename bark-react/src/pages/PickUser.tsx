import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../context/CurrentUserContext';
import { getAllUsers } from '../users';
import Avatar from '../components/Avatar';

export default function PickUser() {
  const { setUser } = useCurrentUser();
  const navigate = useNavigate();
  const users = getAllUsers();

  const pick = (userId: string) => {
    setUser(userId);
    navigate('/feed');
  };

  return (
    <div className="pick-user">
      <header className="pick-user-hero">
        <h1>🐾 Bark</h1>
        <p>The social network for dogs. Pick a pup to get started.</p>
      </header>
      <div className="pick-user-grid">
        {users.map((u) => (
          <button
            type="button"
            key={u.id}
            className="user-tile"
            onClick={() => pick(u.id)}
          >
            <Avatar user={u} size={64} />
            <div className="user-name">{u.displayName}</div>
            <div className="user-handle">@{u.username}</div>
            <div className="user-bio">{u.bio}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
