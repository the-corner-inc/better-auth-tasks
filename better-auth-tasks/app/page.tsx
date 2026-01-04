'use client';
import Image from "next/image";
import {useState} from "react";

// PAGE : The main content of a specific route or URL. It changes based on navigation.

export default function Home() {

    const [count, setCount] = useState(0);

    return (

        <div className="my-6 px-4 max-w-md mx-auto">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold">Welcome to Our App</h1>
                <h1>COUNTER : {count}</h1>
                <button onClick={() => setCount(c => c + 1)}
                        className="dark:invert">
                    +1
                </button>
                <link href="/auth/login">Sign In / Sign Up</link>
            </div>
        </div>
  );
}
