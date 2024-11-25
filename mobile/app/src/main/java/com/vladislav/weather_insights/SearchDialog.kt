package com.vladislav.weather_insights

import android.app.Dialog
import android.content.Context
import android.content.res.ColorStateList
import android.util.TypedValue
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout


class SearchDialog (private val activity: MainActivity){
    fun changeActiveProcess(dialog: Dialog) {
        val searchLinearLayout = dialog.findViewById<LinearLayout>(R.id.searchLinearLayout)
        val zoomImageView = dialog.findViewById<ImageView>(R.id.zoomImageView)
        val editText = dialog.findViewById<EditText>(R.id.searchEditText)

        dialog.findViewById<LinearLayout>(R.id.bottomNavLayout).setOnClickListener {
            if (editText.isFocused) {
                editText.clearFocus()
                hideKeyboard(editText)
            }
        }

        editText.setOnFocusChangeListener { _, hasFocus ->
            run {
                val typedValue = TypedValue()
                if (hasFocus) {
                    activity.theme.resolveAttribute(R.attr.searchBgActiveColor, typedValue, true)
                    searchLinearLayout.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                    activity.theme.resolveAttribute(R.attr.searchIconActiveColor, typedValue, true)
                    zoomImageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                    activity.theme.resolveAttribute(R.attr.searchTextActiveColor, typedValue, true)
                    editText.setTextColor(ColorStateList.valueOf(typedValue.data))
                } else {
                    activity.theme.resolveAttribute(R.attr.searchBgInertColor, typedValue, true)
                    searchLinearLayout.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                    activity.theme.resolveAttribute(R.attr.searchIconInertColor, typedValue, true)
                    zoomImageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                    activity.theme.resolveAttribute(R.attr.searchTextInertColor, typedValue, true)
                    editText.setTextColor(ColorStateList.valueOf(typedValue.data))
                }
            }
        }
    }

    private fun hideKeyboard(view: View) {
        val inputMethodManager = activity.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }
}