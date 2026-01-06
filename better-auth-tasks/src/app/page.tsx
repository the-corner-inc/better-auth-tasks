'use client';
import {useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth/auth-client";
import {BetterAuthActionButton} from "@/components/auth/better-auth-action-button";

// PAGE : The main content of a specific route or URL. It changes based on navigation.

export default function Home() {

    const {data: session, isPending: loading} = authClient.useSession()
    const [count, setCount] = useState(0);

    if(loading){
        return <div>Loading...</div>;
    }

    return (

        <div className="my-6 px-4 max-w-md mx-auto">
            <div className="text-center space-y-6">
                {session == null ? (
                    <>
                        <h1 className="text-3xl font-bold">Welcome to Our App</h1>
                        <Button asChild size="lg" onClick={() => setCount(c => c + 1)}>
                            <h1>COUNTER : {count}</h1>
                        </Button>
                        <Button asChild size="lg">
                            <Link href="/auth/login">Sign In / Sign Up</Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
                        {/* TODO: Add Loading States */}
                        <BetterAuthActionButton
                            size="lg"
                            variant="destructive"
                            successMessage="Signed out successfully"
                            action={() => authClient.signOut()}
                        >
                            Sign Out
                        </BetterAuthActionButton>
                    </>
                )}
            </div>
        </div>
  );
}
