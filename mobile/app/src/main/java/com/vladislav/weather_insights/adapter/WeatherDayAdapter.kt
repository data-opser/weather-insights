package com.vladislav.weather_insights.adapter

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.vladislav.weather_insights.R
import com.vladislav.weather_insights.databinding.ItemWeatherDayBinding
import com.vladislav.weather_insights.model.WeatherDay
import java.util.Locale

class WeatherDayAdapter : RecyclerView.Adapter<WeatherDayAdapter.WeatherDayViewHolder>(){
    private val dayList = ArrayList<WeatherDay>()

    class WeatherDayViewHolder(item: View): RecyclerView.ViewHolder(item){
        private val binding = ItemWeatherDayBinding.bind(item)

        fun bind(dayItem: WeatherDay) = with(binding){
            weatherImageView.setImageResource(dayItem.imageId)
            weatherDayTextView.text = dayItem.day
            temperatureRange.max = dayItem.maxTemp - dayItem.minTemp
            temperatureRange.progress = dayItem.maxTemp - dayItem.currentTemp
            temperatureRange.isEnabled = false
            Log.d("wt2",(dayItem.day + "  current: " + dayItem.currentTemp))
            dayMinTextView.text = String.format(Locale.getDefault(), "%d°", dayItem.minTemp)
            dayMaxTextView.text = String.format(Locale.getDefault(), "%d°", dayItem.maxTemp)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WeatherDayViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_weather_day, parent, false)

        return WeatherDayViewHolder(view)
    }

    override fun onBindViewHolder(holder: WeatherDayViewHolder, position: Int) {
        holder.bind(dayList[position])
    }

    override fun getItemCount(): Int {
        return dayList.size
    }

    fun addDay(day: WeatherDay){
        dayList.add(day)
        notifyItemInserted(itemCount - 1)
    }
}