package com.anuranbarman.services

import com.anuranbarman.models.Book
import com.anuranbarman.models.BookGenre
import com.anuranbarman.models.dto.CreateBookRequest
import com.anuranbarman.models.dto.DeleteBookRequest
import com.anuranbarman.models.dto.UpdateBookRequest
import com.anuranbarman.repositories.BooksRepository
import com.anuranbarman.utils.exceptions.InvalidBookException
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.bson.types.ObjectId

@ApplicationScoped
class BookService(private val booksRepository: BooksRepository) {

    @Inject
    private lateinit var ratingsService: RatingsService

    fun saveBook(request: CreateBookRequest,userName:String): Book{
        val book = Book()
        book.name = request.name
        book.author = request.author
        book.publishingYear = request.publishingYear
        book.genre = request.genre
        book.createdBy = userName
        book.createdAt = System.currentTimeMillis()
        book.updatedAt = System.currentTimeMillis()
        booksRepository.createBook(book)
        return book
    }

    fun getBooks(userName: String): List<Book>{
        return booksRepository.getBooksByUserName(userName)
    }

    fun updateBook(bookRequest: UpdateBookRequest,userName: String){
        if(!bookRequest.isValid()){
            throw InvalidBookException("Book ID is not valid")
        }
        val id = ObjectId(bookRequest.id)
        val existingBook = booksRepository.getBookById(id) ?: throw InvalidBookException("Book is not valid")
        if(existingBook.createdBy != userName){
            throw InvalidBookException("Book entry is not created by you")
        }
        val book = Book()
        book.id = id
        book.name = bookRequest.name
        book.author = bookRequest.author
        book.genre = bookRequest.genre
        book.publishingYear = bookRequest.publishingYear
        book.createdBy = existingBook.createdBy.ifEmpty { userName }
        book.createdAt = if(existingBook.createdAt != 0L) existingBook.createdAt else System.currentTimeMillis()
        book.updatedAt = System.currentTimeMillis()
        booksRepository.updateBook(book)
    }

    fun deleteBook(request: DeleteBookRequest){
        val existingBook = booksRepository.getBookById(ObjectId(request.id)) ?: throw InvalidBookException("Book is not valid")
        if(!request.isOwner(existingBook.createdBy)) {
            throw InvalidBookException("Book entry is not created by you")
        }
        booksRepository.deleteBook(existingBook.id)
        ratingsService.deleteRating(existingBook.id.toHexString())
    }

    fun getGenres(): List<BookGenre>{
        return BookGenre.entries
    }
}