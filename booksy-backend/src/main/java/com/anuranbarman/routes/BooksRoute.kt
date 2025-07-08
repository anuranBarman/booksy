package com.anuranbarman.routes

import com.anuranbarman.models.Book
import com.anuranbarman.models.BookGenre
import com.anuranbarman.models.dto.CreateBookRequest
import com.anuranbarman.models.dto.DeleteBookRequest
import com.anuranbarman.models.dto.UpdateBookRequest
import com.anuranbarman.services.BookService
import io.quarkus.security.Authenticated
import jakarta.annotation.security.RolesAllowed
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.jwt.JsonWebToken

@Path("/books")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class BooksRoute {

    @Inject
    private lateinit var jwt: JsonWebToken

    @Inject
    lateinit var bookService: BookService

    @POST
    @Path("/")
    @Authenticated
    fun createBook(request: CreateBookRequest): Book? {
        println(request)
        val userName = jwt.name
        return bookService.saveBook(request,userName)
    }

    @GET
    @Path("/")
    @Authenticated
    fun getBooks(): List<Book> {
        val userName = jwt.name
        return bookService.getBooks(userName)
    }

    @PUT
    @Path("/")
    @Authenticated
    fun updateBook(request: UpdateBookRequest): Response {
        bookService.updateBook(request,jwt.name)
        return Response.ok().build()
    }

    @DELETE
    @Path("/")
    @Authenticated
    fun deleteBook(request: DeleteBookRequest): Response {
        request.userName = jwt.name
        bookService.deleteBook(request)
        return Response.ok().build()
    }

    @GET
    @Path("/genres")
    @Authenticated
    fun getGenres(): List<BookGenre> {
        return bookService.getGenres()
    }
}