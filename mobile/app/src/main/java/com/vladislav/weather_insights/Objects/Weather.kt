package com.vladislav.weather_insights.Objects

import com.vladislav.weather_insights.model.WeatherCityData

object Weather {
    private var WeatherCitiesData: MutableMap<String, WeatherCityData> = mutableMapOf()

    val getWeatherCitiesData: MutableMap<String, WeatherCityData>
        get() = WeatherCitiesData

    fun setNewWeatherCityData(cityId: String, WeatherCityData: WeatherCityData ){
        WeatherCitiesData.put(cityId, WeatherCityData)
    }

    fun deleteWeatherCityData(cityId: String){
        WeatherCitiesData.remove(cityId)
    }
}