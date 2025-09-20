"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Vote,
    Users,
    UserCheck,
    BarChart3,
    Settings,
    User,
    History,
    X
} from "lucide-react"

interface SidebarProps {
    userType: "admin" | "voter"
    onClose?: () => void
}

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Elections",
        href: "/admin/elections",
        icon: Vote
    },
    {
        title: "Candidates",
        href: "/admin/candidates",
        icon: Users
    },
    {
        title: "Voters",
        href: "/admin/voters",
        icon: UserCheck
    },
    {
        title: "Results",
        href: "/admin/results",
        icon: BarChart3
    }
]

const voterNavItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Vote",
        href: "/vote",
        icon: Vote
    },
    {
        title: "History",
        href: "/history",
        icon: History
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User
    }
]

export function Sidebar({ userType, onClose }: SidebarProps) {
    const pathname = usePathname()
    const navItems = userType === "admin" ? adminNavItems : voterNavItems

    return (
        <div className="flex h-full w-64 flex-col bg-background">
            {/* Mobile close button */}
            <div className="flex items-center justify-between p-4 lg:hidden">
                <h2 className="text-lg font-semibold tracking-tight">
                    {userType === "admin" ? "Admin Panel" : "Voter Panel"}
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:block px-3 py-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {userType === "admin" ? "Admin Panel" : "Voter Panel"}
                </h2>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose} // Close mobile sidebar when navigating
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

