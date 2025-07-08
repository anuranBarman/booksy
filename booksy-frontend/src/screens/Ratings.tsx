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
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, Pencil } from "lucide-react"
import { RatingFormDialog } from "@/componentsLocal/RatingAddDialog"

type Rating = {
  id: string
  rating: number
  comment: string
  bookId: string
  bookName: string
  userName: string
  createdAt: number
  updatedAt: number
}

export function Ratings() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [filtered, setFiltered] = useState<Rating[]>([])
  const [search, setSearch] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<Rating | null>(null)

  const fetchRatings = async () => {
      try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/ratings`)
        const data = await res.json()
        setRatings(data)
        setFiltered(data)
      } catch (err) {
        console.error("Failed to fetch ratings", err)
      }
}

  useEffect(() => {
    
    fetchRatings()
  }, [])

  // Apply filter and sort when search or sort changes
  useEffect(() => {
    let data = [...ratings]

    if (search.trim()) {
      data = data.filter((r) =>
        r.bookName.toLowerCase().includes(search.toLowerCase())
      )
    }

    data.sort((a, b) =>
      sortAsc ? a.rating - b.rating : b.rating - a.rating
    )

    setFiltered(data)
  }, [search, sortAsc, ratings])

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">All Ratings</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Filter by book name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-1/3"
        />

        <Button
          variant="outline"
          onClick={() => setSortAsc(!sortAsc)}
          className="w-fit"
        >
          Sort by Rating {sortAsc ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-1/4">Book</TableHead>
              <TableHead className="font-bold w-1/12 text-center">Rating</TableHead>
              <TableHead className="font-bold w-1/3">Comment</TableHead>
              <TableHead className="font-bold w-1/6">Created At</TableHead>
              <TableHead className="font-bold w-1/6">Updated At</TableHead>
              <TableHead className="font-bold w-1/12 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-left">{r.bookName}</TableCell>
                <TableCell className="text-center">⭐️ {r.rating}</TableCell>
                <TableCell className="text-muted-foreground text-left">
                  {r.comment || <span className="italic text-gray-400">No comment</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-left">
                  {format(new Date(r.createdAt), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-left">
                  {r.updatedAt == 0 ? "" : format(new Date(r.updatedAt), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell className="text-center">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                            setEditData(r)
                            setDialogOpen(true)
                        }}
                        >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RatingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editData}
        onSuccess={() => {
            setDialogOpen(false)
            setEditData(null)
            // re-fetch
            fetchRatings()
        }}
        />
        <Button
            onClick={() => {
                setEditData(null)
                setDialogOpen(true)
            }}
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 text-white bg-primary hover:bg-primary/90 shadow-lg"
            >
            <span className="text-2xl leading-none">+</span>
        </Button>
    </div>
  )
}