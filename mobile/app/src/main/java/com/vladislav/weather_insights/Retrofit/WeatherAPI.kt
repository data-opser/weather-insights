package com.vladislav.weather_insights.Retrofit

import com.vladislav.weather_insights.Interface.WeatherServices

object WeatherAPI {
    private val retrofitClient = RetrofitClient()
    private const val BASE_URL = "http://159.224.120.94:5000"
    val retrofitService: WeatherServices
        get() = retrofitClient.getClient(BASE_URL).create(WeatherServices::class.java)
}