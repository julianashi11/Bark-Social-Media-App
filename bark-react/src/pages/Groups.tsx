import { useState } from 'react';
import type { FormEvent } from 'react';
import { getAllGroups, createGroup, getGroupsByMember, filterGroupsByLocation } from '../groups';
import { useCurrentUser } from '../context/CurrentUserContext';
import { useStoreVersion } from '../useStoreVersion';
import GroupCard from '../components/GroupCard';

type Tab = 'all' | 'mine';

export default function Groups() {
  const { user } = useCurrentUser();
  const [tab, setTab] = useState<Tab>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  useStoreVersion();

  const allGroups = getAllGroups();
  const myGroups = user ? getGroupsByMember(user.id) : [];
  const baseGroups = tab === 'all' ? allGroups : myGroups;
  const groups = filterGroupsByLocation(baseGroups, locationFilter);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    try {
      createGroup(user.id, name, description, newLocation);
      setName('');
      setDescription('');
      setNewLocation('');
      setShowForm(false);
      setTab('mine');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div>
      <div className="groups-header">
        <h1>Playdate Groups</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setShowForm((v) => !v); setError(null); }}
        >
          {showForm ? 'Cancel' : '+ Create Group'}
        </button>
      </div>

      {showForm && (
        <form className="composer group-form" onSubmit={handleCreate}>
          <input
            className="group-form-input"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          <textarea
            className="composer-input"
            placeholder="What's this group about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <input
            className="group-form-location"
            placeholder="📍 Location (e.g. Brooklyn, NY)"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            maxLength={80}
          />
          <div className="composer-actions">
            {error && <span className="composer-error">{error}</span>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim() || !description.trim()}
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="tab-bar">
        <button
          type="button"
          className={`tab-btn ${tab === 'all' ? 'tab-btn-active' : ''}`}
          onClick={() => setTab('all')}
        >
          All Groups
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'mine' ? 'tab-btn-active' : ''}`}
          onClick={() => setTab('mine')}
        >
          My Groups
        </button>
      </div>

      <div className="location-filter-row">
        <input
          type="text"
          className="location-filter-input"
          placeholder="📍 Filter by location…"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        {locationFilter && (
          <button
            type="button"
            className="location-filter-clear"
            onClick={() => setLocationFilter('')}
          >
            ✕
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="empty">
          {locationFilter
            ? `No groups found in "${locationFilter}".`
            : tab === 'mine'
            ? "You haven't joined any groups yet."
            : 'No groups yet.'}
        </p>
      ) : (
        <ul className="group-list">
          {groups.map((g) => (
            <li key={g.id}>
              <GroupCard group={g} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
