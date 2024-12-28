package com.vladislav.weather_insights

import android.app.Activity
import android.app.PendingIntent
import android.content.ContentValues.TAG
import android.content.Context
import android.content.Intent
import android.content.IntentSender
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
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.cardview.widget.CardView
import com.google.android.gms.auth.api.identity.GetSignInIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.identity.SignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.OnCompleteListener
import com.google.android.gms.tasks.Task
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.auth
import com.google.firebase.messaging.messaging
import com.vladislav.weather_insights.GoogleSignInFragment.Companion
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
import com.vladislav.weather_insights.model.UserCityRequest
import com.vladislav.weather_insights.model.UserDevice
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
class ProfileFragment : BaseFragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null
    private val RC_SIGN_IN = 1000

    private val signInLauncher = registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
        handleSignInResult(result.data)
    }

    private lateinit var auth: FirebaseAuth
    private lateinit var binding: FragmentProfileBinding
    private lateinit var myActivity: Activity
    private lateinit var editor: Editor
    private lateinit var GoogleAuth: GoogleServices
    private lateinit var WeatherApi: WeatherServices
    private lateinit var signInClient: SignInClient
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
        signInClient = Identity.getSignInClient(requireContext())
        auth = Firebase.auth
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
                                Firebase.messaging.token.addOnCompleteListener(
                                    OnCompleteListener { task ->
                                        if (!task.isSuccessful) {
                                            Log.w(TAG, "Fetching FCM registration token failed", task.exception)
                                            return@OnCompleteListener
                                        }

                                        // Get new FCM registration token
                                        val token = task.result

                                        WeatherApi.addUserDevice(UserDevice(token, "Iphone 24 ultra pro max terabyte")).enqueue(object : Callback<UserCityRequest>{
                                            override fun onResponse(
                                                call: Call<UserCityRequest>,
                                                responce: Response<UserCityRequest>
                                            ) {

                                            }

                                            override fun onFailure(
                                                call: Call<UserCityRequest>,
                                                throwable: Throwable
                                            ) {

                                            }
                                        })

                                        Log.d(TAG, token)
                                    },
                                )
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

            }
            googleButton.setOnClickListener {
                val signInRequest = GetSignInIntentRequest.builder()
                    .setServerClientId(getString(R.string.default_web_client_id))
                    .build()

                signInClient.getSignInIntent(signInRequest)
                    .addOnSuccessListener { pendingIntent ->
                        launchSignIn(pendingIntent)
                    }
                    .addOnFailureListener { e ->
                        Log.e(TAG, "Google Sign-in failed", e)
                    }
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
                            try {
                                locationTextView.text = Cities.getCityIds[User.UserCities!!.main_city]!!.city + ", " + Cities.getCityIds[User.UserCities!!.main_city]!!.country
                            } catch (e: Exception) {

                            }


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
            try {
                locationTextView.text = Cities.getCityIds[User.UserCities!!.main_city]!!.city + ", " + Cities.getCityIds[User.UserCities!!.main_city]!!.country
            } catch (e: Exception) {

            }
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



    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
        }
    }
    private fun launchSignIn(pendingIntent: PendingIntent) {
        try {
            val intentSenderRequest = IntentSenderRequest.Builder(pendingIntent)
                .build()
            signInLauncher.launch(intentSenderRequest)
        } catch (e: IntentSender.SendIntentException) {
            Log.e(TAG, "Couldn't start Sign In: ${e.localizedMessage}")
        }
    }
    private fun handleSignInResult(data: Intent?) {
        // Result returned from launching the Sign In PendingIntent
        try {
            // Google Sign In was successful, authenticate with Firebase
            val credential = signInClient.getSignInCredentialFromIntent(data)
            val idToken = credential.googleIdToken
            if (idToken != null) {
                Log.d(TAG, "firebaseAuthWithGoogle: ${credential.id}")
                firebaseAuthWithGoogle(idToken)
            } else {
                // Shouldn't happen.
                Log.d(TAG, "No ID token!")
            }
        } catch (e: ApiException) {
            // Google Sign In failed, update UI appropriately
            Log.w(TAG, "Google sign in failed", e)
        }
    }
    private fun firebaseAuthWithGoogle(idToken: String) {
        showProgressBar()
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(requireActivity()) { task ->
                if (task.isSuccessful) {
                    // Sign in success, update UI with the signed-in user's information
                    Log.d(TAG, "signInWithCredential:success")
                    val user = auth.currentUser
                } else {
                    // If sign in fails, display a message to the user.
                    Log.w(TAG, "signInWithCredential:failure", task.exception)
                }

                hideProgressBar()
            }
    }
}