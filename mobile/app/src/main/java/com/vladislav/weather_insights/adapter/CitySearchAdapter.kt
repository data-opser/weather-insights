package com.vladislav.weather_insights.adapter

import android.app.Dialog
import android.content.Context
import android.content.res.ColorStateList
import android.util.TypedValue
import android.view.LayoutInflater
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.LinearLayout
import androidx.core.widget.doOnTextChanged
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.vladislav.weather_insights.MainActivity
import com.vladislav.weather_insights.Objects.Cities
import com.vladislav.weather_insights.R
import com.vladislav.weather_insights.databinding.BottomNavLayoutBinding
import com.vladislav.weather_insights.model.City

class CitySearchAdapter (private val activity: MainActivity, private val dialog: BottomSheetDialog){
    private var binding: BottomNavLayoutBinding = BottomNavLayoutBinding.inflate(LayoutInflater.from(activity))
    private var citySearchRWAdapter = CitySearchRWAdapter(dialog, activity)

    fun changeActiveProcess(dialog: Dialog) {
        dialog.setContentView(binding.root)

        binding.apply {
            dialog.findViewById<LinearLayout>(R.id.bottomNavLayout).setOnClickListener {
                if (searchEditText.isFocused) {
                    searchEditText.clearFocus()
                    hideKeyboard(searchEditText)
                }
            }

            searchEditText.setOnFocusChangeListener { _, hasFocus ->
                run {
                    val typedValue = TypedValue()
                    if (hasFocus) {
                        activity.theme.resolveAttribute(R.attr.searchBgActiveColor, typedValue, true)
                        searchLinearLayout.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                        activity.theme.resolveAttribute(R.attr.searchIconActiveColor, typedValue, true)
                        zoomImageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                        activity.theme.resolveAttribute(R.attr.searchTextActiveColor, typedValue, true)
                        searchEditText.setTextColor(ColorStateList.valueOf(typedValue.data))
                    } else {
                        activity.theme.resolveAttribute(R.attr.searchBgInertColor, typedValue, true)
                        searchLinearLayout.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                        activity.theme.resolveAttribute(R.attr.searchIconInertColor, typedValue, true)
                        zoomImageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                        activity.theme.resolveAttribute(R.attr.searchTextInertColor, typedValue, true)
                        searchEditText.setTextColor(ColorStateList.valueOf(typedValue.data))
                    }
                }
            }

            for(city in Cities.getCityNames.keys){
                citySearchRWAdapter.addCity(City(city, Cities.getCityNames[city]!!.country, Cities.getCityNames[city]!!.id))
            }

            searchEditText.doOnTextChanged { text, _, _, _ ->
                val query = text.toString().lowercase()
                val filteredCities = Cities.getCityNames.keys.filter { city ->
                    city.lowercase().startsWith(query)
                }

                citySearchRWAdapter.clearCities()
                for (city in filteredCities) {
                    citySearchRWAdapter.addCity(City(city, Cities.getCityNames[city]?.country ?: "", Cities.getCityNames[city]!!.id))
                }

                citySearchRWAdapter.notifyDataSetChanged()
            }
            cityRecyclerView.layoutManager = LinearLayoutManager(dialog.context, LinearLayoutManager.VERTICAL, false)
            cityRecyclerView.adapter = citySearchRWAdapter
        }
    }

    private fun hideKeyboard(view: View) {
        val inputMethodManager = activity.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }
}