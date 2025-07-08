package com.anuranbarman.repositories

import com.anuranbarman.models.User
import io.quarkus.mongodb.panache.PanacheMongoRepository
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class UserRepository: PanacheMongoRepository<User> {
    fun findByUserName(userName: String): User? {
        return find("userName",userName).firstResult()
    }
    fun createUser(user: User){
        persist(user)
    }
}