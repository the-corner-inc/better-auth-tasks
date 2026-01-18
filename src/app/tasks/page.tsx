import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getTasks} from "@/lib/bll/tasks/tasks.actions";
import Link from "next/link";
import {ArrowLeft, FlaskConical} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TaskCard} from "@/app/tasks/_components/task-card";
import {NewTaskCard} from "@/app/tasks/_components/new-task-card";

/**
 * Tasks page - Server Component
 *
 * Responsibility:
 * - Server-side guard if not logged in
 * - Load the tasks list
 *
 */

export default async function TasksPage() {

    // ToDo : Why do we not make it a client-side page and use authClient ?
    const session= await auth.api.getSession({ headers: await headers() })

    if (!session)
        return redirect("/auth/login")

    // Get all Tasks from the user
    const result = await getTasks()
    const tasks = result.tasks

    return (
        <div className="max-w-4xl mx-auto my-6 px-4">
            {/* ======================================================
                Header section
                ====================================================== */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4 mr-2"/>
                    Back to Home
                </Link>

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        My tasks
                    </h1>
                    <div className="flex gap-2">
                        <Link href="/tasks/test" >
                            <Button variant="outline" size="sm">
                                <FlaskConical className="size-4 mr-2"/>
                                Test CRUD
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ======================================================
                Content section
                - NewTaskCard: create task UX
                - TaskCard*: list of tasks + todos interactions
                ====================================================== */}
            <div className="grid gap-4 md:grid-cols-2">
                <NewTaskCard />
                {
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                }
            </div>
        </div>
    )
}