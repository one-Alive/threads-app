import { fetchPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCards";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = { id: "1" };
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(1, 30);


  return (

    <>
      <h1 className="head-text text-left">Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={'1'}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
