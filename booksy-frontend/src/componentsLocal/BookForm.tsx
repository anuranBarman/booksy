// components/BookFormDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Book = {
  id: string
  name: string
  author: string
  publishingYear: number
  genre: string
  createdAt: number
  updatedAt: number
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Book> | null
  onSuccess: (book: Book) => void
}

export function BookFormDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    author: "",
    publishingYear: "",
    genre: "",
  })
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<string[]>([])
  const [genreOpen, setGenreOpen] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        author: initialData.author || "",
        publishingYear: initialData.publishingYear?.toString() || "",
        genre: initialData.genre || "",
      })
    } else {
      setForm({ name: "", author: "", publishingYear: "", genre: "" })
    }
  }, [initialData])

  useEffect(() => {
  const fetchGenres = async () => {
    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/books/genres`)
      const data = await res.json()
      if (Array.isArray(data)) setGenres(data)
    } catch (err) {
      console.error("Failed to fetch genres", err)
    }
  }

  fetchGenres()
}, [])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    const body = {
      ...form,
      publishingYear: parseInt(form.publishingYear),
      ...(initialData?.id ? { id: initialData.id } : {}),
    }

    const isEdit = !!initialData?.id
    const url = `${import.meta.env.VITE_API_URL}/books`

    const res = await apiFetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error("Failed to save book")

    const result = isEdit ? undefined : await res.json()
    toast.success(isEdit ? "Book updated" : "Book created")
    onSuccess(result)
    onOpenChange(false)
  } catch (err: any) {
    toast.error(err.message || "Failed to save book")
  } finally {
    setLoading(false)
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Edit Book" : "Add Book"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {initialData?.id ? "update" : "add"} a book.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Book Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />
          <Input
            placeholder="Publishing Year"
            type="number"
            value={form.publishingYear}
            onChange={(e) => setForm({ ...form, publishingYear: e.target.value })}
            required
          />
          <Popover open={genreOpen} onOpenChange={setGenreOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    >
                    {form.genre || "Select Genre"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                    <CommandInput placeholder="Search genre..." />
                    <CommandEmpty>No genre found.</CommandEmpty>
                    <CommandGroup>
                        {genres.map((genre) => (
                        <CommandItem
                            key={genre}
                            value={genre}
                            onSelect={(value) => {
                            setForm((prev) => ({ ...prev, genre: value }))
                            setGenreOpen(false) // ✅ close popover
                            }}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                form.genre === genre ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {genre}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : initialData?.id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}