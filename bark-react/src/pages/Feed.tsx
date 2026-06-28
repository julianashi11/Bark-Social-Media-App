import { useStoreVersion } from '../useStoreVersion';
import { getAllPosts } from '../posts';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';

export default function Feed() {
  useStoreVersion();
  const posts = getAllPosts();

  return (
    <div className="feed">
      <h1>Feed</h1>
      <PostComposer />
      {posts.length === 0 ? (
        <p className="empty">No posts yet. Be the first.</p>
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
