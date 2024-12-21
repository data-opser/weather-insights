package com.vladislav.weather_insights.adapter

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.vladislav.weather_insights.WeatherFragment

    class ViewPagerAdapter(fragmentActivity: FragmentActivity, val list: ArrayList<WeatherFragment>)
    : FragmentStateAdapter(fragmentActivity) {
    override fun getItemCount(): Int {
        return list.size
    }

    override fun createFragment(position: Int): Fragment {
        return list[position]
    }

    fun addFragment(fragment: WeatherFragment) {
        list.add(fragment)
        notifyItemInserted(list.size - 1)
    }

    fun removeFragment(position: Int) {
        if (position in list.indices) {
            list.removeAt(position)
            notifyItemRemoved(position)
            notifyItemRangeChanged(position, list.size)
        }
    }
}