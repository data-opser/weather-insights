package com.vladislav.weather_insights

import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toolbar
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.google.android.material.bottomnavigation.BottomNavigationMenuView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.floatingactionbutton.FloatingActionButton

class MainActivity : AppCompatActivity() {
    private lateinit var fab: FloatingActionButton
    private lateinit var bottomNavigationView: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.navigationBarColor = ContextCompat.getColor(this, R.color.navigationBar)
        }
        ////////////////
        window.statusBarColor = ContextCompat.getColor(this, R.color.statusBar_night)
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        ////////////////////
        bottomNavigationView = findViewById(R.id.bottomNavigationView)
        fab = findViewById(R.id.fab)

        replaceFragment(WeatherFragment());

        bottomNavigationView.setOnItemSelectedListener {
            when(it.getItemId()) {
                R.id.weather -> replaceFragment(WeatherFragment ())
                R.id.premium -> replaceFragment(PremiumFragment ())
                R.id.horoscope -> replaceFragment(HoroscopeFragment ())
                R.id.settings -> replaceFragment(SettingsFragment ())
            }

            true;
        }
        fab.setOnClickListener{
            showBottomDialog()
        }

        val yourView = findViewById<View>(R.id.frame_layout)

        val gradientDrawable = GradientDrawable(
            GradientDrawable.Orientation.TOP_BOTTOM,
            intArrayOf(
                ContextCompat.getColor(this, R.color.dark_color_start),
                ContextCompat.getColor(this, R.color.dark_color_middle),
                ContextCompat.getColor(this, R.color.dark_color_end),
                ContextCompat.getColor(this, R.color.fragment_bcgr_night)
            )
        )
        gradientDrawable.setDither(true)
        yourView.background = gradientDrawable
    }

    private  fun replaceFragment(fragment: Fragment) {
        val fragmentManager = getSupportFragmentManager();
        val fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.frame_layout, fragment);
        fragmentTransaction.commit();
    }

    private fun showBottomDialog() {
        val dialog = Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.bottom_sheet_layout);

        //val videoLayout = dialog.findViewById(R.id.layoutVideo);
        //val shortsLayout = dialog.findViewById(R.id.layoutShorts);
        //val liveLayout = dialog.findViewById(R.id.layoutLive);
        val cancelButton:ImageView = dialog.findViewById(R.id.cancelButton);

        /*videoLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
                Toast.makeText(MainActivity.this,"Upload a Video is clicked",Toast.LENGTH_SHORT).show();

            }
        });

        shortsLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
                Toast.makeText(MainActivity.this,"Create a short is Clicked",Toast.LENGTH_SHORT).show();

            }
        });

        liveLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
                Toast.makeText(MainActivity.this,"Go live is Clicked",Toast.LENGTH_SHORT).show();

            }
        });*/

        cancelButton.setOnClickListener(View.OnClickListener() {
            @Override
            fun onClick(view : View) {
                dialog.dismiss();
            }
        });

        dialog.show();
        dialog.getWindow()?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.getWindow()?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow()?.getAttributes()?.windowAnimations = R.style.DialogAnimation;
        dialog.getWindow()?.setGravity(Gravity.BOTTOM);
    }
    fun setTheme(){
        val sharedPreferences = getSharedPreferences("MODE", Context.MODE_PRIVATE)
        if (sharedPreferences.getBoolean("night", false)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            window.statusBarColor = ContextCompat.getColor(this, R.color.statusBar_night)
            getWindow().setStatusBarColor(getResources().getColor(R.color.panel_night))
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            window.statusBarColor = ContextCompat.getColor(this, R.color.statusBar_day)
            getWindow().setStatusBarColor(getResources().getColor(R.color.panel_light))
        }
    }
}