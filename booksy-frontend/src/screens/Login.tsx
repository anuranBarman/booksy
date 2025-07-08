import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

const API_BASE_URL = import.meta.env.VITE_API_URL

export function AuthForm() {
  const navigate = useNavigate()
  const { isLoggedIn, login } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [form, setForm] = useState({
    name: "",
    userName: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoggedIn) navigate("/")
  }, [isLoggedIn, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE_URL}/auth/${mode == "signup" ? "signup" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `${mode == "login" ? "Login" : "Sign Up"} failed`)
      }
        if (mode === "signup") {
            setMode("login")
            setForm({ name: "", userName: "", password: "" })
        } else {
            login(data.token)
            navigate("/")
        }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {mode === "login" ? "Login" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <Input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            )}
            <Input
              name="userName"
              placeholder="Username"
              value={form.userName}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Sign Up"}
            </Button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}