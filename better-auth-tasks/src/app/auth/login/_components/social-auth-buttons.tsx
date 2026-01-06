"use client"

import {SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS} from "@/lib/o-auth-providers";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {BetterAuthActionButton} from "@/components/auth/better-auth-action-button";

export function SocialAuthButtons() {

    return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon

        // ToDo : Handle loading & errors states
        return <BetterAuthActionButton
            variant="outline"
            key={provider}
            action={() => {
                return authClient.signIn.social({
                            provider,
                            callbackURL: "/"
                })
        }}>
            <Icon />
            {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        </BetterAuthActionButton>
    })
}