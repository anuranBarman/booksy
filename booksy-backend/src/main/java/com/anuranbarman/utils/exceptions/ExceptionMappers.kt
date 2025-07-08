package com.anuranbarman.utils.exceptions

import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider

@Provider
class APIExceptionMapper : ExceptionMapper<APIException> {
    override fun toResponse(exception: APIException): Response {
        return Response.status(exception.status)
            .entity(mapOf("error" to exception.message))
            .type(MediaType.APPLICATION_JSON)
            .build()
    }
}

@Provider
class GlobalExceptionMapper : ExceptionMapper<Throwable> {
    override fun toResponse(exception: Throwable): Response {
        exception.printStackTrace() // Optional: useful during dev
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(mapOf("error" to "Unexpected server error", "details" to exception.message))
            .type(MediaType.APPLICATION_JSON)
            .build()
    }
}