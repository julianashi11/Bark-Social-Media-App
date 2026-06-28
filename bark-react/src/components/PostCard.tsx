import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { getUserById } from '../users';
import Avatar from './Avatar';

type Props = { post: Post };

export default function PostCard({ post }: Props) {
  const author = getUserById(post.authorId);
  if (!author) return null;

  const when = new Date(post.timestamp).toLocaleString();

  return (
    <article className="post-card">
      <Link to={`/profile/${author.id}`} className="post-author">
        <Avatar user={author} size={36} />
        <div className="post-author-meta">
          <div className="post-author-name">{author.displayName}</div>
          <div className="post-author-handle">@{author.username}</div>
        </div>
      </Link>
      {post.content && <p className="post-content">{post.content}</p>}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" className="post-image" />
      )}
      <div className="post-when">{when}</div>
    </article>
  );
}
