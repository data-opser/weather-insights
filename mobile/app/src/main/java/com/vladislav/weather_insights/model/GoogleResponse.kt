package com.vladislav.weather_insights.model

data class GoogleResponse(
    val access_token: String,
    val expires_in: Int,
    val refresh_token: String,
    val scope: String,
    val token_type: String
)
