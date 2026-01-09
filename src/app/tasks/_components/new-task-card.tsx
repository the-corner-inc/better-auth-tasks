"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createTask} from "@/lib/bll/tasks.service";
import {Card, CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import {Plus} from "lucide-react";


export function NewTaskCard() {

    // Hooks
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Functions
    const handleCreate = async () => {
        if (title.trim()) {
            await createTask(title)
            setTitle("")
            setIsEditing(true)
            router.refresh()
        }
    }

    // Render
    return(
        <Card
            className={`border-dashed cursor-pointer transition-colors 
                ${isEditing 
                    ? "border-primary" 
                    : "hover:border-primary/50"}`}
            onClick={() => !isEditing && setIsEditing(true)}
        >
            <CardContent className="flex items-center justify-center min-h-[120px] p-4">
                {isEditing ? (
                    <Input
                        placeholder="Task title... (Tap enter to create)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={ (e) => {
                            if (e.key === "Enter") handleCreate()
                            if (e.key === "Escape") {
                                setIsEditing(false)
                                setTitle("")
                            }
                        }}
                        onBlur={() => {
                            if (!title.trim()) {
                                setIsEditing(false)
                            }
                        }}
                        autoFocus
                        className="text-center"
                    />
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Plus className="h-8 w-8 mb-2"/>
                        <span>New Task</span>
                    </div>
                )}
            </CardContent>

        </Card>
    )
}