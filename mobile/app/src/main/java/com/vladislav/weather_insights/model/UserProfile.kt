package com.vladislav.weather_insights.model

data class UserProfile(
    val name: String,
    val email: String,
    val birthday: String,
    val email_confirmed: Boolean,
    val created_at: String
)
