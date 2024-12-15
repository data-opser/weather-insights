package com.vladislav.weather_insights.model

data class WeatherHourData(
    val clouds_percent: String,
    val humidity: String,
    val pressure_ground_level: String,
    val rain_precipitation: String,
    val snow_precipitation: String,
    val temperature: String,
    val temperature_feels_like: String,
    val time: String,
    val weather: String,
    val wind_degree: String,
    val wind_gust: String,
    val wind_speed: String
)
