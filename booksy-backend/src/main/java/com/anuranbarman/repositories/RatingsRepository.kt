package com.anuranbarman.repositories

import com.anuranbarman.models.Book
import com.anuranbarman.models.Ratings
import com.anuranbarman.models.User
import io.quarkus.mongodb.panache.PanacheMongoEntityBase.persist
import io.quarkus.mongodb.panache.PanacheMongoRepository
import jakarta.enterprise.context.ApplicationScoped
import org.bson.types.ObjectId

@ApplicationScoped
class RatingsRepository: PanacheMongoRepository<Ratings> {

    fun createRating(rating: Ratings){
        persist(rating)
    }

    fun updateRating(ratings: Ratings){
        update(ratings)
    }

    fun getRatingsByUserName(userName: String): List<Ratings>{
        return find("userName",userName).list()
    }
    fun getRatingsByBookIdAndUserName(bookId: String,userName: String): Ratings?{
        return find("bookId = ?1 and userName = ?2",bookId,userName).firstResult<Ratings>()
    }

    fun deleteRating(bookId: String){
        delete("bookId",bookId)
    }
}