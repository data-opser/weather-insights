{{
  config(
    post_hook="{{ set_primary_key('row_id') }}"
  )
}}

select
    row_number() over () as row_id,

    cww.main as weather,
    cww.description as weather_description,

    to_timestamp(cw.dt) as weather_time,

    seed.id as city_id,
    cw.name as city,
    cw.sys__country as country_ISO,

    cw.coord__lon as longitude,
    cw.coord__lat as latitude,

    cw.main__temp - 273.15 as temperature,
    cw.main__feels_like - 273.15 as temperature_feels_like,

    cw.main__pressure as pressure_sea_level,
    cw.main__grnd_level as pressure_ground_level,

    cw.main__humidity as humidity,

    cw.visibility as visibility,

    cw.wind__speed as wind_speed,
    cw.wind__deg as wind_degree,
    cw.wind__gust as wind_gust,

    cw.clouds__all as clouds_percent,
    cw.rain___1h as rain_precipitation,
    cw.snow___1h as snow_precipitation,

    apl.components__co as air_pollution_co,
    apl.components__no as air_pollution_no,
    apl.components__no2 as air_pollution_no2,
    coalesce(apl.components__o3, apl.components__o3__v_double) as air_pollution_o3,
    apl.components__so2 as air_pollution_so2,
    apl.components__pm2_5 as air_pollution_pm2_5,
    apl.components__pm10 as air_pollution_pm10,
    apl.components__nh3 as air_pollution_nh3,

    to_timestamp(cw.sys__sunrise + cw.timezone) as sunrise_time_local,
    to_timestamp(cw.sys__sunset + cw.timezone) as sunset_time_local,

    to_timestamp(cw.sys__sunrise) as sunrise_time_utc,
    to_timestamp(cw.sys__sunset) as sunset_time_utc

from {{ source('weather_data', 'current_weather') }} cw
left join {{ source('weather_data', 'current_weather__weather') }} cww
    on cw._dlt_id = cww._dlt_parent_id
left join {{ source('weather_data', 'air_pollution') }} ap
    on cw.coord__lon = ap.coord__lon
    and cw.coord__lat = ap.coord__lat
left join {{ source('weather_data', 'air_pollution__list' ) }} apl
    on ap._dlt_id = apl._dlt_parent_id
left join {{ ref('cities') }} seed
    on cw.coord__lon = seed.lng
    and cw.coord__lat = seed.lat