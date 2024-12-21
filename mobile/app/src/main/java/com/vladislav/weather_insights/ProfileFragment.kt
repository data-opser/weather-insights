package com.vladislav.weather_insights

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences.Editor
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.util.TypedValue
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.cardview.widget.CardView
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import com.vladislav.weather_insights.Interface.GoogleServices
import com.vladislav.weather_insights.Interface.WeatherServices
import com.vladislav.weather_insights.Objects.Cities
import com.vladislav.weather_insights.Retrofit.GoogleAPI
import com.vladislav.weather_insights.Retrofit.WeatherAPI
import com.vladislav.weather_insights.Objects.User
import com.vladislav.weather_insights.Objects.Weather
import com.vladislav.weather_insights.databinding.FragmentProfileBinding
import com.vladislav.weather_insights.model.LoginRequest
import com.vladislav.weather_insights.model.UserCityData
import com.vladislav.weather_insights.model.UserProfile
import com.vladislav.weather_insights.model.WeatherCityData
import com.vladislav.weather_insights.model.WeatherDay
import com.vladislav.weather_insights.model.WeatherDayData
import com.vladislav.weather_insights.model.WeatherHour
import com.vladislav.weather_insights.model.WeatherHourData
import com.vladislav.weather_insights.model.WeatherLogin
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

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
    private val RC_SIGN_IN = 1000
    private lateinit var binding: FragmentProfileBinding
    private lateinit var myActivity: Activity
    private lateinit var googleSignInClient: GoogleSignInClient
    private lateinit var editor: Editor
    private lateinit var GoogleAuth: GoogleServices
    private lateinit var WeatherApi: WeatherServices
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WeatherApi = WeatherAPI.retrofitService
        GoogleAuth = GoogleAPI.retrofitService
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        editor = requireActivity().getSharedPreferences("MODE", Context.MODE_PRIVATE).edit()
        // Inflate the layout for this fragment
        binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
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

        if(User.Token != null){ //тут якщо у нас користувач вже залогінений був, то одразу профіль видаєм, нікіта
            setProfileLayout()
        }

        binding.apply {
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

            loginButton.setOnClickListener{
                WeatherApi.login(LoginRequest(emailEditText.text.toString(),pswdEditText.text.toString())).enqueue(object : Callback<WeatherLogin>{
                    override fun onFailure(call: Call<WeatherLogin>, t: Throwable) {
                        Log.d("Error","Error")
                    }

                    override fun onResponse(call: Call<WeatherLogin>, response: Response<WeatherLogin>) {
                        if (response.isSuccessful) {
                            response.body()?.let {
                                User.Token = it.token
                                WeatherApi.getUserCities().enqueue(object : Callback<UserCityData>{
                                    override fun onResponse(call: Call<UserCityData>, response: Response<UserCityData>) {
                                        if (response.isSuccessful){
                                            response.body()?.let { body->
                                                User.UserCities = body
                                                editor.putString("Token", it.token)
                                                editor.apply()
                                                for(cityId in User.UserCities!!.user_cities){
                                                    WeatherApi.getWeatherFourDays(cityId).enqueue(object : Callback<ArrayList<WeatherDayData>>{
                                                        override fun onFailure(call: Call<ArrayList<WeatherDayData>>, t: Throwable) {
                                                            Log.d("Error","Error")
                                                        }

                                                        override fun onResponse(call: Call<ArrayList<WeatherDayData>>, response: Response<ArrayList<WeatherDayData>>) {
                                                            if (response.isSuccessful) {
                                                                response.body()?.let { dayBody ->
                                                                    WeatherApi.getWeatherDay(cityId, dayBody[0].date).enqueue(object : Callback<ArrayList<WeatherHourData>>{
                                                                        override fun onFailure(call: Call<ArrayList<WeatherHourData>>, t: Throwable) {
                                                                            Log.d("Error","Error")
                                                                        }

                                                                        override fun onResponse(call: Call<ArrayList<WeatherHourData>>, response: Response<ArrayList<WeatherHourData>>) {
                                                                            if(response.isSuccessful){
                                                                                response.body()?.let { hourBody ->
                                                                                    Weather.setNewWeatherCityData(cityId, WeatherCityData(dayBody, hourBody))

                                                                                }
                                                                            }
                                                                            else{
                                                                                Log.e("Response error", "Response error: ${response.errorBody()?.string()}")
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            else{
                                                                Log.e("Response error", "Response error: ${response.errorBody()?.string()}")
                                                            }
                                                        }
                                                    })
                                                }
                                                setProfileLayout()
                                            }
                                        }
                                    }

                                    override fun onFailure(call: Call<UserCityData>, throwable: Throwable) {
                                        TODO("Not yet implemented")
                                    }
                                })
                            }
                        } else {
                            authErrorTextView.visibility = View.VISIBLE
                            Log.e("AuthError", "Response error: ${response.errorBody()?.string()}")
                        }
                    }
                })
            }

            goEditButton.setOnClickListener{ // тут перекинути на сторінку зміни інфи на сайті
                googleSignInClient.signOut()
            }
            googleButton.setOnClickListener {
                val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestServerAuthCode("", true)
                    .requestEmail()
                    .build()

                googleSignInClient = GoogleSignIn.getClient(requireActivity(), gso)

                signInWithGoogle()
                setProfileLayout()
            }
        }
    }

    private fun setProfileLayout() = with(binding){
        profileTitle.visibility = View.GONE
        loginLinearLayout.visibility = View.GONE
        if(User.Profile == null){
            WeatherApi.profile().enqueue(object : Callback<UserProfile>{
                override fun onFailure(call: Call<UserProfile>, t: Throwable) {
                    Log.d("Error","Error")
                }

                override fun onResponse(call: Call<UserProfile>, response: Response<UserProfile>) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            User.Profile = it
                            emailTextView.text = User.Profile?.email
                            nameTextView.text = User.Profile?.name
                            birthDateText.text = User.Profile?.birthday
                            locationTextView.text = Cities.getCityIds[User.UserCities!!.main_city]!!.city + ", " + Cities.getCityIds[User.UserCities!!.main_city]!!.country

                        }
                    } else {
                    }
                }
            })
        }
        else{
            emailTextView.text = User.Profile?.email
            nameTextView.text = User.Profile?.name
            birthDateText.text = User.Profile?.birthday
            locationTextView.text = Cities.getCityIds[User.UserCities!!.main_city]!!.city + ", " + Cities.getCityIds[User.UserCities!!.main_city]!!.country
        }

        profileCardView.visibility = View.VISIBLE
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

    private fun signInWithGoogle() {
        val signInIntent: Intent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task: Task<GoogleSignInAccount> = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val account: GoogleSignInAccount = completedTask.getResult(ApiException::class.java)

            // Получаем authCode для обмена на токены
            val authCode = account.serverAuthCode
//            GoogleAuth.getGoogleTokens(account.serverAuthCode,"","", "com.vladislav.weather_insights:/").enqueue(object : Callback<GoogleResponse> {
//                override fun onFailure(call: Call<GoogleResponse>, t: Throwable) {
//                    Log.d("Error","Error")
//                }
//
//                override fun onResponse(call: Call<GoogleResponse>, response: Response<GoogleResponse>) {
//                    if (response.isSuccessful) {
//                        response.body()?.let {
//                            Log.d("refresh", it.refresh_token ?: "No refresh token")
//                            Log.d("access", it.access_token)
//                        }
//                    } else {
//                        Log.e("GoogleAuthError", "Response error: ${response.errorBody()?.string()}")
//                    }
//                }
//            })


        } catch (e: ApiException) {
            Log.w("GoogleSignIn", "signInResult:failed code=" + e.statusCode)
            Toast.makeText(requireContext(), "Ошибка авторизации: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }
}