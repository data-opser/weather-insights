package com.vladislav.weather_insights.model


data class WeatherDayData(
    val daily_temperature_feels_like: String,
    val date: String,
    val humidity: String,
    val temperature_max: String,
    val temperature_min: String,
    val weather: String,
    val wind_speed: String
)