import { useState } from 'react';
import { searchUsers } from '../users';
import UserCard from '../components/UserCard';

export default function FindUsers() {
  const [query, setQuery] = useState('');
  const results = searchUsers(query);

  return (
    <div className="find-users">
      <h1>Find users</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search by username or display name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {query.trim().length === 0 ? (
        <p className="empty">Type to search.</p>
      ) : results.length === 0 ? (
        <p className="empty">No users matched.</p>
      ) : (
        <ul className="user-list">
          {results.map((u) => (
            <li key={u.id}>
              <UserCard user={u} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
