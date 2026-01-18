'use client';

import {useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth/auth-client";
import {BetterAuthActionButton} from "@/components/auth/better-auth-action-button";

/**
 * Home page - Entry point of the application
 */

export default function Home() {

    const {data: session, isPending: loading} = authClient.useSession()
    const [count, setCount] = useState(0);

    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <div className="my-6 px-4 max-w-md mx-auto">
            <div className="text-center space-y-6">

                {/* ======================================================
                UI Branching:
                - session == null : unauthenticated visitor
                - session != null : authenticated user
               ====================================================== */}
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
                        <h1 className="text-3xl font-bold">
                            Welcome {session.user.name}!
                        </h1>
                        <div className="flex gap-4 justify-center">

                            <Button asChild size="lg">
                                <Link href="/profile">Profile</Link>
                            </Button>

                            <Button asChild size="lg">
                                <Link href="/tasks">Tasks</Link>
                            </Button>

                            <BetterAuthActionButton
                                size="lg"
                                variant="destructive"
                                successMessage="Signed out successfully"
                                action={() => authClient.signOut()}
                            >
                                Sign Out
                            </BetterAuthActionButton>
                        </div>

                    </>
                )}
            </div>
        </div>
  );
}
