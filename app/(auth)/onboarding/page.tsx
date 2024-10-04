import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {

    const userInfo = {};
    const userData = {
        id: "1",
        objectId: "objectId",
        username: "username",
        name: "Name",
        bio: "bio",
        image: "imageURL"
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">

            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-1">
                Complete Your profile now to use threads
            </p>
            <section className="mt-9 bg-dark-2 p-10">

                <AccountProfile user={userData} btnTitle="Continue"/>
            </section>

        </main>
    )
}

export default Page;