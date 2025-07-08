package com.anuranbarman.models

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonCreator
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonProperty
import org.bson.types.ObjectId

@MongoEntity(collection = "users")
class User{
    @BsonId
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    var id: ObjectId = ObjectId()
    var userName: String=""
    var name: String=""
    var password: String=""
    var createdAt: Long=0L

    @get:JsonProperty("id")
    val stringId: String get() = id.toHexString()
}