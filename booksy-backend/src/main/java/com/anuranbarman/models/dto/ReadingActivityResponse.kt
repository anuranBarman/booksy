package com.anuranbarman.models.dto

import com.anuranbarman.models.ReadingStatus
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.types.ObjectId

data class ReadingActivityResponse(
    var id: ObjectId = ObjectId(),
    var bookId: String="",
    var bookName: String ="",
    var createdAt: Long = 0,
    var userName: String="",
    var completedAt: Long=0,
    var currentStatus: ReadingStatus = ReadingStatus.UNKNWON
)