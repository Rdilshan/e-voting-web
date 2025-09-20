"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vote, User, LogOut } from "lucide-react"

interface HeaderProps {
    userType?: "admin" | "voter" | null
    userName?: string
}

export function Header({ userType, userName }: HeaderProps) {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Vote className="h-6 w-6" />
                        <span className="font-bold">E-Voting System</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-6">
                        {userType === "admin" && (
                            <>
                                <Link
                                    href="/admin/dashboard"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/elections"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Elections
                                </Link>
                                <Link
                                    href="/admin/candidates"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Candidates
                                </Link>
                                <Link
                                    href="/admin/voters"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Voters
                                </Link>
                                <Link
                                    href="/admin/results"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Results
                                </Link>
                            </>
                        )}

                        {userType === "voter" && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/vote"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Vote
                                </Link>
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Profile
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center space-x-2">
                        {userName ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm font-medium">{userName}</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

