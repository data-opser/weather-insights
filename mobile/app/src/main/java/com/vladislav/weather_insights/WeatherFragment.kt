package com.vladislav.weather_insights

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
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
            hourAdapter.addHour(WeatherHour(1, "Now", 38))
            for (count in 1..20){
                val hour = WeatherHour(2, "$count:00", count)
                hourAdapter.addHour(hour)
            }

            dayRecyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)
            dayRecyclerView.adapter = dayAdapter
            dayAdapter.addDay(WeatherDay(1, "Today", 27, 21, 32))
            for (countDay in 1..7){
                val minTemp = countDay + -5
                val maxTemp = countDay + 3
                val day = WeatherDay(1, "Today", (minTemp..maxTemp).random(), minTemp, maxTemp)
                dayAdapter.addDay(day)
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
        fun newInstance(param1: String, param2: String) =
            WeatherFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}