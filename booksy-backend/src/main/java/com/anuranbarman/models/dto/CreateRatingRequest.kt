package com.anuranbarman.models.dto

data class CreateRatingRequest(val rating:Int=0,val bookId: String="",val comment: String="")
