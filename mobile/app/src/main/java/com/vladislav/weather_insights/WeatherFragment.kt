package com.vladislav.weather_insights

import android.app.Activity
import android.content.res.ColorStateList
import android.os.Bundle
import android.os.Handler
import android.os.Looper
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
    private lateinit var myActivity: MainActivity
    private lateinit var binding: FragmentWeatherBinding
    private lateinit var WeatherApi: WeatherServices
    private val handler = Handler(Looper.getMainLooper())
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


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WeatherApi = WeatherAPI.retrofitService
        myActivity = requireActivity() as MainActivity
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
        val hourAdapter = WeatherHourAdapter()
        val dayAdapter = WeatherDayAdapter()
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
                val runnable = object : Runnable {
                    override fun run() {
                        if (Cities.citiesLoaded) {
                            Cities.getCityIds[cityId]?.let {
                                cityTextView.text = it.city
                                return
                            }
                        }
                        handler.postDelayed(this, 10)
                    }
                }
                handler.post(runnable)
            }

            if (Weather.getWeatherCitiesData[cityId] != null){
                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherHourData){
                    Log.d(body.weather, weatherImageMap[body.weather].toString())
                    hourAdapter.addHour(
                        WeatherHour(weatherImageMap[body.weather]!!,body.time,body.temperature.toDouble().toInt())
                    )
                }

                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherDayData){
                    dayAdapter.addDay(
                        WeatherDay(weatherImageMap[body.weather]!!,body.date,
                            Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].daily_temperature_feels_like.toDouble().toInt(), body.temperature_min.toDouble().toInt(), body.temperature_max.toDouble().toInt())
                    )
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
            else {
                val runnable = object : Runnable {
                    override fun run() {
                        if (Weather.getWeatherCitiesData[cityId] != null) {
                            Weather.getWeatherCitiesData[cityId]?.let {
                                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherHourData){
                                    Log.d(body.weather, weatherImageMap[body.weather].toString())
                                    hourAdapter.addHour(
                                        WeatherHour(weatherImageMap[body.weather]!!,body.time,body.temperature.toDouble().toInt())
                                    )
                                }

                                for(body in Weather.getWeatherCitiesData[cityId]!!.WeatherDayData){
                                    dayAdapter.addDay(
                                        WeatherDay(weatherImageMap[body.weather]!!,body.date,
                                            Weather.getWeatherCitiesData[cityId]!!.WeatherDayData[0].daily_temperature_feels_like.toDouble().toInt(), body.temperature_min.toDouble().toInt(), body.temperature_max.toDouble().toInt())
                                    )
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
                                return
                            }
                        }
                        handler.postDelayed(this, 10)
                    }
                }
                handler.post(runnable)
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
                                    myActivity.WeatherPreviousFragment.removeCityById(cityId!!)
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

    fun getCityId(): String? {
        return cityId
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