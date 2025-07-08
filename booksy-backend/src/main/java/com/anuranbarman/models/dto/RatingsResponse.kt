package com.anuranbarman.models.dto

import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class RatingsResponse(
    var id: String,
    var rating:Int=0,
    var comment: String="",
    var bookId: String="",
    var bookName: String="",
    var userName: String="",
    var createdAt: Long = 0L,
    var updatedAt: Long = 0L
)