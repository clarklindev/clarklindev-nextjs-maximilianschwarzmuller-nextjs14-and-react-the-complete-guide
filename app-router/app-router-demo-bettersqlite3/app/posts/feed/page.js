import Posts from "@/components/posts/posts";
import { getPosts } from "@/lib/posts/actions";

export default async function FeedPage() {
  const posts = await getPosts();
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
