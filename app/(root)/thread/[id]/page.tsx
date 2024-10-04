import ThreadCard from "@/components/cards/ThreadCards";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {

    if (!params.id) return null;

    const user = { id: '1', imageUrl: '/assets/profile.svg' };
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id);
    return (<section className="relative">

        <div>
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={'1'}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}s
                createdAt={thread.createdAt}
                comments={thread.children}
            />
        </div>

        <div className="mt-7">
            <Comment
                threadId={thread.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}

            />
        </div>


        <div className="mt-10">

            {

                thread.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={'1'}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))
            }
        </div>

    </section>
    );

}



export default Page;
