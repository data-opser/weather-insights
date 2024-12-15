package com.vladislav.weather_insights.Objects

import com.vladislav.weather_insights.model.CityData
import java.util.Dictionary

object Cities {

    private var cityNames: MutableMap<String, CityData> = mutableMapOf()
    private var cityIds: MutableMap<String, CityData> = mutableMapOf()
    private var isCitiesLoaded = false
    var setCities: ArrayList<CityData>
        get() {
            TODO()
        }
        set(value) {
            for (city in value) {
                cityNames.put(city.city, city)
                cityIds.put(city.id, city)
            }
            isCitiesLoaded = true
        }
    val getCityNames: MutableMap<String, CityData>
        get() = cityNames

    val getCityIds: MutableMap<String, CityData>
        get() = cityIds

    val citiesLoaded: Boolean
        get() = isCitiesLoaded
}