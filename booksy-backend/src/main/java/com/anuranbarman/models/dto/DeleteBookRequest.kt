package com.anuranbarman.models.dto

import com.anuranbarman.models.BookGenre

data class DeleteBookRequest(val id: String="",var userName: String=""){
    fun isValid(): Boolean{
        return this.id.isNotEmpty()
    }
    fun isOwner(createdBy: String): Boolean{
        return createdBy == userName
    }
}
