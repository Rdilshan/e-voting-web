import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Shield, Users, Vote } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-6">
            <Vote className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            E-Voting Management System
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Admin-controlled voting system where administrators manage elections and authorized users can vote.
          </p>
        </div>

        {/* Access Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Administrator Access</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Create voting processes, manage candidates and voters, view results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Vote className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Voter Access</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Vote in elections you&apos;ve been authorized to participate in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/vote">Access Voting</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">System Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Admin Controlled</CardTitle>
                <CardDescription className="text-sm">
                  Only administrators can create elections and manage the voting process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Authorized Voting</CardTitle>
                <CardDescription className="text-sm">
                  Only users added by admin can participate in voting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Real-time Results</CardTitle>
                <CardDescription className="text-sm">
                  View voting results and analytics in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
