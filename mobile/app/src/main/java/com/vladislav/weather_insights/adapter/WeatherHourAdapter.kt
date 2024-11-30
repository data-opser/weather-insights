package com.vladislav.weather_insights.adapter

import java.util.Locale
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.vladislav.weather_insights.R
import com.vladislav.weather_insights.databinding.ItemWeatherHourBinding
import com.vladislav.weather_insights.model.WeatherHour

class WeatherHourAdapter : RecyclerView.Adapter<WeatherHourAdapter.WeatherHourViewHolder>(){
    private val hourList = ArrayList<WeatherHour>()

    class WeatherHourViewHolder(item: View): RecyclerView.ViewHolder(item){
        private val binding = ItemWeatherHourBinding.bind(item)

        fun bind(hourItem: WeatherHour) = with(binding){
            weatherHourTextView.text = hourItem.hour
            //weatherImageView.setImageResource(hourItem.imageId)
            weatherTempTextView.text = String.format(Locale.getDefault(), "%d°", hourItem.temperature)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WeatherHourViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_weather_hour, parent, false)

        return WeatherHourViewHolder(view)
    }

    override fun onBindViewHolder(holder: WeatherHourViewHolder, position: Int) {
        holder.bind(hourList[position])
    }

    override fun getItemCount(): Int {
        return hourList.size
    }

    fun addHour(hour: WeatherHour){
        hourList.add(hour)
        notifyItemInserted(itemCount - 1)
    }
}