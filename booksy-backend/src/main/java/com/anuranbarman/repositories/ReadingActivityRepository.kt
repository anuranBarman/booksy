package com.anuranbarman.repositories

import com.anuranbarman.models.ReadingActivity
import com.anuranbarman.models.ReadingStatus
import io.quarkus.mongodb.panache.PanacheMongoRepository
import jakarta.enterprise.context.ApplicationScoped
import org.bson.types.ObjectId

@ApplicationScoped
class ReadingActivityRepository: PanacheMongoRepository<ReadingActivity> {

    fun addActivity(current: ReadingActivity){
        persist(current)
    }

    fun updateActivity(current: ReadingActivity){
        update(current)
    }

    fun getActivityById(id: ObjectId): ReadingActivity?{
        return find("_id",id).firstResult<ReadingActivity>()
    }

    fun getActivityByBookId(bookId: String): ReadingActivity?{
        return find("bookId",bookId).firstResult<ReadingActivity>()
    }

    fun getAllActivities(userName: String): List<ReadingActivity>{
        return find("userName",userName).list<ReadingActivity>()
    }

    fun getAllCompletedActivities(userName: String,from: Long,to: Long): List<ReadingActivity>{
        return find("userName = ?1 and currentStatus = ?2 and completedAt >= ?3 and completedAt <= ?4",userName,
            ReadingStatus.COMPLETED,from,to).list()
    }

    fun getCurrentReadingCount(userName: String): Long {
        return find("userName = ?1 and currentStatus = ?2",userName, ReadingStatus.READING).count()
    }
}