"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Vote, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmail() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error")
                return
            }

            try {
                // TODO: Implement email verification logic
                console.log("Verifying token:", token)

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000))
                setStatus("success")
            } catch (error) {
                console.error("Verification failed:", error)
                setStatus("error")
            }
        }

        verifyEmail()
    }, [token])

    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl text-center">Verifying Your Email</CardTitle>
                        <CardDescription className="text-center">
                            Please wait while we verify your email address...
                        </CardDescription>
                    </>
                )

            case "success":
                return (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl text-center">Email Verified!</CardTitle>
                        <CardDescription className="text-center">
                            Your email has been successfully verified. You can now sign in to your account.
                        </CardDescription>
                    </>
                )

            case "error":
                return (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl text-center">Verification Failed</CardTitle>
                        <CardDescription className="text-center">
                            The verification link is invalid or has expired. Please try registering again.
                        </CardDescription>
                    </>
                )
        }
    }

    return (
        <MainLayout>
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        {renderContent()}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {status === "success" && (
                                <Button className="w-full" asChild>
                                    <Link href="/login">
                                        Sign In Now
                                    </Link>
                                </Button>
                            )}

                            {status === "error" && (
                                <div className="space-y-2">
                                    <Button className="w-full" asChild>
                                        <Link href="/register">
                                            Register Again
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/login">
                                            Try Signing In
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            <Button variant="ghost" className="w-full" asChild>
                                <Link href="/">
                                    Back to Home
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

