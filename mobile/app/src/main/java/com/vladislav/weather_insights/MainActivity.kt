package com.vladislav.weather_insights

import android.Manifest
import android.content.Context
import android.content.SharedPreferences
import android.content.SharedPreferences.Editor
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.ViewGroup
import android.view.Window
import android.view.WindowManager
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.vladislav.weather_insights.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private var isDialogShowing = false

    private lateinit var binding: ActivityMainBinding
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var editor: Editor

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        window.setFlags(
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        )
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("MODE", Context.MODE_PRIVATE)
        editor = sharedPreferences.edit()

        val typedValue = TypedValue()
        theme.resolveAttribute(R.attr.navBarColor, typedValue, true)
        window.navigationBarColor = typedValue.data

        if (supportFragmentManager.findFragmentByTag("SettingsFragment") == null) {
            replaceFragment(WeatherPreviousFragment(), "WeatherPreviousFragment")
        }
        setTheme()

        binding.bottomNavigationView.setOnItemSelectedListener {
            when(it.itemId) {
                R.id.nav_weather -> replaceFragment(WeatherPreviousFragment (), "WeatherPreviousFragment")
                R.id.nav_profile -> replaceFragment(ProfileFragment (),"PremiumFragment")
                R.id.nav_horoscope -> replaceFragment(HoroscopeFragment (),"HoroscopeFragment")
                R.id.nav_settings -> replaceFragment(SettingsFragment (),"SettingsFragment")
            }

            true
        }
        binding.fab.setOnClickListener{
            showBottomDialog()
        }

        val mainView = binding.mainActivity

        val colorsGradientBg = intArrayOf(
            getColorFromAttr(R.attr.fragmentBgStartColor),
            getColorFromAttr(R.attr.fragmentBgMiddleColor),
            getColorFromAttr(R.attr.fragmentBgEndColor)
        )

        val gradientDrawable = GradientDrawable(
            GradientDrawable.Orientation.TOP_BOTTOM,
            colorsGradientBg
        )
        gradientDrawable.setDither(true)
        mainView.background = gradientDrawable
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
        {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != (if (sharedPreferences.getBoolean("notification", false)) 1 else 0)
            ) {
                editor.putBoolean(
                    "notification",
                    ContextCompat.checkSelfPermission(
                        this,
                        Manifest.permission.POST_NOTIFICATIONS
                    ) == 1
                )
            }
        }
    }

    fun replaceFragment(fragment: Fragment, tag: String) {
        val fragmentManager = supportFragmentManager
        val fragmentTransaction = fragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.frame_layout, fragment, tag)
        fragmentTransaction.commit()
    }

    private fun showBottomDialog() {
        if(isDialogShowing) {return}

        isDialogShowing = true

        val dialog = BottomSheetDialog(this)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setContentView(R.layout.bottom_nav_layout)

        val search = SearchDialog(this)
        search.changeActiveProcess(dialog)

        dialog.setOnDismissListener{
            isDialogShowing = false
        }

        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.window?.attributes?.windowAnimations = R.style.DialogAnimation
        dialog.window?.setGravity(Gravity.BOTTOM)
    }

    private fun setTheme(){
        val sharedPreferences = getSharedPreferences("MODE", Context.MODE_PRIVATE)
        if (sharedPreferences.getBoolean("isNight", false)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        }
    }

    private fun getColorFromAttr(attr: Int): Int {
        val typedValue = TypedValue()
        theme.resolveAttribute(attr, typedValue, true)
        return typedValue.data
    }

    fun selectBottomNavItem(itemId: Int) = with(binding){
        bottomNavigationView.selectedItemId = itemId
    }
}