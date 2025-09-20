"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
    children: React.ReactNode
    userType?: "admin" | "voter" | null
    userName?: string
    showSidebar?: boolean
}

export function MainLayout({
    children,
    userType,
    userName,
    showSidebar = false
}: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Header userType={userType} userName={userName} />
            <div className="flex">
                {showSidebar && userType && (
                    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <Sidebar userType={userType} />
                    </aside>
                )}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

