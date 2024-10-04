
import { fecthUsers, fetchUser, getActivity } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {

    const user = { id: "1" };
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const activity = await getActivity(userInfo._id);


    // console.log(activity[0]._id)
    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flec flex-col gap-5">

                {activity.length > 0 ? (
                    <>
                        {
                            activity.map((act: any) => (
                                <Link key={act._id}
                                    href={`/thread/${act.parentId}`}>

                                    <article className="activity-card mt-3">

                                        <Image
                                            src='/assets/profile.svg' // 
                                            alt="profile_photo"
                                            width={20}
                                            height={20}
                                            className="rounded-full object-cover"
                                        />

                                        <p className="!text-small-regular text-light-1">
                                            <span className="mr-1 text-primary-500">
                                                {act.author.name}
                                            </span> {" "}
                                            replied to your thread
                                        </p>

                                    </article>
                                </Link>
                            ))
                        }
                    </>
                ) : (<p className="no-result">No activity yet</p>)}


            </section>
        </section>
    )
}


export default Page;