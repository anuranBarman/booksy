import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format } from "date-fns"
import { apiFetch } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


import { Plus } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"


type Activity = {
  id: string
  bookId: string
  bookName: string
  createdAt: number
  userName: string
  completedAt: number
  currentStatus: "READING" | "COMPLETED" | "PAUSED"
}

export function ReadingActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filtered, setFiltered] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
    const [books, setBooks] = useState<{ id: string; name: string }[]>([])
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

 const handleAddActivity = async () => {
  if (!selectedBookId) return
  setSaving(true)
  try {
    const res = await apiFetch(`${import.meta.env.VITE_API_URL}/activity`, {
      method: "POST",
      body: JSON.stringify({ bookId: selectedBookId }),
    })
    if (!res.ok) throw new Error("Failed to add activity")

    toast.success("Activity added")
    setDialogOpen(false)
    setSelectedBookId(null)
    // optionally refresh list of activities
    fetchActivities()
  } catch (err: any) {
    toast.error(err.message || "Failed to add activity")
  } finally {
    setSaving(false)
  }
}

  const markAsDone = async (activityId: string) => {
    try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/activity`, {
        method: "POST",
        body: JSON.stringify({ id: activityId }),
        })

        if (!res.ok) throw new Error("Failed to update activity")

        toast.success("Marked as completed")
        // Option 1: Refetch all data
        // fetchActivities()

        // Option 2: Optimistically update local state
        setActivities((prev) =>
        prev.map((a) =>
            a.id === activityId
            ? { ...a, currentStatus: "COMPLETED", completedAt: Date.now() }
            : a
        )
        )
    } catch (err: any) {
        toast.error(err.message || "Failed to update activity")
    }
    }

  function getStatusVariant(status: string): "default" | "destructive" {
    switch (status) {
        case "READING":
        return "destructive"  // red badge (can look like active/in-progress)
        case "COMPLETED":
        return "default"      // green badge (completed)
        default:
        return "default"
    }
    }

  useEffect(() => {
  if (!dialogOpen) return
  const fetchBooks = async () => {
    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/books`)
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      toast.error("Failed to load books")
    }
  }
  fetchBooks()
}, [dialogOpen])

    const fetchActivities = async () => {
      try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/activity`)
        const data = await res.json()
        setActivities(data)
        setFiltered(data)
      } catch (err) {
        console.error("Failed to fetch activities", err)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    

    fetchActivities()
  }, [])

  useEffect(() => {
    let result = [...activities]

    if (search.trim()) {
      result = result.filter(a =>
        a.bookName.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      result = result.filter(a => a.currentStatus === status)
    }

    setFiltered(result)
  }, [search, status, activities])

  if (loading) return <p className="p-4 text-muted-foreground">Loading activities...</p>

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Reading Activity</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by book name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-1/3"
        />
        <Select onValueChange={(val) => setStatus(val === "ALL" ? "" : val)} value={status || "ALL"}>
            <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All</SelectItem> {/* ✅ Fix: no empty string */}
                <SelectItem value="READING">READING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-1/4 text-left">Book</TableHead>
              <TableHead className="font-bold w-1/6 text-left">Status</TableHead>
              <TableHead className="font-bold w-1/6 text-left">Started At</TableHead>
              <TableHead className="font-bold w-1/6 text-left">Completed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.sort((a,_)=>{
                return a.currentStatus === "COMPLETED" ? 1 : -1
            }).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="text-left">{a.bookName}</TableCell>
                <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(a.currentStatus)}>
                        {a.currentStatus}
                        </Badge>

                        {a.currentStatus === "READING" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 py-1 h-auto"
                            >
                                Done
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Completion of Book</AlertDialogTitle>
                                <div className="text-sm text-muted-foreground mt-2">
                                Congratulations on completing the Book. Please confirm if you want to mark it as done.
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                onClick={async () => {
                                    await markAsDone(a.id)
                                }}
                                >
                                Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-left">
                  {format(new Date(a.createdAt), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-left">
                  {a.completedAt > 0
                    ? format(new Date(a.completedAt), "dd MMM yyyy, hh:mm a")
                    : <span className="italic text-gray-400">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full p-0 shadow-lg"
      variant="default"
    >
      <Plus className="w-6 h-6" />
    </Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Start Reading a Book</DialogTitle>
    </DialogHeader>

    <div className="space-y-4 py-2">
      <Select onValueChange={(val) => setSelectedBookId(val)} value={selectedBookId || undefined}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Book" />
        </SelectTrigger>
        <SelectContent>
          {books.map((book) => (
            <SelectItem key={book.id} value={book.id}>
              {book.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <DialogFooter>
      <Button onClick={handleAddActivity} disabled={saving || !selectedBookId}>
        {saving ? "Saving..." : "Start Reading"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}