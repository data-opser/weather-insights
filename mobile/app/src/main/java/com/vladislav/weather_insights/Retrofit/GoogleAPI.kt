package com.vladislav.weather_insights.Retrofit

import com.vladislav.weather_insights.Interface.GoogleServices

object GoogleAPI {
    private val retrofitClient = RetrofitClient()
    private const val BASE_URL = "https://oauth2.googleapis.com/"
    val retrofitService: GoogleServices
        get() = retrofitClient.getClient(BASE_URL).create(GoogleServices::class.java)
}