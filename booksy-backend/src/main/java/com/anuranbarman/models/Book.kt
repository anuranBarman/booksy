package com.anuranbarman.models

import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonIgnore
import org.bson.types.ObjectId

@MongoEntity(collection = "books")
data class Book(
    @BsonId
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    var id: ObjectId = ObjectId(),

    var name: String = "",
    var author: String = "",
    var publishingYear: Int = 0,
    var genre: BookGenre = BookGenre.Unknown, // or null if nullable
    var createdBy: String = "",
    var createdAt: Long = 0L,
    var updatedAt: Long = 0L
) {
    @get:BsonIgnore
    @get:JsonProperty("id")
    val stringId: String get() = id.toHexString()
}