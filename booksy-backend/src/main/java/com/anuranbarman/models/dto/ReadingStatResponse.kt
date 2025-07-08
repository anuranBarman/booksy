package com.anuranbarman.models.dto

data class ReadingStatResponse(
    val month: String,
    val count: Int
)
data class ReadingStatRequest (
    val from: Long=System.currentTimeMillis() - 365L * 24 * 60 * 60 * 1000,
    val to: Long= System.currentTimeMillis()
)
