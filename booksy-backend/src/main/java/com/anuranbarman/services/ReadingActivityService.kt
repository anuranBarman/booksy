package com.anuranbarman.services

import com.anuranbarman.models.ReadingActivity
import com.anuranbarman.models.ReadingStatus
import com.anuranbarman.models.dto.ReadingActivityResponse
import com.anuranbarman.models.dto.ReadingStatResponse
import com.anuranbarman.repositories.ReadingActivityRepository
import jakarta.enterprise.context.ApplicationScoped
import java.time.Instant
import java.time.YearMonth
import java.time.ZoneId

@ApplicationScoped
class ReadingActivityService(private val readingActivityRepository: ReadingActivityRepository,private val bookService: BookService) {

    fun saveActivity(request: ReadingActivity,userName:String): ReadingActivity{
        val readingActivity = readingActivityRepository.getActivityById(request.id)
        if(readingActivity != null){
            readingActivity.completedAt = System.currentTimeMillis()
            readingActivity.currentStatus = ReadingStatus.COMPLETED
            readingActivityRepository.updateActivity(readingActivity)
            return readingActivity
        }else {

            val existingActivity = readingActivityRepository.getActivityByBookId(request.bookId)
            if(existingActivity != null && existingActivity.currentStatus == ReadingStatus.READING){
                existingActivity.completedAt = System.currentTimeMillis()
                existingActivity.currentStatus = ReadingStatus.COMPLETED
                readingActivityRepository.updateActivity(existingActivity)
                return existingActivity
            }

            val newActivity = ReadingActivity()
            newActivity.bookId = request.bookId
            newActivity.currentStatus = ReadingStatus.READING
            newActivity.userName = userName
            newActivity.createdAt = System.currentTimeMillis()
            readingActivityRepository.addActivity(newActivity)
            return newActivity
        }
    }

    fun getAllReadings(userName: String): List<ReadingActivityResponse>{
        val books = bookService.getBooks(userName)
        val activities = readingActivityRepository.getAllActivities(userName)
        val responseList = arrayListOf<ReadingActivityResponse>()

        activities.forEach { activity ->
            val book = books.find { book -> book.id.toHexString() == activity.bookId }
            responseList.add(
                ReadingActivityResponse(activity.id,activity.bookId,book!!.name,activity.createdAt,activity.userName,activity.completedAt,activity.currentStatus)
            )
        }

        return responseList
    }

    fun getCurrentReadingCount(userName: String): Long{
        return readingActivityRepository.getCurrentReadingCount(userName)
    }

    fun getReadingStatForTimespan(userName: String, from: Long, to: Long): List<ReadingStatResponse> {
        val activities = readingActivityRepository.getAllCompletedActivities(userName,from,to)

        val grouped = activities.groupBy { activity ->
            val date = Instant.ofEpochMilli(activity.completedAt).atZone(ZoneId.systemDefault())
            YearMonth.of(date.year, date.month)
        }

        val start = YearMonth.from(Instant.ofEpochMilli(from).atZone(ZoneId.systemDefault()))
        val end = YearMonth.from(Instant.ofEpochMilli(to).atZone(ZoneId.systemDefault()))

        val result = mutableListOf<ReadingStatResponse>()

        var current = start
        while (!current.isAfter(end)) {
            val count = grouped[current]?.size ?: 0
            result.add(ReadingStatResponse(month = current.toString(), count = count))
            current = current.plusMonths(1)
        }

        return result
    }
}