"use client"

import { useState } from "react"
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
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <Header
                userType={userType}
                userName={userName}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                showMenuButton={!!(showSidebar && userType)}
            />
            <div className="flex">
                {showSidebar && userType && (
                    <>
                        {/* Mobile sidebar overlay */}
                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Sidebar */}
                        <aside className={`
                            fixed lg:static inset-y-0 left-0 z-50 w-64 
                            transform transition-transform duration-200 ease-in-out
                            border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        `}>
                            <Sidebar userType={userType} onClose={() => setSidebarOpen(false)} />
                        </aside>
                    </>
                )}
                <main className={`
                    flex-1 p-4 sm:p-6 transition-all duration-200
                    ${showSidebar && userType ? 'lg:ml-0' : ''}
                `}>
                    {children}
                </main>
            </div>
        </div>
    )
}

