import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "@/drizzle/db";
import {tasks} from "@/drizzle/schemas/task-schema";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {authClient} from "@/lib/auth/auth-client";

export default async function TasksPage() {

    const session= await auth.api.getSession({ headers: await headers() })

    if (!session) redirect("/auth/login")

   /**/

    return null
}