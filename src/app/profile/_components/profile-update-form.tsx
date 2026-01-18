"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { NumberInput } from "@/components/ui/number-input"
import { useRouter } from "next/navigation"
import {authClient} from "@/lib/auth/auth-client";
import {toast} from "sonner";

const profileUpdateSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
})

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

export function ProfileUpdateForm({ user }: Readonly<{
    user: {
        email: string
        name: string
    }
}>) {
    const router = useRouter()
    const form = useForm<ProfileUpdateFormData>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: user,
    })

    const { isSubmitting } = form.formState

    async function handleProfileUpdate(data: ProfileUpdateFormData)
    {
        const promises = [
            authClient.updateUser({
                name: data.name,
            })
        ]

        if(data.email !== user.email){
            // TODO: implément & allow modify email in "auth.ts" to modify email
            //authClient.changeEmail({newEmail: data.email, callbackURL: "/profile"})
        }

        const res = await Promise.all(promises)
        const updateUserResult = res[0]
        const emailResult = res[1] ?? {error: false}

        if (updateUserResult.error) {
            toast.error(updateUserResult.error.message || "Failed to update profile")
        } else if (emailResult.error) {
            toast.error(emailResult.error.message || "Failed to change email")
        } else {
            if (data.email !== user.email) {
                toast.success("Verify your new email address to complete the change.")
            } else {
                toast.success("Profile updated successfully")
            }
            router.refresh()
        }


    }

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleProfileUpdate)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email - Unable to Update for now </FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}