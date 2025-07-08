package com.anuranbarman.utils

import java.security.KeyFactory
import java.security.PrivateKey
import java.security.spec.PKCS8EncodedKeySpec
import java.util.Base64

object KeyLoader {
    fun loadPrivateKey(resourcePath: String): PrivateKey {
        val keyBytes = KeyLoader::class.java.classLoader.getResourceAsStream(resourcePath)?.readBytes()
            ?: throw IllegalArgumentException("Private key not found: $resourcePath")

        val pem = String(keyBytes)
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replace("\\s".toRegex(), "")

        val decoded = Base64.getDecoder().decode(pem)
        val keySpec = PKCS8EncodedKeySpec(decoded)
        val keyFactory = KeyFactory.getInstance("RSA")
        return keyFactory.generatePrivate(keySpec)
    }
}