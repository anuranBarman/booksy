package com.anuranbarman.services

import com.anuranbarman.models.Book
import com.anuranbarman.models.BookGenre
import com.anuranbarman.models.Ratings
import com.anuranbarman.models.dto.CreateRatingRequest
import com.anuranbarman.models.dto.DeleteBookRequest
import com.anuranbarman.models.dto.RatingsResponse
import com.anuranbarman.models.dto.UpdateBookRequest
import com.anuranbarman.repositories.RatingsRepository
import com.anuranbarman.utils.exceptions.InvalidBookException
import jakarta.enterprise.context.ApplicationScoped
import org.bson.types.ObjectId

@ApplicationScoped
class RatingsService(private val ratingsRepository: RatingsRepository,private val bookService: BookService) {

    fun saveRating(request: CreateRatingRequest,userName:String): Ratings{

        val existingRating = ratingsRepository.getRatingsByBookIdAndUserName(request.bookId,userName)
        if(existingRating != null){
            existingRating.rating = request.rating
            existingRating.comment = request.comment
            existingRating.updatedAt = System.currentTimeMillis()
            ratingsRepository.updateRating(existingRating)
            return existingRating
        }else {
            val rating = Ratings()
            rating.rating = request.rating
            rating.comment = request.comment
            rating.bookId = request.bookId
            rating.userName = userName
            rating.createdAt = System.currentTimeMillis()
            ratingsRepository.createRating(rating)
            return rating
        }
    }

    fun getRatings(userName: String): List<RatingsResponse>{
        val books = bookService.getBooks(userName)
        val ratings = ratingsRepository.getRatingsByUserName(userName)
        val responseList = arrayListOf<RatingsResponse>()

        ratings.forEach { rating ->
            val book = books.find { book -> book.id.toHexString() == rating.bookId }
            responseList.add(
                RatingsResponse(
                    rating.id.toHexString(),
                    rating.rating,
                    rating.comment,
                    rating.bookId,
                    book!!.name,
                    rating.userName,
                    rating.createdAt,
                    rating.updatedAt
                )
            )
        }

        return responseList
    }

    fun deleteRating(bookId: String){
        ratingsRepository.deleteRating(bookId)
    }
}