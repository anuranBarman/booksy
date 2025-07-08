import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { BookFormDialog } from "@/componentsLocal/BookForm"


type Book = {
  id: string
  name: string
  author: string
  publishingYear: number
  genre: string
  createdAt: number
  updatedAt: number
}

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [filter, setFilter] = useState("")
  const [sortField, setSortField] = useState<keyof Book | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editBook, setEditBook] = useState<Partial<Book> | null>(null)

    const fetchBooks = async () => {
      try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/books`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch books")
        setBooks(data)
        setFilteredBooks(data)
      } catch (err: any) {
        setError(err.message || "Error fetching books")
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    let updated = [...books]

    // Apply filter
    if (filter) {
      updated = updated.filter(
        (book) =>
          book.name.toLowerCase().includes(filter.toLowerCase()) ||
          book.author.toLowerCase().includes(filter.toLowerCase()) ||
          book.genre.toLowerCase().includes(filter.toLowerCase())
      )
    }

    // Apply sorting
    if (sortField) {
      updated.sort((a, b) => {
        const valA = a[sortField]
        const valB = b[sortField]
        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA)
        } else {
          return sortOrder === "asc"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number)
        }
      })
    }

    setFilteredBooks(updated)
  }, [filter, sortField, sortOrder, books])

  const handleDeleteConfirm = async () => {
        if (!selectedBookId) return
        try {
            const res = await apiFetch(`${import.meta.env.VITE_API_URL}/books`, {
            method: "DELETE",
            body: JSON.stringify({ id: selectedBookId }),
            })

            if (!res.ok) throw new Error("Failed to delete")

            setBooks((prev) => prev.filter((b) => b.id !== selectedBookId))
            toast.success("Book deleted successfully")
        } catch (err: any) {
            toast.error(err.message || "Error deleting book")
        } finally {
            setConfirmDialogOpen(false)
            setSelectedBookId(null)
        } 
}

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Library</h1>

      <Input
        placeholder="Filter by name, author or genre..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 max-w-md"
      />

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="overflow-auto border rounded-md">
          <Table className="table-fixed w-full min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="gap-1 p-0"
                  >
                    Name <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("author")}
                    className="flex items-center gap-1 p-0"
                  >
                    Author <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("genre")}
                    className="flex items-center gap-1 p-0"
                  >
                    Genre <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("publishingYear")}
                    className="flex items-center gap-1 p-0"
                  >
                    Year <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[180px]">Created At</TableHead>
                <TableHead className="w-[180px]">Updated At</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="w-[180px] text-left">{book.name}</TableCell>
                  <TableCell className="w-[150px] text-left">{book.author}</TableCell>
                  <TableCell className="w-[120px] text-left">{book.genre}</TableCell>
                  <TableCell className="w-[100px]text-left">
                    {book.publishingYear}
                  </TableCell>
                  <TableCell className="w-[180px] text-left">
                    {formatDate(book.createdAt)}
                  </TableCell>
                  <TableCell className="w-[180px] text-left">
                    {formatDate(book.updatedAt)}
                  </TableCell>
                  <TableCell className="w-[120px] text-center">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => {
                                setEditBook(book)
                                setEditDialogOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            >
                            <Pencil size={16} />
                        </button>
                        <button
                        onClick={() => {
                            setSelectedBookId(book.id)
                            setConfirmDialogOpen(true)
                        }}
                        className="text-red-600 hover:text-red-800"
                        >
                        <Trash size={16} />
                        </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this book? This action cannot be undone.
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                    </DialogFooter>
                </DialogContent>
          </Dialog>
          <BookFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                initialData={editBook}
                onSuccess={(_) => {
                    fetchBooks()
                }}
            />
        </div>
      )}
      <Button
        onClick={() => {
            setEditBook(null)
            setEditDialogOpen(true)
        }}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 text-white bg-primary hover:bg-primary/90 shadow-lg"
        >
        <span className="text-2xl leading-none">+</span>
      </Button>
    </div>
  )
}