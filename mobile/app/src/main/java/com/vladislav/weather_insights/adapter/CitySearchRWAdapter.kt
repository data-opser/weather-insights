package com.vladislav.weather_insights.adapter

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.vladislav.weather_insights.MainActivity
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.R
import com.vladislav.weather_insights.Retrofit.WeatherAPI
import com.vladislav.weather_insights.databinding.AlertDialogLayoutBinding
import com.vladislav.weather_insights.databinding.ItemCityBinding
import com.vladislav.weather_insights.model.City
import com.vladislav.weather_insights.model.UserCityRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Locale

class CitySearchRWAdapter(private val dialog: BottomSheetDialog, private val activity: MainActivity) : RecyclerView.Adapter<CitySearchRWAdapter.CityViewHolder>(){
    private val cityList = ArrayList<City>()

    class CityViewHolder(item: View, private val dialog: BottomSheetDialog, private val activity: MainActivity): RecyclerView.ViewHolder(item){
        private val binding = ItemCityBinding.bind(item)

        fun bind(cityItem: City) = with(binding){
            cityTextView.text = cityItem.city
            countryTextView.text = cityItem.country
            cityConstraintLayout.setOnClickListener{
                showCityAlertDialog(cityItem)
            }
        }

        private fun showCityAlertDialog(cityItem: City) {
            // Тут можливо треба прийняти данні міста, щоб коли користувач погодився
            // він не чекав на відповідь запиту. І треба додати його до списку погод по містах

            val dialogView = LayoutInflater.from(activity).inflate(R.layout.alert_dialog_layout, null)
            val binding = AlertDialogLayoutBinding.bind(dialogView)

            val alertDialog = MaterialAlertDialogBuilder(activity)
                .setView(dialogView)
                .create()

            binding.apply {
                dialogTitle.text = String.format(Locale.getDefault(), "City")
                dialogMessage.text = String.format(Locale.getDefault(), "Add %s?", cityItem.city)

                confirmButton.setOnClickListener {
                    alertDialog.dismiss()
                    dialog.dismiss()

                    WeatherAPI.retrofitService.addUserCity(cityItem.cityId).enqueue(object :
                        Callback<UserCityRequest> {
                        override fun onFailure(call: Call<UserCityRequest>, t: Throwable) {
                            Log.d("Error","Error")
                        }

                        override fun onResponse(call: Call<UserCityRequest>, response: Response<UserCityRequest>) {
                            if (response.isSuccessful) {
                                User.UserCities!!.user_cities.add(cityItem.cityId)
                            } else {
                                Log.e("AuthError", "Response error: ${response.errorBody()?.string()}")
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

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CityViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_city, parent, false)

        return CityViewHolder(view, dialog, activity)
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

    fun clearCities(){
        cityList.clear()
    }
}