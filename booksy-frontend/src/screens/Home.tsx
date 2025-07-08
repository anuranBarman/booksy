import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import CountUp from "react-countup"
import { ReadingActivityChart } from "@/componentsLocal/ReadingStat"

export default function Home() {

  const navigate = useNavigate()

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      // Redirect to auth page if not logged in
      navigate("/auth")
    }
  },[])


  const [readingCount, setReadingCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchReadingCount = async () => {
        try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/activity/currentReadingCount`)
        const data = await res.json()
        setReadingCount(data.count)
        } catch (err) {
        console.error("Failed to fetch reading count", err)
        }
    }

    fetchReadingCount()
    }, [])

  return (
    <>
      <main className="px-4">
        <Card className="w-full mt-6 shadow-sm">
            <CardHeader className="text-left">
                <CardTitle className="text-2xl font-bold">
                Currently Reading
                </CardTitle>
            </CardHeader>
            <CardContent className="text-left">
                {readingCount === null ? (
                <p className="text-muted-foreground">Loading...</p>
                ) : readingCount === 0 ? (
                <p>You are not reading any books currently.</p>
                ) : (
                <p className="text-lg">
                    Currently you are reading{" "}
                    <span className="text-3xl font-extrabold text-primary">
                    <CountUp end={readingCount} duration={1} />
                    </span>{" "}
                    {readingCount === 1 ? "book" : "books"}.
                </p>
                )}
            </CardContent>
        </Card>
        <ReadingActivityChart />
      </main>
    </>
  )
}