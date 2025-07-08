package com.anuranbarman.utils.exceptions

import jakarta.ws.rs.core.Response


open class APIException(val status: Response.Status, message: String): RuntimeException(message)

class ConflictException(message: String) : APIException(Response.Status.CONFLICT,message)
class InvalidLoginException(message: String): APIException(Response.Status.UNAUTHORIZED,message)

class InvalidBookException(message: String): APIException(Response.Status.BAD_REQUEST,message)