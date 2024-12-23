package com.vladislav.weather_insights.Objects

import com.vladislav.weather_insights.model.UserCityData
import com.vladislav.weather_insights.model.UserProfile

object User {
    private var token: String? = null

    private var profile: UserProfile? = null

    private var userCities: UserCityData? = UserCityData(arrayListOf("1004993580"), "1004993580")

    var Token: String?
        get() = token
        set(value) {
            token = value
        }

    var Profile: UserProfile?
        get() = profile
        set(value) {
            profile = value
        }
    var UserCities: UserCityData?
        get() = userCities
        set(value){
            userCities = value
        }
}
