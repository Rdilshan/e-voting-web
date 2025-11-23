"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Vote, User, LogOut, Menu } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

interface HeaderProps {
    userType?: "admin" | "voter" | null
    userName?: string
    onMenuClick?: () => void
    showMenuButton?: boolean
}

export function Header({ userType, userName, onMenuClick, showMenuButton }: HeaderProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logoutAction();
            router.push("/");
        } catch {
            console.error("Error logging out");
        }
    }


    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                <div className="flex items-center space-x-4">
                    {showMenuButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={onMenuClick}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    <Link href="/" className="flex items-center space-x-2">
                        <Vote className="h-6 w-6" />
                        <span className="font-bold text-sm sm:text-base">E-Voting System</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2">
                    {/* Desktop Navigation - Hidden on mobile when sidebar is available */}
                    <nav className={`hidden items-center space-x-4 ${showMenuButton ? 'lg:flex' : 'md:flex'}`}>
                        {userType === "admin" && (
                            <>

                            </>
                        )}

                        {userType === "voter" && (
                            <>
                                <Link
                                    href="/vote"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Vote
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center space-x-2">
                        {userName ? (
                            <>
                                <div className="hidden sm:flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm font-medium">{userName}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:ml-2 sm:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild>
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

