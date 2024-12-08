package com.vladislav.weather_insights

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.vladislav.weather_insights.adapter.WeatherDayAdapter
import com.vladislav.weather_insights.adapter.WeatherHourAdapter
import com.vladislav.weather_insights.databinding.FragmentWeatherBinding
import com.vladislav.weather_insights.model.WeatherDay
import com.vladislav.weather_insights.model.WeatherHour

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
    private var param1: String? = null
    private var param2: String? = null

    private lateinit var binding: FragmentWeatherBinding
    private val imageList = listOf(
        R.drawable.weather_day_clear,
        R.drawable.weather_day_cloud,
        R.drawable.weather_day_rain,
        R.drawable.weather_day_snow,
        R.drawable.weather_night_clear,
        R.drawable.weather_night_cloud,
        R.drawable.weather_night_rain,
        R.drawable.weather_night_snow
    )
    private val hourAdapter = WeatherHourAdapter()
    private val dayAdapter = WeatherDayAdapter()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
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
            hourAdapter.addHour(WeatherHour(imageList[0], "Now", 38))
            for (countHour in 1..20){
                if(countHour < 8){
                    hourAdapter.addHour(WeatherHour(imageList[countHour], "$countHour:00", countHour))
                    continue
                }

                val hour = WeatherHour(imageList[1], "$countHour:00", countHour)
                hourAdapter.addHour(hour)
            }

            dayRecyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)
            dayRecyclerView.adapter = dayAdapter
            dayAdapter.addDay(WeatherDay(imageList[0], "Today", 27, -99, 32))
            for (countDay in 1..7){
                val minTemp = countDay + -5
                val maxTemp = countDay + 3
                val day = WeatherDay(imageList[countDay], "Wed", (minTemp..maxTemp).random(), minTemp, maxTemp)
                dayAdapter.addDay(day)
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
        fun newInstance(param1: String, param2: String) =
            WeatherFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}