package com.vladislav.weather_insights.Objects

import com.vladislav.weather_insights.model.HoroscopeData

object Horoscope {
    private var Data: MutableMap<String, HoroscopeData> = mutableMapOf()


    var setHoroscope: ArrayList<HoroscopeData>
        get() {
            TODO()
        }
        set(value) {
            for (data in value) {
                Data.put(data.sign_name, data)
            }
        }
    val getHoroscope: MutableMap<String, HoroscopeData>
        get() = Data
}