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

const profileUpdateSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    numbersOfRepos: z.number().int(),
})

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

export function ProfileUpdateForm({ user }: Readonly<{
    user: {
        email: string
        name: string
        numbersOfRepos: number
    }
}>) {
    const router = useRouter()
    const form = useForm<ProfileUpdateFormData>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: user,
    })

    const { isSubmitting } = form.formState

    async function handleProfileUpdate(data: ProfileUpdateFormData) {
        // TODO: implémenter
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="numbersOfRepos"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Numbers of Repos</FormLabel>
                            <FormControl>
                                <NumberInput {...field} />
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