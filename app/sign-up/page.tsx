"use client"
import { Button } from "@/components/ui/button"
import { Card,   CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/Auth/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


const Signup = () => {

  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")

  const router=useRouter();

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    setError(""); 
    try {
      const res=await signUp.email({
        name,
        email,
        password
      })

      if(res.error){
        setError(res.error.message ?? "Failed to create account. Please try again.")
      }else{
        router.push("/dashboard")
      }

    }catch(err){
      setError("Failed to create account. Please try again.")
    }
    finally{
      setLoading(false)
    }

  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
    <Card className="w-full max-w-sm border border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create an account to start tracking your job applications
        </CardDescription>
      </CardHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
      <CardContent className="space-y-4">
        
      {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </div>
                        <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

               <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            </div>
                <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
           {loading?"Creating Account...":"sign up"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
      
      </CardContent>
       </form>
   
    </Card>

    </div>
  )
}

export default Signup