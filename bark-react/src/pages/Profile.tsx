import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useStoreVersion } from '../useStoreVersion';
import { useCurrentUser } from '../context/CurrentUserContext';
import { getUserById, getUserLocation, setUserLocation } from '../users';
import { getPostsByAuthor } from '../posts';
import { isFollowing, follow, unfollow, getFollowing } from '../follows';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';

export default function Profile() {
  useStoreVersion();
  const { userId } = useParams();
  const { user: me } = useCurrentUser();
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationDraft, setLocationDraft] = useState('');

  if (!userId || !me) return <Navigate to="/feed" replace />;

  const user = getUserById(userId);
  if (!user) {
    return (
      <div className="profile">
        <h1>User not found</h1>
        <Link to="/feed">Back to feed</Link>
      </div>
    );
  }

  const posts = getPostsByAuthor(user.id);
  const followingIds = getFollowing(user.id);
  const isSelf = user.id === me.id;
  const youFollow = isFollowing(me.id, user.id);
  const location = getUserLocation(user.id);

  const toggle = () => {
    if (youFollow) unfollow(me.id, user.id);
    else follow(me.id, user.id);
  };

  const startEditing = () => {
    setLocationDraft(location);
    setEditingLocation(true);
  };

  const saveLocation = () => {
    setUserLocation(user.id, locationDraft);
    setEditingLocation(false);
  };

  return (
    <div className="profile">
      <header className="profile-header">
        <Avatar user={user} size={72} />
        <div className="profile-meta">
          <h1>{user.displayName}</h1>
          <div className="profile-handle">@{user.username}</div>
          <p className="profile-bio">{user.bio}</p>

          <div className="profile-location">
            {editingLocation ? (
              <div className="location-edit-row">
                <input
                  className="location-edit-input"
                  value={locationDraft}
                  onChange={(e) => setLocationDraft(e.target.value)}
                  placeholder="e.g. Brooklyn, NY"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') saveLocation(); if (e.key === 'Escape') setEditingLocation(false); }}
                />
                <button type="button" className="btn btn-primary location-save-btn" onClick={saveLocation}>Save</button>
                <button type="button" className="btn btn-ghost location-save-btn" onClick={() => setEditingLocation(false)}>Cancel</button>
              </div>
            ) : (
              <span className="location-display">
                {location ? (
                  <span className="location-badge">📍 {location}</span>
                ) : isSelf ? (
                  <span className="location-empty">No location set</span>
                ) : null}
                {isSelf && (
                  <button type="button" className="location-edit-btn" onClick={startEditing}>
                    {location ? 'Edit' : '+ Add location'}
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="profile-stats">
            Following <strong>{followingIds.length}</strong>
            &nbsp;·&nbsp; Posts <strong>{posts.length}</strong>
          </div>
        </div>
        {!isSelf && (
          <button
            type="button"
            className={`btn ${youFollow ? 'btn-ghost' : 'btn-primary'}`}
            onClick={toggle}
          >
            {youFollow ? 'Following' : 'Follow'}
          </button>
        )}
      </header>

      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p className="empty">No posts yet.</p>
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
