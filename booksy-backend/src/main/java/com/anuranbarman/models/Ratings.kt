package com.anuranbarman.models

import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

@MongoEntity(collection = "ratings")
data class Ratings(

    @BsonId
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    var id: ObjectId = ObjectId(),

    var rating:Int=0,
    var comment: String="",
    var bookId: String="",
    var userName: String="",
    var createdAt: Long = 0L,
    var updatedAt: Long = 0L
){
    @get:JsonProperty("id")
    val stringId: String get() = id.toHexString()
}