import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Book = {
  id: string
  name: string
}

type RatingFormData = {
  rating: string
  bookId: string
  comment: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    id?: string
    rating: number
    bookId: string
    bookName?: string
    comment?: string
  } | null
  onSuccess: () => void
}

export function RatingFormDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [form, setForm] = useState<RatingFormData>({ rating: "", bookId: "", comment: "" })
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/books`)
        const data = await res.json()
        setBooks(data)
      } catch (err) {
        console.error("Failed to fetch books", err)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (initialData) {
      setForm({
        rating: initialData.rating?.toString() || "",
        bookId: initialData.bookId || "",
        comment: initialData.comment || "",
      })
    } else {
      setForm({ rating: "", bookId: "", comment: "" })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = {
        rating: parseInt(form.rating),
        bookId: form.bookId,
        comment: form.comment,
      }

      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/ratings`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save rating")
      toast.success(initialData?.id ? "Rating updated" : "Rating created")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to save rating")
    } finally {
      setLoading(false)
    }
  }

  const selectedBookName = books.find((b) => b.id === form.bookId)?.name || "Select Book"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Edit Rating" : "Add Rating"}</DialogTitle>
          <DialogDescription>Enter rating, select a book, and optionally add a comment.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            placeholder="Rating (1–10)"
            min={1}
            max={10}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            required
          />

          {/* Book Dropdown */}
          <Popover open={bookDropdownOpen} onOpenChange={setBookDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedBookName}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search books..." />
                <CommandEmpty>No book found.</CommandEmpty>
                <CommandGroup>
                  {books.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={book.name}
                      onSelect={() => {
                        setForm((prev) => ({ ...prev, bookId: book.id }))
                        setBookDropdownOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.bookId === book.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {book.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Textarea
            placeholder="Optional comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}