package com.vladislav.weather_insights.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.vladislav.weather_insights.R
import com.vladislav.weather_insights.databinding.ItemCityBinding
import com.vladislav.weather_insights.model.City

class CityAdapter : RecyclerView.Adapter<CityAdapter.CityViewHolder>(){
    private val cityList = ArrayList<City>()

    class CityViewHolder(item: View): RecyclerView.ViewHolder(item){
        private val binding = ItemCityBinding.bind(item)

        fun bind(cityItem: City) = with(binding){
            cityTextView.text = cityItem.city
            countryTextView.text = cityItem.country
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CityViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_city, parent, false)

        return CityViewHolder(view)
    }

    override fun onBindViewHolder(holder: CityViewHolder, position: Int) {
        holder.bind(cityList[position])
    }

    override fun getItemCount(): Int {
        return cityList.size
    }

    fun addCity(city: City){
        cityList.add(city)
        notifyItemInserted(itemCount - 1)
    }
}