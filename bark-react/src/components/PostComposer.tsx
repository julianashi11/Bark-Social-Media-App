import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useCurrentUser } from '../context/CurrentUserContext';
import { createPost } from '../posts';

type Props = { groupId?: string };

export default function PostComposer({ groupId }: Props = {}) {
  const { user } = useCurrentUser();
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = () => setImageUrl(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      createPost(user.id, text, imageUrl ?? undefined, groupId);
      setText('');
      setImageUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const firstName = user.displayName.split(' ')[0];
  const canPost = text.trim().length > 0 || imageUrl !== null;

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        className="composer-input"
        placeholder={`What's on your mind, ${firstName}?`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      {imageUrl && (
        <div className="composer-image-preview">
          <img src={imageUrl} alt="preview" className="composer-preview-img" />
          <button
            type="button"
            className="composer-image-remove"
            onClick={removeImage}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="composer-actions">
        {error && <span className="composer-error">{error}</span>}
        <button
          type="button"
          className="composer-image-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Add photo"
        >
          📷
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImagePick}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </form>
  );
}
