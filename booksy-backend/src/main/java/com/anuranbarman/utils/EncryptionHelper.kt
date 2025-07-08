package com.anuranbarman.utils

import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

object EncryptionHelper {
    private const val ALGORITHM = "Blowfish"

    fun encrypt(input: String, secret: String): String {
        val key = SecretKeySpec(secret.toByteArray(Charsets.UTF_8), ALGORITHM)
        val cipher = Cipher.getInstance(ALGORITHM)
        cipher.init(Cipher.ENCRYPT_MODE, key)
        val encrypted = cipher.doFinal(input.toByteArray(Charsets.UTF_8))
        return Base64.getEncoder().encodeToString(encrypted)
    }

    fun decrypt(encryptedInput: String, secret: String): String {
        val key = SecretKeySpec(secret.toByteArray(Charsets.UTF_8), ALGORITHM)
        val cipher = Cipher.getInstance(ALGORITHM)
        cipher.init(Cipher.DECRYPT_MODE, key)
        val decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedInput))
        return String(decrypted, Charsets.UTF_8)
    }
}