package com.vladislav.weather_insights.Interface

import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.model.CityData
import com.vladislav.weather_insights.model.FirebaseLoginRequest
import com.vladislav.weather_insights.model.HoroscopeData
import com.vladislav.weather_insights.model.LoginRequest
import com.vladislav.weather_insights.model.UserCityData
import com.vladislav.weather_insights.model.UserCityRequest
import com.vladislav.weather_insights.model.UserDevice
import com.vladislav.weather_insights.model.UserProfile
import com.vladislav.weather_insights.model.WeatherDayData
import com.vladislav.weather_insights.model.WeatherHourData
import com.vladislav.weather_insights.model.WeatherLogin
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Query

interface WeatherServices {

    @POST("token_login")
    @Headers(
        "Content-Type: application/json"
    )
    fun login(@Body data: LoginRequest) : Call<WeatherLogin>

    @GET("profile")
    @Headers(
        "Content-Type: application/json"
    )
    fun profile(@Header("Authorization") token: String? = User.Token) : Call<UserProfile>

    @GET("cities")
    @Headers(
        "Content-Type: application/json"
    )
    fun getCities() : Call<ArrayList<CityData>>

    @GET("weather/city/date")
    @Headers(
        "Content-Type: application/json"
    )
    fun getWeatherDay(@Query("city") city: String,@Query("date") date: String) : Call<ArrayList<WeatherHourData>>

    @GET("weatherday/city")
    @Headers(
        "Content-Type: application/json"
    )
    fun getWeatherFourDays(@Query("city") city: String) : Call<ArrayList<WeatherDayData>>


    @GET("user_city_ids")
    @Headers(
        "Content-Type: application/json"
    )
    fun getUserCities(@Header("Authorization") token: String? = User.Token) : Call<UserCityData>

    @POST("add_user_city/city")
    @Headers(
        "Content-Type: application/json"
    )
    fun addUserCity(@Query("city") city: String, @Header("Authorization") token: String? = User.Token) : Call<UserCityRequest>

    @POST("delete_user_city/city")
    @Headers(
        "Content-Type: application/json"
    )
    fun deleteUserCity(@Query("city") city: String, @Header("Authorization") token: String? = User.Token) : Call<UserCityRequest>

    @PUT("set_main_user_city/city")
    @Headers(
        "Content-Type: application/json"
    )
    fun setMainUserCity(@Query("city") city: String, @Header("Authorization") token: String? = User.Token) : Call<UserCityRequest>

    @POST("add_user_device")
    @Headers(
        "Content-Type: application/json"
    )
    fun addUserDevice(@Body data: UserDevice, @Header("Authorization") token: String? = User.Token) : Call<UserCityRequest>

    @GET("horoscope")
    @Headers(
        "Content-Type: application/json"
    )
    fun takeHoroscope() : Call<ArrayList<HoroscopeData>>

    @POST("firebase_auth")
    @Headers(
        "Content-Type: application/json"
    )
    fun firebaseLogin(@Body data: FirebaseLoginRequest) : Call<WeatherLogin>
}