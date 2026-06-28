import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../context/CurrentUserContext';
import { reset } from '../storage';

export default function NavBar() {
  const { user, signOut } = useCurrentUser();
  const navigate = useNavigate();

  const handleReset = () => {
    const ok = window.confirm(
      'Reset Bark? This clears your follows, your posts, AND your current login. You will pick a user again afterwards.',
    );
    if (!ok) return;
    reset();
    signOut();
    navigate('/pick-user');
  };

  return (
    <header className="navbar">
      <Link to="/feed" className="navbar-brand">
        🐾 Bark
      </Link>
      <nav className="navbar-links">
        <Link to="/feed">Feed</Link>
        <Link to="/find">Find users</Link>
        <Link to="/groups">Groups</Link>
        {user && <Link to={`/profile/${user.id}`}>My profile</Link>}
        <button type="button" className="navbar-reset" onClick={handleReset}>
          Reset Bark
        </button>
      </nav>
    </header>
  );
}
