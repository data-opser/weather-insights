package com.vladislav.weather_insights

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.SharedPreferences.Editor
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.CompoundButton
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatDelegate
import androidx.appcompat.widget.SwitchCompat
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [SettingsFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class SettingsFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var switchNotify: SwitchCompat
    private lateinit var switchTheme: SwitchCompat
    private lateinit var signLayout: LinearLayout
    private lateinit var signText: TextView
    private lateinit var editor: Editor
    private lateinit var myActivity: Activity
    private lateinit var pushNotificationPermissionLauncher: ActivityResultLauncher<String>

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
        return inflater.inflate(R.layout.fragment_settings, container, false)
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        myActivity = requireActivity()
        sharedPreferences = myActivity.getSharedPreferences("MODE", Context.MODE_PRIVATE)
        editor = sharedPreferences.edit()
        switchNotify = view.findViewById(R.id.switchNotify)
        switchTheme = view.findViewById(R.id.switchTheme)
        signLayout = view.findViewById(R.id.signLayout)
        signText = view.findViewById(R.id.signText)
        switchTheme.setChecked(sharedPreferences.getBoolean("isNight", false))
        switchNotify.setChecked(sharedPreferences.getBoolean("notification", false))
        signText.text = sharedPreferences.getString("sign", "none")
        pushNotificationPermissionLauncher = registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                // Дозвіл надано, можна надсилати сповіщення
                editor.putBoolean("notification", true)
            } else {
                // Дозвіл відхилено
                switchNotify.isChecked = false
                editor.putBoolean("notification", false)
                showSettingsDialog()
            }
            editor.apply()
        }


        switchTheme.setOnCheckedChangeListener(
            object : CompoundButton.OnCheckedChangeListener {
                override fun onCheckedChanged(buttonView: CompoundButton, isChecked: Boolean) {
                    changeTheme(isChecked)
                }
            })

        switchNotify.setOnCheckedChangeListener(
            object : CompoundButton.OnCheckedChangeListener {
                override fun onCheckedChanged(buttonView: CompoundButton, isChecked: Boolean) {
                    changeNotify(isChecked)
                }
            })
        signLayout.setOnClickListener{
            showBottomDialog()
        }
    }

    fun changeNotify(isChecked: Boolean){
        if (isChecked) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (ContextCompat.checkSelfPermission(
                        myActivity,
                        Manifest.permission.POST_NOTIFICATIONS
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    pushNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                } else {
                    editor.putBoolean("notification", true)
                }
            }
        } else {
            editor.putBoolean("notification", false)
        }
        editor.apply()
    }
    fun changeTheme(isChecked: Boolean) {
        if (isChecked) {
            editor.putBoolean("isNight", true)
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        } else {
            editor.putBoolean("isNight", false)
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        }
        editor.apply()
    }

    private fun showSettingsDialog() {
        AlertDialog.Builder(myActivity)
            .setTitle("Notification permission")
            .setMessage("To receive notifications, please enable notifications in your settings")
            .setPositiveButton("Settings") { _, _ ->
                val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    // Для Android 8.0 (API 26) та новіших
                    Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                        putExtra(Settings.EXTRA_APP_PACKAGE, myActivity.packageName)
                    }
                } else {
                    // Для Android 7.0 (API 24) та Android 7.1 (API 25)
                    Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                        data = Uri.parse("package:${myActivity.packageName}")
                    }
                }
                startActivity(intent)
            }
            .setNegativeButton("Close", null)
            .show()
    }

    private fun showBottomDialog() {
        val dialog = BottomSheetDialog(requireContext())
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setContentView(R.layout.bottom_sign_layout)
        val bottomSheet = dialog.findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)
        if (bottomSheet != null) {
            val behavior = BottomSheetBehavior.from(bottomSheet)
            behavior.state = BottomSheetBehavior.STATE_EXPANDED
            behavior.skipCollapsed = true
        }

        val signLayouts = listOf(
            R.id.signAriesLayout to "Aries",
            R.id.signTaurusLayout to "Taurus",
            R.id.signGeminiLayout to "Gemini",
            R.id.signCancerLayout to "Cancer",
            R.id.signLeoLayout to "Leo",
            R.id.signVirgoLayout to "Virgo",
            R.id.signLibraLayout to "Libra",
            R.id.signScorpioLayout to "Scorpio",
            R.id.signSagittariusLayout to "Sagittarius",
            R.id.signCapricornLayout to "Capricorn",
            R.id.signAquariusLayout to "Aquarius",
            R.id.signPiscesLayout to "Pisces"
        )

        signLayouts.forEach { (layout, signName) ->
            setSign(dialog, layout, signName)
        }

        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.window?.attributes?.windowAnimations = R.style.DialogAnimation
        dialog.window?.setGravity(Gravity.BOTTOM)
    }

    private fun setSign(dialog: BottomSheetDialog, layoutId: Int, signName: String){
        val sign = dialog.findViewById<LinearLayout>(layoutId)

        sign?.setOnClickListener{
            dialog.cancel()
            signText.text = signName
            editor.putString("sign", signName)
            editor.apply()
        }
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment SettingsFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            SettingsFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}