package com.vladislav.weather_insights

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [HoroscopeFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class HoroscopeFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var signNoneLayout: LinearLayout
    private lateinit var signInfoLayout: ScrollView
    private lateinit var signNameTextView: TextView
    private lateinit var signInfoTextView: TextView
    private lateinit var goSettingsButton: Button
    private var param1: String? = null
    private var param2: String? = null

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
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_horoscope, container, false)
    }


    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment HoroscopeFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            HoroscopeFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferences = requireActivity().getSharedPreferences("MODE", Context.MODE_PRIVATE)
        signInfoLayout = view.findViewById(R.id.signInfoLayout)
        signNoneLayout = view.findViewById(R.id.signNoneLayout)
        signNameTextView = view.findViewById(R.id.signNameTextView)
        signInfoTextView = view.findViewById(R.id.signInfoTextView)
        goSettingsButton = view.findViewById(R.id.goSettingsButton)
        val sign = sharedPreferences.getString("sign", "none")

        goSettingsButton.setOnClickListener{
            (activity as MainActivity).replaceFragment(SettingsFragment(), "SettingsFragment")
            (activity as MainActivity).selectBottomNavItem(R.id.nav_settings)
        }

        if (sign == "none")
        {
            signInfoLayout.visibility = View.GONE
            signNoneLayout.visibility = View.VISIBLE
        } else{
            // Прописуємо інфу для гороскопу
            signNameTextView.text = getString(R.string.horoscope_sign_name)
            signInfoTextView.text = getString(R.string.horoscope_sign_descrp)
        }
    }
}