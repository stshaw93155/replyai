import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Google,
        Resend,
        // For Phone OTP, we often use a custom flow or "Passwordless" with SMS.
        // For this boilerplate, we'll use a standard Password credential as a fallback 
        // or placeholder for "Phone + Code" if we were to implement custom logic.
        Password,
    ],
});
