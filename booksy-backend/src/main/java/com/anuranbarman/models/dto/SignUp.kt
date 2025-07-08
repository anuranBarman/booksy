package com.anuranbarman.models.dto

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class SignUp @JsonCreator constructor(
    @JsonProperty("userName") val userName: String = "",
    @JsonProperty("name") val name: String = "",
    @JsonProperty("password") val password: String = ""
)