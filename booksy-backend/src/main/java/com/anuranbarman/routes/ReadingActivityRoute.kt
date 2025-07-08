package com.anuranbarman.routes

import com.anuranbarman.models.ReadingActivity
import com.anuranbarman.models.dto.CurrentReadingCountResponse
import com.anuranbarman.models.dto.ReadingActivityResponse
import com.anuranbarman.models.dto.ReadingStatRequest
import com.anuranbarman.models.dto.ReadingStatResponse
import com.anuranbarman.services.ReadingActivityService
import io.quarkus.security.Authenticated
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.jwt.JsonWebToken

@Path("/activity")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class ReadingActivityRoute {

    @Inject
    private lateinit var jwt: JsonWebToken

    @Inject
    lateinit var readingActivityService: ReadingActivityService

    @POST
    @Path("/")
    @Authenticated
    fun addOrEditActivity(request: ReadingActivity): ReadingActivity? {
        println(request)
        val userName = jwt.name
        return readingActivityService.saveActivity(request,userName)
    }

    @GET
    @Path("/")
    @Authenticated
    fun getRatings(): List<ReadingActivityResponse> {
        val userName = jwt.name
        return readingActivityService.getAllReadings(userName)
    }

    @GET
    @Path("/currentReadingCount")
    @Authenticated
    fun getCurrentReadingCount(): CurrentReadingCountResponse {
        val userName = jwt.name
        return CurrentReadingCountResponse(readingActivityService.getCurrentReadingCount(userName).toInt())
    }

    @POST
    @Path("/getReadingGraph")
    @Authenticated
    fun getReadingGraph(request: ReadingStatRequest): List<ReadingStatResponse> {
        val userName = jwt.name
        return readingActivityService.getReadingStatForTimespan(userName,request.from,request.to)
    }
}