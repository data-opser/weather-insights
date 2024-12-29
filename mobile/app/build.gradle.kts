plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.plugin)
}

android {
    namespace = "com.vladislav.weather_insights"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.vladislav.weather_insights"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures{
        viewBinding = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.worker)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.justifiedtextview)
    implementation(libs.retrofit)
    implementation(libs.converterGson)
    implementation(platform(libs.google.firebase.bom))
    implementation(libs.google.firebase)
    implementation(libs.httplogginginterceptor)
    implementation(libs.dotsindicator)
    implementation(libs.androidx.ui.graphics.android)
    implementation(libs.firebase.messaging)
    implementation(libs.firebase.auth.ktx)
    implementation(libs.play.services.auth)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}