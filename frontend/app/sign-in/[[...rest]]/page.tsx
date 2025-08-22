"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/"
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isLoaded) return
    setLoading(true)
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/")
        return // Do not setLoading(false) after successful sign-in
      } else {
        setError("Unexpected sign-in status. Please try again.")
        setLoading(false)
      }
    } catch (err: unknown) {
      function isClerkError(e: unknown): e is { errors: { message: string }[] } {
        return (
          typeof e === "object" &&
          e !== null &&
          "errors" in e &&
          Array.isArray((e as { errors: unknown }).errors)
        )
      }
      if (isClerkError(err)) {
        setError(err.errors[0]?.message || "Sign-in failed. Please try again.")
      } else {
        setError("Sign-in failed. Please try again.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Sign in to your account</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/sign-in#forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading || !isLoaded}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="after:border-border relative text-center text-sm my-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={loading}
                    onClick={handleGoogleSignIn}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                      </svg>
                    </span>
                    Continue with Google
                  </Button>
                </div>
              </div>
              {/* <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
