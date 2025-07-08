package com.anuranbarman.services

import com.anuranbarman.models.User
import com.anuranbarman.repositories.UserRepository
import com.anuranbarman.utils.Environments
import com.anuranbarman.utils.KeyLoader
import io.smallrye.jwt.algorithm.SignatureAlgorithm
import io.smallrye.jwt.build.Jwt
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserService(val userRepository: UserRepository) {

    val privateKey = KeyLoader.loadPrivateKey("private.pem")

    fun createUser(user: User): User {
        userRepository.createUser(user)
        return user
    }

    fun getUserByUserName(userName: String): User? {
        return userRepository.findByUserName(userName = userName)
    }

    fun getToken(userName: String): String {
        val token = Jwt
            .issuer("booksy")
            .upn(userName)
            .expiresAt((System.currentTimeMillis() / 1000)+(15 * 24 * 60 * 60))
            .claim("role","user")
            .jws()
            .algorithm(SignatureAlgorithm.RS256)
            .keyId("booksy-key-id")
            .sign(privateKey)
        return token
    }
}