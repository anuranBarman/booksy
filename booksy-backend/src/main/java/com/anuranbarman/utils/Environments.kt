package com.anuranbarman.utils

import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class Environments {
    @ConfigProperty(name = "secret.key")
    private lateinit var authEncKey: String

    @ConfigProperty(name = "quarkus.mongodb.database")
    private lateinit var databaseName: String

    fun getAuthEncKey(): String{
        return authEncKey
    }

    fun getDatabaseName(): String{
        return databaseName
    }
}