package com.anuranbarman.repositories

import com.anuranbarman.models.Book
import com.anuranbarman.models.User
import io.quarkus.mongodb.panache.PanacheMongoEntityBase.persist
import io.quarkus.mongodb.panache.PanacheMongoRepository
import jakarta.enterprise.context.ApplicationScoped
import org.bson.types.ObjectId

@ApplicationScoped
class BooksRepository: PanacheMongoRepository<Book> {

    fun createBook(book: Book){
        persist(book)
    }
    fun getBooksByUserName(userName: String): List<Book>{
        return find("createdBy",userName).list()
    }

    fun updateBook(book: Book){
        update(book)
    }

    fun getBookById(id: ObjectId): Book?{
        return find("_id",id).firstResult()
    }

    fun deleteBook(id: ObjectId){
        delete("_id",id)
    }
}