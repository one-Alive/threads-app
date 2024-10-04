import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
async function Page() {
    const user = { id: '1' }
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userInfo._id.toString()} />
        </>

    )

}

export default Page;