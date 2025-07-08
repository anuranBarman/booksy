import { useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import { subYears } from "date-fns"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker" // Replace with your DatePicker import


export function ReadingActivityChart() {
  const [from, setFrom] = useState<Date | undefined>(subYears(new Date(), 1))
  const [to, setTo] = useState<Date | undefined>(new Date())
  const [data, setData] = useState<{ month: string; count: number }[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/activity/getReadingGraph`, {
        method: "POST",
        body: JSON.stringify({
          from: from == undefined ? 0 : from.getTime(),
          to: to == undefined ? 0 : to.getTime(),
        }),
      })

      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Failed to fetch graph data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const option = {
    title: {
      text: "Reading Activity",
      left: "center",
      textStyle: { fontSize: 18 },
    },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: data.map((d) => d.month),
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Books Read",
        type: "bar",
        data: data.map((d) => d.count),
        itemStyle: {
          color: "rgb(34, 197, 94)", // Tailwind blue-500
        },
      },
    ],
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reading Stats (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
          <div className="flex flex-col">
            <Label className="font-bold mb-4">From :</Label>
            <DatePicker date={from} setDate={setFrom} />
          </div>
          <div className="flex flex-col">
            <Label className="font-bold mb-4">To :</Label>
            <DatePicker date={to} setDate={setTo} />
          </div>
          <Button onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  )
}