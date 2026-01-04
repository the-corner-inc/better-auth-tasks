'use client';
import {useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

// PAGE : The main content of a specific route or URL. It changes based on navigation.

export default function Home() {

    const [count, setCount] = useState(0);

    return (

        <div className="my-6 px-4 max-w-md mx-auto">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold">Welcome to Our App</h1>
                <Button asChild size="lg" onClick={() => setCount(c => c + 1)}>
                    <h1>COUNTER : {count}</h1>
                </Button>
                <Button asChild size="lg">
                    <Link href="/auth/login">Sign In / Sign Up</Link>
                </Button>
            </div>
        </div>
  );
}
