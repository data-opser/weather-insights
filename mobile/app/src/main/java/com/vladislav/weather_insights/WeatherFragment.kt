package com.vladislav.weather_insights

import android.app.AlertDialog
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.vladislav.weather_insights.Interface.WeatherServices
import com.vladislav.weather_insights.Objects.Cities
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.Objects.Weather
import com.vladislav.weather_insights.Retrofit.WeatherAPI
import com.vladislav.weather_insights.adapter.WeatherDayAdapter
import com.vladislav.weather_insights.adapter.WeatherHourAdapter
import com.vladislav.weather_insights.databinding.FragmentWeatherBinding
import com.vladislav.weather_insights.model.UserCityRequest
import com.vladislav.weather_insights.model.WeatherCityData
import com.vladislav.weather_insights.model.WeatherDay
import com.vladislav.weather_insights.model.WeatherDayData
import com.vladislav.weather_insights.model.WeatherHour
import com.vladislav.weather_insights.model.WeatherHourData
import com.vladislav.weather_insights.model.WeatherLogin
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Timer
import java.util.TimerTask

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [WeatherFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class WeatherFragment : Fragment() {
    // TODO: Rename and change types of parameters
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
                                        TODO("Not yet implemented")
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
                                            }
                                        }
                                        else{
                                            //Обробку помилок
                                        }
                                    }
                                })
                            }
                        }
                        else{
                            // Обробку помилок
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
                WeatherApi.setMainUserCity(cityId!!, User.Token).enqueue(object : Callback<UserCityRequest>{
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

            deleteCityButton.setOnClickListener {
                AlertDialog.Builder(activity)
                    .setTitle("Notification permission")
                    .setMessage("Delete ${cityTextView.text}?")
                    .setPositiveButton("Sure") { _, _ -> run {
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
                    }
                    .setNegativeButton("No need", null)//{_, _ -> }
                    .show()
            }
        }
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment WeatherFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(citiId: String) =
            WeatherFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, citiId)
                }
            }
    }
}