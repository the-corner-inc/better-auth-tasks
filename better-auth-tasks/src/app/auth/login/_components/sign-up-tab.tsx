"use client"

import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/ui/loading-swap";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


// Define the data to be collected in the Sign Up form
const signUpSchema = z.object({
        name: z.string().min(2),
        email: z.email().min(1),
        password: z.string().min(6),
})

type SignUpForm = z.infer<typeof signUpSchema>      // Data type for Sign Up form data

// Render
export function SignUpTab() {
    const router = useRouter()

    // Initialize the form with validation schema and default values
    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    // Handle form submission and call the sign-up method from the auth client API
    async function handleSignUp(data: SignUpForm) {
        const res = await authClient.signUp.email(
            { ...data, callbackURL: "/"},
            {
                onError: (error) => {
                    toast.error(error.error.message || "Failed to sign up" )
                },
                onSuccess: () => {
                    toast.success("Sign up successful! Please check your email to verify your account.")
                    router.push("/")
                }
            })
    }

    // Track form submission state and show loading state on the submit button
    const {isSubmitting} = form.formState


    return <Form {...form}>
        <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSignUp)}
        >
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormItem>Name</FormItem>
                        <FormControl>
                            <Input type="name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormItem>Email</FormItem>
                        <FormControl>
                            <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                        <FormItem>Password</FormItem>
                        <FormControl>
                            <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>
                    Sign Up
                </LoadingSwap>
            </Button>

        </form>
    </Form>
}