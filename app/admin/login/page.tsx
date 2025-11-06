"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Shield, Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"

function AdminLoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    // Get callbackUrl from query params
    const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password. Please try again.")
            } else if (result?.ok) {
                // Redirect to callbackUrl or dashboard on successful login
                // Ensure callbackUrl is safe (not pointing back to login)
                const redirectUrl = callbackUrl && !callbackUrl.includes("/admin/login")
                    ? callbackUrl
                    : "/admin/dashboard"
                router.push(redirectUrl)
                router.refresh()
            }
        } catch (error) {
            setError("An error occurred during login. Please try again.")
            console.error("Login error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <MainLayout>
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <Shield className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access the admin panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/admin/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <Link href="/login" className="text-primary hover:underline">
                                Voter login instead?
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}

export default function AdminLogin() {
    return (
        <Suspense fallback={
            <MainLayout>
                <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-center mb-4">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                            <CardDescription className="text-center">
                                Loading...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </MainLayout>
        }>
            <AdminLoginForm />
        </Suspense>
    )
}

