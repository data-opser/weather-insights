package com.vladislav.weather_insights.model

data class WeatherCityData(
    val WeatherDayData: ArrayList<WeatherDayData>,
    val WeatherHourData: ArrayList<WeatherHourData>
)
