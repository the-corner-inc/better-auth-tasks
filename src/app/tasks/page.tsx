import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getTasks} from "@/lib/business_layer/tasks.service";
import Link from "next/link";
import {ArrowLeft, FlaskConical, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TaskCard} from "@/app/tasks/_components/task-card";

export default async function TasksPage() {

    const session= await auth.api.getSession({ headers: await headers() })

    if (!session)
        return redirect("/auth/login")

    // Get all Tasks from the user
    const result = await getTasks()
    const tasks = result.tasks

    return (
        <div className="max-w-4xl mx-auto my-6 px-4">
            {/* Centered Container */}
            {/* Header */}
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
                        <Button>
                            <Plus className="size-4 mr-2"/>
                            Nouvelle Task
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {tasks.length === 0 ?
            /* If there is no tasks to show */
            (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        No tasks found at the moment.
                    </p>
                    <Link href="/tasks/test">
                        <Button variant="outline">
                            <FlaskConical className="size-4 mr-2"/>
                            Go to page to seed test data
                        </Button>
                    </Link>
                </div>

            ):
            /* If there are tasks to show */
            (
                <div className="grid gap-4 md:grid-cols-2">
                    {
                        tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    }
                </div>

            )}
        </div>
    )
}