package com.vladislav.weather_insights

import android.content.res.ColorStateList
import android.os.Bundle
import android.util.Log
import android.util.TypedValue
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.vladislav.weather_insights.Interface.WeatherServices
import com.vladislav.weather_insights.Objects.Cities
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.Objects.Weather
import com.vladislav.weather_insights.Retrofit.WeatherAPI
import com.vladislav.weather_insights.adapter.WeatherDayAdapter
import com.vladislav.weather_insights.adapter.WeatherHourAdapter
import com.vladislav.weather_insights.databinding.AlertDialogLayoutBinding
import com.vladislav.weather_insights.databinding.FragmentWeatherBinding
import com.vladislav.weather_insights.model.UserCityRequest
import com.vladislav.weather_insights.model.WeatherCityData
import com.vladislav.weather_insights.model.WeatherDay
import com.vladislav.weather_insights.model.WeatherDayData
import com.vladislav.weather_insights.model.WeatherHour
import com.vladislav.weather_insights.model.WeatherHourData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Locale
import java.util.Timer
import java.util.TimerTask

private const val ARG_PARAM1 = "param1"

class WeatherFragment : Fragment() {
    private var cityId: String? = null

    private lateinit var binding: FragmentWeatherBinding
    private lateinit var WeatherApi: WeatherServices

    private val weatherImageMap = mapOf(
        "Clear" to R.drawable.weather_day_clear,
        "Clouds" to R.drawable.weather_day_cloud,
        "Rain" to R.drawable.weather_day_rain,
        "Snow" to R.drawable.weather_day_snow,
        "night_Clear" to R.drawable.weather_night_clear,
        "night_Сloud" to R.drawable.weather_night_cloud,
        "night_Rain" to R.drawable.weather_night_rain,
        "night_Snow" to R.drawable.weather_night_snow
    )
    private val hourAdapter = WeatherHourAdapter()
    private val dayAdapter = WeatherDayAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WeatherApi = WeatherAPI.retrofitService
        arguments?.let {
            cityId = it.getString(ARG_PARAM1)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = FragmentWeatherBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.apply {
            hourRecyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
            hourRecyclerView.adapter = hourAdapter
            dayRecyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)
            dayRecyclerView.adapter = dayAdapter

            if (Cities.citiesLoaded) {
                Cities.getCityIds[cityId]?.let {
                    cityTextView.text = it.city
                }
            } else {
                Timer().schedule(object : TimerTask() {
                    override fun run() {
                        if (Cities.citiesLoaded) {
                            activity?.runOnUiThread { Cities.getCityIds[cityId]?.let {
                                cityTextView.text = it.city
                            } }
                        }
                    }
                }, 0, 10)
            }

            if (Weather.getWeatherCitiesData[cityId] == null){
                WeatherApi.getWeatherFourDays(cityId!!).enqueue(object : Callback<ArrayList<WeatherDayData>>{
                    override fun onFailure(call: Call<ArrayList<WeatherDayData>>, t: Throwable) {
                        Log.d("Error","Error")
                    }

                    override fun onResponse(call: Call<ArrayList<WeatherDayData>>, response: Response<ArrayList<WeatherDayData>>) {
                        if (response.isSuccessful) {
                            response.body()?.let { dayBody ->
                                WeatherApi.getWeatherDay(cityId!!,dayBody[0].date).enqueue(object : Callback<ArrayList<WeatherHourData>>{
                                    override fun onFailure(call: Call<ArrayList<WeatherHourData>>, t: Throwable) {
                                        Log.d("Error","Error")
                                    }

                                    override fun onResponse(call: Call<ArrayList<WeatherHourData>>, response: Response<ArrayList<WeatherHourData>>) {
                                        if(response.isSuccessful){
                                            response.body()?.let { hourBody ->
                                                Weather.setNewWeatherCityData(cityId!!, WeatherCityData(dayBody, hourBody))
                                                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherHourData){
                                                    Log.d(body.weather, weatherImageMap[body.weather].toString())
                                                    hourAdapter.addHour(WeatherHour(weatherImageMap[body.weather]!!,body.time,body.temperature.toDouble().toInt()))
                                                }

                                                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherDayData){
                                                    dayAdapter.addDay(WeatherDay(weatherImageMap[body.weather]!!,body.date,Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].temperature.toDouble().toInt(), body.temperature_min.toDouble().toInt(), body.temperature_max.toDouble().toInt()))
                                                }
                                                temperatureTextView.text = Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].temperature.toDouble().toInt().toString() + "°"
                                                tempMinMaxTextView.text = "Max " + Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].temperature_max.toDouble().toInt().toString() + "° Min " + Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].temperature_min.toDouble().toInt().toString() + "°"
                                                weatherStatusTextView.text = Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].weather
                                                if(User.UserCities?.main_city == cityId){
                                                    val typedValue = TypedValue()
                                                    activity?.theme?.resolveAttribute(R.attr.weatherMainActiveColor, typedValue, true)
                                                    setMainCityButton.isEnabled = false
                                                    setMainCityButton.backgroundTintList = ColorStateList.valueOf(typedValue.data)
                                                }
                                            }
                                        }
                                        else{
                                            Log.e("Response error", "Response error: ${response.errorBody()?.string()}")
                                        }
                                    }
                                })
                            }
                        }
                        else{
                            Log.e("Response error", "Response error: ${response.errorBody()?.string()}")
                        }
                    }
                })
            }
            else{
                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherHourData){
                    hourAdapter.addHour(WeatherHour(weatherImageMap[body.weather]!!,body.time,body.temperature.toDouble().toInt()))
                }

                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherDayData){
                    dayAdapter.addDay(WeatherDay(weatherImageMap[body.weather]!!,body.date,Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].temperature.toDouble().toInt(), body.temperature_min.toDouble().toInt(), body.temperature_max.toDouble().toInt()))
                }
                temperatureTextView.text = Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].temperature.toDouble().toInt().toString() + "°"
                tempMinMaxTextView.text = "Max " + Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].temperature_max.toDouble().toInt().toString() + "° Min " + Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].temperature_min.toDouble().toInt().toString() + "°"
                weatherStatusTextView.text = Weather.getWeatherCitiesData[cityId]!!.WeatherHourData[0].weather
            }

            hourRecyclerView.addOnItemTouchListener(object : RecyclerView.OnItemTouchListener {
                override fun onInterceptTouchEvent(rv: RecyclerView, e: MotionEvent): Boolean {
                    rv.parent?.requestDisallowInterceptTouchEvent(true)
                    return false
                }

                override fun onTouchEvent(rv: RecyclerView, e: MotionEvent) {
                }

                override fun onRequestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
                }
            })

            setMainCityButton.setOnClickListener {
                val typedValue = TypedValue()
                activity?.theme?.resolveAttribute(R.attr.weatherMainActiveColor, typedValue, true)
                setMainCityButton.isEnabled = false
                setMainCityButton.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                WeatherApi.setMainUserCity(cityId!!, User.Token).enqueue(object : Callback<UserCityRequest>{
                    override fun onFailure(call: Call<UserCityRequest>, t: Throwable) {
                        Log.d("Error","Error")
                    }

                    override fun onResponse(call: Call<UserCityRequest>, response: Response<UserCityRequest>) {
                        if (response.isSuccessful) {
                            //User.UserCities.main_city = cityId
                        }
                        else{
                            Log.d("Error","Error")
                        }
                    }
                })
            }

            deleteCityButton.setOnClickListener {
                val dialogView = LayoutInflater.from(activity).inflate(R.layout.alert_dialog_layout, null)
                val binding = AlertDialogLayoutBinding.bind(dialogView)

                val alertDialog = MaterialAlertDialogBuilder(requireContext())//
                    .setView(dialogView)
                    .create()

                binding.apply {
                    dialogTitle.text = String.format(Locale.getDefault(), "City")
                    dialogMessage.text = String.format(Locale.getDefault(), "Delete %s?", cityTextView.text)
                    confirmButton.setOnClickListener {
                        alertDialog.dismiss()
                        // Тут можна викликати метод, який ти створиш, що буде оновлювати список міст

                        WeatherApi.deleteUserCity(cityId!!, User.Token).enqueue(object : Callback<UserCityRequest>{
                            override fun onFailure(call: Call<UserCityRequest>, t: Throwable) {
                                Log.d("Error","Error")
                            }

                            override fun onResponse(call: Call<UserCityRequest>, response: Response<UserCityRequest>) {
                                if (response.isSuccessful) {

                                }
                                else{
                                    // Обробку помилок
                                }
                            }
                        })
                    }

                    cancelButton.setOnClickListener{
                        alertDialog.dismiss()
                    }
                }
                alertDialog.show()
            }
        }
    }

    companion object {
        @JvmStatic
        fun newInstance(citiId: String) =
            WeatherFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, citiId)
                }
            }
    }
}