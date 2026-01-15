import { action } from "./_generated/server";
import { v } from "convex/values";

// Simple in-memory OTP storage (in production, use Convex tables)
const otpStore = new Map<string, { code: string; expires: number }>();

export const sendOTP = action({
    args: { phoneNumber: v.string() },
    handler: async (ctx, { phoneNumber }) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const authToken = process.env.TWILIO_AUTH_TOKEN!;
        const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;

        if (!accountSid || !authToken || !twilioNumber) {
            throw new Error("Twilio credentials not configured");
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiration
        otpStore.set(phoneNumber, {
            code: otp,
            expires: Date.now() + 5 * 60 * 1000,
        });

        // Send SMS via Twilio
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = btoa(`${accountSid}:${authToken}`);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                To: phoneNumber,
                From: twilioNumber,
                Body: `Your ReplyAI verification code is: ${otp}`,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to send SMS: ${error}`);
        }

        return { success: true };
    },
});

export const verifyOTP = action({
    args: { phoneNumber: v.string(), code: v.string() },
    handler: async (ctx, { phoneNumber, code }) => {
        const stored = otpStore.get(phoneNumber);

        if (!stored) {
            return { success: false, error: "No OTP found for this number" };
        }

        if (Date.now() > stored.expires) {
            otpStore.delete(phoneNumber);
            return { success: false, error: "OTP expired" };
        }

        if (stored.code !== code) {
            return { success: false, error: "Invalid OTP" };
        }

        // Clear OTP after successful verification
        otpStore.delete(phoneNumber);

        return { success: true };
    },
});
