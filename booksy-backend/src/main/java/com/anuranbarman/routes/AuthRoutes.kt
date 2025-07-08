package com.anuranbarman.routes

import com.anuranbarman.models.dto.Login
import com.anuranbarman.models.dto.SignUp
import com.anuranbarman.models.User
import com.anuranbarman.models.dto.LoginSuccess
import com.anuranbarman.services.UserService
import com.anuranbarman.utils.EncryptionHelper
import com.anuranbarman.utils.Environments
import com.anuranbarman.utils.exceptions.ConflictException
import com.anuranbarman.utils.exceptions.InvalidLoginException
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class AuthRoutes {

    @Inject
    private lateinit var environments: Environments

    @Inject
    lateinit var userService: UserService

    @POST
    @Path("/signup")
    fun signup(request: SignUp): User{
        val userName = request.userName
        val existingUser = userService.getUserByUserName(userName)
        if(existingUser != null){
            throw ConflictException("User already exists with userName: ${request.userName}")
        }
        val password = EncryptionHelper.encrypt(request.password, environments.getAuthEncKey())
        val user = User()
        user.userName = userName
        user.password = password
        user.name = request.name
        user.createdAt = System.currentTimeMillis()
        return userService.createUser(user)
    }

    @POST
    @Path("/login")
    fun login(request: Login): LoginSuccess{
        val userName = request.userName
        val existingUser = userService.getUserByUserName(userName)
        println(existingUser)
        if(existingUser == null){
            throw InvalidLoginException("User Name does not exist")
        }
        val passwordDB = EncryptionHelper.decrypt(existingUser.password, environments.getAuthEncKey())
        if(request.password == passwordDB){
            return LoginSuccess(token = userService.getToken(userName))
        }else {
            throw InvalidLoginException("Invalid Credentials")
        }
    }

}