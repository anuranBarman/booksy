package com.anuranbarman.routes

import com.anuranbarman.models.Book
import com.anuranbarman.models.BookGenre
import com.anuranbarman.models.Ratings
import com.anuranbarman.models.dto.CreateBookRequest
import com.anuranbarman.models.dto.CreateRatingRequest
import com.anuranbarman.models.dto.DeleteBookRequest
import com.anuranbarman.models.dto.RatingsResponse
import com.anuranbarman.models.dto.UpdateBookRequest
import com.anuranbarman.services.BookService
import com.anuranbarman.services.RatingsService
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

@Path("/ratings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class RatingsRoute {

    @Inject
    private lateinit var jwt: JsonWebToken

    @Inject
    lateinit var ratingService: RatingsService

    @POST
    @Path("/")
    @Authenticated
    fun createRating(request: CreateRatingRequest): Ratings? {
        println(request)
        val userName = jwt.name
        return ratingService.saveRating(request,userName)
    }

    @GET
    @Path("/")
    @Authenticated
    fun getRatings(): List<RatingsResponse> {
        val userName = jwt.name
        return ratingService.getRatings(userName)
    }
}