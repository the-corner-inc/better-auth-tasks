"use client"

import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Button} from "@/components/ui/button";
import {LoadingSwap} from "@/components/ui/loading-swap";
import {authClient} from "@/lib/auth/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


// Define the data to be collected in the Sign In form
const signInSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(6),
})

type SignUpForm = z.infer<typeof signInSchema>      // Data type for Sign In form data

// Render
export function SignInTab() {

    const router = useRouter()

    // Initialize the form with validation schema and default values
    const form = useForm<SignUpForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    // Handle form submission and call the sign-up method from the auth client API
    async function handleSignIn(data: SignUpForm) {
        const res = await authClient.signIn.email(
            { ...data, callbackURL: "/"},
            {
                onError: (error) => {
                    toast.error(error.error.message || "Failed to sign in" )
                },
                onSuccess: () => {
                    toast.success("Sign in successful! Please check your email to verify your account.")
                    router.push("/")
                }
            })
    }

    // Track form submission state and show loading state on the submit button
    const {isSubmitting} = form.formState


    return (
        // Form component wrapping the sign-up form. "...form" spreads the form methods and state into the Form component.
        // The components that create the form fields are:
        // - FormField: Connects each field to the form state and validation.
        // - FormItem: Wrapper for each form field, including label and message. Is a layout component for spacing and structure.
        // - FormControl: Wraps the actual input component. Connects the input to the form state.
        // - - Input / PasswordInput: The actual input fields for user data entry.
        // - FormMessage: Displays validation error messages for each field.
        // The main components are NAME, EMAIL, PASSWORD, and SUBMIT BUTTON.

        <Form {...form}>
            <form                                                  // HTML form element that handles submission
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSignIn)}         // On submission, validate and call handleSignUp function
            >

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
                        Sign In
                    </LoadingSwap>
                </Button>

            </form>
        </Form>
    )

}