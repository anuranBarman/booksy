package com.anuranbarman.models.dto

import com.anuranbarman.models.BookGenre

data class CreateBookRequest(val name: String="",val author: String="",val publishingYear: Int=0,val genre: BookGenre= BookGenre.Unknown)
