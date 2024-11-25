package com.vladislav.weather_insights

import android.app.Activity
import android.content.Context
import android.content.res.ColorStateList
import android.os.Bundle
import android.util.TypedValue
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.cardview.widget.CardView

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [ProfileFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class ProfileFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null

    private lateinit var myActivity: Activity
    private lateinit var googleLinearLayout: LinearLayout
    private lateinit var loginButton: Button
    private lateinit var profileFrameLayout: FrameLayout

    private lateinit var emailImageView: ImageView
    private lateinit var pswdImageView: ImageView
    private lateinit var emailEditText: EditText
    private lateinit var pswdEditText: EditText
    private lateinit var emailCardView: CardView
    private lateinit var pswdCardView: CardView

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
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment PremiumFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            ProfileFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        myActivity = requireActivity()
        profileFrameLayout = view.findViewById(R.id.profileFrameLayout)
        googleLinearLayout = view.findViewById(R.id.googleLinearLayout)
        loginButton = view.findViewById(R.id.loginButton)

        emailImageView  = view.findViewById(R.id.emailImageView)
        pswdImageView  = view.findViewById(R.id.pswdImageView)
        emailEditText = view.findViewById(R.id.emailEditText)
        pswdEditText = view.findViewById(R.id.pswdEditText)
        emailCardView = view.findViewById(R.id.emailCardView)
        pswdCardView = view.findViewById(R.id.pswdCardView)

        profileFrameLayout.setOnClickListener {
            if (emailEditText.isFocused) {
                emailEditText.clearFocus()
                hideKeyboard(emailEditText)
            }
            if (pswdEditText.isFocused) {
                pswdEditText.clearFocus()
                hideKeyboard(pswdEditText)
            }
        }

        setOnFocusChangeListener(emailCardView, emailImageView, emailEditText)
        setOnFocusChangeListener(pswdCardView, pswdImageView, pswdEditText)
    }

    private fun setOnFocusChangeListener(cardView: CardView, imageView: ImageView, editText: EditText) {
        editText.setOnFocusChangeListener { _, hasFocus ->
            run {
                val typedValue = TypedValue()
                if (hasFocus) {
                    myActivity.theme.resolveAttribute(R.attr.profileBgActiveColor, typedValue, true)
                    cardView.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                    myActivity.theme.resolveAttribute(R.attr.profileIconActiveColor, typedValue, true)
                    imageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                    myActivity.theme.resolveAttribute(R.attr.profileTextActiveColor, typedValue, true)
                    editText.setTextColor(ColorStateList.valueOf(typedValue.data))

                    myActivity.theme.resolveAttribute(R.attr.profileTextHintActiveColor, typedValue, true)
                    editText.setHintTextColor(ColorStateList.valueOf(typedValue.data))
                } else {
                    myActivity.theme.resolveAttribute(R.attr.profileBgInertColor, typedValue, true)
                    cardView.backgroundTintList = ColorStateList.valueOf(typedValue.data)

                    myActivity.theme.resolveAttribute(R.attr.profileIconInertColor, typedValue, true)
                    imageView.imageTintList = ColorStateList.valueOf(typedValue.data)

                    myActivity.theme.resolveAttribute(R.attr.profileTextInertColor, typedValue, true)
                    editText.setTextColor(ColorStateList.valueOf(typedValue.data))

                    myActivity.theme.resolveAttribute(R.attr.profileTextHintInertColor, typedValue, true)
                    editText.setHintTextColor(ColorStateList.valueOf(typedValue.data))
                }
            }
        }
    }

    private fun hideKeyboard(view: View) {
        val inputMethodManager = myActivity.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
    }
}