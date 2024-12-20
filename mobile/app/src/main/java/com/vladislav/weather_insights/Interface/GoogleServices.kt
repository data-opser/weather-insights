package com.vladislav.weather_insights.Interface

import com.vladislav.weather_insights.model.GoogleResponse
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST


interface GoogleServices {
    @FormUrlEncoded
    @POST("token")
    fun getGoogleTokens(
        @Field("code") code: String?,                  // Auth Code от Google
        @Field("client_id") clientId: String,         // Ваш Client ID из Google Cloud Console
        @Field("client_secret") clientSecret: String, // Ваш Client Secret из Google Cloud Console
        @Field("redirect_uri") redirectUri: String,   // Redirect URI, указанный в настройках OAuth 2.0
        @Field("grant_type") grantType: String = "authorization_code" // Тип авторизации
    ): Call<GoogleResponse> // Укажите модель ответа
}