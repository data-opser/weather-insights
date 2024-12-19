package com.vladislav.weather_insights

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.adapter.ViewPagerAdapter
import com.vladislav.weather_insights.databinding.FragmentWeatherPreviousBinding

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"

private lateinit var binding: FragmentWeatherPreviousBinding
/**
 * A simple [Fragment] subclass.
 * Use the [WeatherPreviousFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class WeatherPreviousFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var cityId: String? = null

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

        val fragAdapter = ViewPagerAdapter(requireActivity(), cityList)
        binding.apply {
            weatherViewPager.adapter = fragAdapter
            TabLayoutMediator(tabLayout, weatherViewPager) { tab, position ->
                tab.text = ""
            }.attach()

//            weatherViewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
//                override fun onPageSelected(position: Int) {
//                    dotsIndicator.attachTo(weatherViewPager)
//                }
//            })
        }
    }
    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment WeatherPreviousFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(cityId: String) =
            WeatherPreviousFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, cityId)
                }
            }
    }
}