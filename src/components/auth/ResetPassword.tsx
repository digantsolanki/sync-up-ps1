
"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState, FormEvent } from "react";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a correct email");
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsEmailSent(true);
        } catch (err) {
            setError("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    if (isEmailSent) {
        return (
            <div className="flex flex-col flex-1 lg:w-1/2 w-full">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Check Your Email
                        </h2>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            We have sent a password reset link to {email}. Please check your inbox and follow the instructions.
                        </p>
                        <Link
                            href="/signin"
                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/signin"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon />
                    Back to login
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Reset Your Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email address and we will send you a link to reset your password.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label>
                                    Email <span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    name="email"
                                    placeholder="info@gmail.com"
                                    type="email"
                                    defaultValue={email}
                                    onChange={handleEmailChange}
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-error-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/signin"
                                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}