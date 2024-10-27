/*public void setTheme(){
    SharedPreferences sharedPreferences = getSharedPreferences("MODE", Context.MODE_PRIVATE);
    if (sharedPreferences.getBoolean("night", false)) {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        getWindow().setStatusBarColor(getResources().getColor(R.color.panel_night));
    } else {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        getWindow().setStatusBarColor(getResources().getColor(R.color.panel_light));
    }
}

    <style name="Background">
        <item name="android:background">@color/background_light</item>
    </style>
    <style name="NavHeader">
        <item name="android:background">@color/background_light</item>
    </style>
    <style name="Text">
        <item name="android:textColor">@color/text_light</item>
    </style>
    <style name="Text2">
        <item name="android:textColor">@color/text_light_gray</item>
    </style>
    <style name="Text3">
        <item name="android:textColor">@color/white</item>
    </style>
    <style name="Button">
        <item name="android:backgroundTint">@color/button_bgTint_light</item>
        <item name="android:textColor">@color/button_text_light</item>
    </style>
    <style name="Button_Exchange">
        <item name="android:src">@drawable/exchange_light</item>
    </style>
    <style name="Button_System">
        <item name="android:backgroundTint">@color/button_system_light</item>
        <item name="android:textColor">@color/black</item>
    </style>
    <style name="EditText">
        <item name="android:backgroundTint">@color/text_light</item>
        <item name="android:textColor">@color/text_light</item>
        <item name="android:textColorHint">@color/text_hint_light</item>
    </style>
    <style name="Toolbar" parent="ThemeOverlay.AppCompat.Dark.ActionBar">
        <item name="android:background">@color/lite_maroon</item>
        <item name="titleTextColor">@color/white</item>
    </style>
    <style name="NavigationView">
        <item name="android:background">@color/background_light</item>
        <item name="titleTextColor">@color/white</item>
        <item name="itemIconTint">@color/lite_maroon</item>
        <item name="itemTextColor">@color/lite_maroon</item>
    </style>

    <style name="TextImagePhone">
        <item name="android:textColor">@color/text_light</item>
        <item name="drawableStartCompat">@drawable/phone</item>
    </style>
    <style name="TextImageEmail">
        <item name="android:textColor">@color/text_light</item>
        <item name="drawableStartCompat">@drawable/email</item>
    </style>
    <style name="TextImageClock">
        <item name="android:textColor">@color/text_light</item>
        <item name="drawableStartCompat">@drawable/clock</item>
    </style>
    <style name="Request">
        <item name="android:background">@drawable/frame_request_light</item>
    </style>
    <style name="bg_head">
        <item name="android:background">@drawable/rectangle_bg_light</item>
    </style>



private SharedPreferences.Editor editor;
SwitchCompat switchNotification;
private final int REQUEST_CODE_POST_NOTIFICATIONS = 123;
private int userID;

public SettingsFragment(int userID){
    this.userID = userID;
}
@Override
public View onCreateView(LayoutInflater inflater, ViewGroup container,
                         Bundle savedInstanceState) {
    activity = (DrawerLayoutActivity) getActivity();
    return inflater.inflate(R.layout.fragment_settings, container, false);
}

@Override
public void onViewCreated(View view, Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);

    Button buttonChangePassword = view.findViewById(R.id.change_password_button);
    SwitchCompat switchTheme = view.findViewById(R.id.switch_theme);
    switchNotification = view.findViewById(R.id.switch_notification);
    sharedPreferences = activity.getSharedPreferences("MODE", Context.MODE_PRIVATE);

    editor = sharedPreferences.edit();
    switchTheme.setChecked(sharedPreferences.getBoolean("night", false));
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.POST_NOTIFICATIONS)
                != (sharedPreferences.getBoolean("notification", false) ? 1 : 0)) {
            editor.putBoolean("night", ContextCompat.checkSelfPermission(activity, Manifest.permission.POST_NOTIFICATIONS) == 1);
        }
    }

    switchNotification.setChecked(sharedPreferences.getBoolean("notification", false));

    switchTheme.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            if (isChecked) {
                editor.putBoolean("night", true);
            } else {
                editor.putBoolean("night", false);
            }
            editor.apply();
            activity.setTheme();
        }
    });
    switchNotification.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            if (isChecked) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    if (ContextCompat.checkSelfPermission(activity, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQUEST_CODE_POST_NOTIFICATIONS);
                    } else {
                        editor.putBoolean("notification", true);
                    }
                }
            } else {
                editor.putBoolean("notification", false);
            }
            editor.apply();
        }
    });
    buttonChangePassword.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            FragmentTransaction fragmentTransaction = activity.getSupportFragmentManager().beginTransaction();
            fragmentTransaction.replace(R.id.fragment_container, new ChangePasswordFragment(userID), "CHANGEPASSWORD_FRAGMENT");
            fragmentTransaction.addToBackStack(null);
            fragmentTransaction.commit();
        }
    });
}

public void showDialog(String textHead, String message) {
    AlertDialog.Builder builder = new AlertDialog.Builder(activity);
    builder.setTitle(textHead)
            .setMessage(message)
            .setCancelable(false)
            .setPositiveButton("Okay", null);
    AlertDialog dialog = builder.create();
    dialog.show();
}
}*/