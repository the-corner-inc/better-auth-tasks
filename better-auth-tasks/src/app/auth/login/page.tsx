"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {SignUpTab} from "@/app/auth/login/_components/sign-up-tab";
import {SignInTab} from "@/app/auth/login/_components/sign-in-tab";
import {Separator} from "@/components/ui/separator";
import {SocialAuthButtons} from "@/app/auth/login/_components/social-auth-buttons";
import {useEffect} from "react";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";

export default function LoginPage () {

    // Don't show the sign in / sign up page if the user is already authenticated
    const router = useRouter()
    useEffect(() => {
        authClient.getSession().then(session => {
            if (session.data != null)
                router.push("/")
        })
    })

    return (
        <Tabs defaultValue="signin" className="max-auto w-full my-6 px-4">
            <TabsList>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
                <Card>
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle>Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SignInTab/>
                    </CardContent>

                    <Separator />

                    <CardFooter className="grid grid-cols-2 gap-3">
                        <SocialAuthButtons />
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="signup">
                <Card>
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle>Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SignUpTab/>
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    )

}