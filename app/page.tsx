import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Vote, Shield, Users, BarChart3, Lock, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Vote className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Secure Digital Voting System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of democracy with our blockchain-powered e-voting platform.
            Transparent, secure, and accessible voting for everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                End-to-end encryption ensures your vote remains private and secure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Transparent</CardTitle>
              <CardDescription>
                Blockchain technology provides complete transparency and auditability
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Accessible</CardTitle>
              <CardDescription>
                Vote from anywhere, anytime with our user-friendly interface
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Vote className="h-12 w-12 text-primary mb-4" />
              <CardTitle>For Voters</CardTitle>
              <CardDescription>
                Participate in elections, view results, and manage your voting profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/login">Voter Login</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Register to Vote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>For Administrators</CardTitle>
              <CardDescription>
                Manage elections, candidates, voters, and monitor results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted by Democracy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Secure Votes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Transparency</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
