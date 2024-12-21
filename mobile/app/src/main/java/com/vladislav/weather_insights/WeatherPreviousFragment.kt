package com.vladislav.weather_insights

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayoutMediator
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.adapter.ViewPagerAdapter
import com.vladislav.weather_insights.databinding.FragmentWeatherPreviousBinding

private const val ARG_PARAM1 = "param1"
private lateinit var binding: FragmentWeatherPreviousBinding

class WeatherPreviousFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var cityId: String? = null
    private lateinit var fragAdapter: ViewPagerAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            cityId = it.getString(ARG_PARAM1)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = FragmentWeatherPreviousBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


        val cityList: ArrayList<WeatherFragment> = arrayListOf()
        for (city in User.UserCities!!.user_cities)
        {
            cityList.add(WeatherFragment.newInstance(city))
        }

        fragAdapter = ViewPagerAdapter(requireActivity(), cityList)
        binding.apply {
            weatherViewPager.adapter = fragAdapter
            TabLayoutMediator(tabLayout, weatherViewPager) { tab, position ->
                tab.text = ""
            }.attach()
        }
    }
    companion object {
        @JvmStatic
        fun newInstance(cityId: String) =
            WeatherPreviousFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, cityId)
                }
            }
    }
    fun addCity(cityId: String){
        fragAdapter.addFragment(WeatherFragment.newInstance(cityId))
    }

    fun removeCityById(cityId: String) {
        val position = fragAdapter.list.indexOfFirst { it.getCityId() == cityId }
        if (position != -1) {
            fragAdapter.removeFragment(position)
        }
    }
}