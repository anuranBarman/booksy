package com.anuranbarman.models

import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

@MongoEntity(collection = "readingActivity")
data class ReadingActivity(
    @BsonId
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    var id: ObjectId = ObjectId(),

    var bookId: String="",
    var createdAt: Long = 0,
    var userName: String="",
    var completedAt: Long=0,
    var currentStatus: ReadingStatus = ReadingStatus.UNKNWON
)
