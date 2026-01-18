import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Key, LinkIcon, Loader2Icon, Shield, Trash2, User} from "lucide-react";
import Image from "next/image"
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import {ProfileUpdateForm} from "@/app/profile/_components/profile-update-form";
import {ReactNode, Suspense} from "react";

/**
 * Profile page - Server Component
 *
 * Responsibilities:
 * - Server-side guard if not logged in
 * - Load the current user from the session information
 */

export default async function ProfilePage() {

    const session= await auth.api.getSession({ headers: await headers() })
    if (session == null)
        return redirect("/auth/login")

    return (
        <div className="max-w-4xl mx-auto my-6 px-4">
            {/* ======================================================
                Header section
                ====================================================== */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center mb-6">
                    <ArrowLeft className="size-4 mr-2" />
                        Back to Home
                </Link>
                <div className="flex items-center space-x-4">

                    <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {
                            session.user.image ?
                            (
                                <Image
                                    width={64}
                                    height={64}
                                    src={session.user.image}
                                    alt="User Avatar"
                                    className="object-cover"
                                />
                            ) : (
                                <User className="size-8 text-muted text-foreground"/>
                            )
                        }
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex gap-1 justify-between items-start">
                            <h1 className="text-3xl font-bold">
                                {session.user.name || "User Profile"}
                            </h1>
                            <Badge className="text-muted-foreground">
                                {session.user.email}
                            </Badge>
                        </div>
                    </div>

                </div>
            </div>


            {/* ======================================================
                Tabs
                ====================================================== */}
            <Tabs>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="profile">
                        <User />
                        <span className="max-sm:hidden">Profile</span>
                    </TabsTrigger>
                </TabsList>



                <TabsContent value="profile">
                    <Card>
                        <CardContent>
                            <ProfileUpdateForm user={session.user} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}



// Either render the Tab given in props, or show a loading icon
function LoadingSuspense({ children }: {children: ReactNode})
{
    return (
        <Suspense fallback={<Loader2Icon className="size-20 animate-spin"/>}>
            {children}
        </Suspense>
    )
}