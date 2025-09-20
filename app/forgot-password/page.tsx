"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Vote, ArrowLeft } from "lucide-react"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement forgot password logic
        console.log("Forgot password for:", email)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <MainLayout>
                <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-center mb-4">
                                <Vote className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
                            <CardDescription className="text-center">
                                We&apos;ve sent password reset instructions to {email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground text-center">
                                    Didn&apos;t receive the email? Check your spam folder or try again.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Try Again
                                </Button>
                                <Button variant="ghost" className="w-full" asChild>
                                    <Link href="/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <Vote className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we&apos;ll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Reset Link
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <Button variant="ghost" asChild>
                                <Link href="/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

