{{
  config(
    post_hook="{{ set_primary_key('row_id') }}"
  )
}}


with air_pollution as (
    select * from {{ source('weather_data', 'air_pollution_forecast' ) }} apf
    left join {{ source('weather_data', 'air_pollution_forecast__list' ) }} apfl
        on apf._dlt_id = apfl._dlt_parent_id
)

select
    row_number() over () as row_id,

    wflw.main as weather,
    wflw.description as weather_description,

    to_timestamp(wfl.dt) as weather_time,

    seed.id as city_id,
    wf.city__name as city,
    wf.city__country as country_ISO,

    wf.city__coord__lon as longitude,
    wf.city__coord__lat as latitude,

    wfl.main__temp - 273.15 as temperature,
    wfl.main__feels_like - 273.15 as temperature_feels_like,

    wfl.main__pressure as pressure_sea_level,
    wfl.main__grnd_level as pressure_ground_level,

    wfl.main__humidity as humidity,

    wfl.visibility as visibility,

    wfl.wind__speed as wind_speed,
    wfl.wind__deg as wind_degree,
    wfl.wind__gust as wind_gust,

    wfl.clouds__all as clouds_percent,
    wfl.rain___1h as rain_precipitation,
    wfl.snow___1h as snow_precipitation,

    ap.components__co as air_pollution_co,
    ap.components__no as air_pollution_no,
    ap.components__no2 as air_pollution_no2,
    ap.components__o3 as air_pollution_o3,
    ap.components__so2 as air_pollution_so2,
    ap.components__pm2_5 as air_pollution_pm2_5,
    ap.components__pm10 as air_pollution_pm10,
    ap.components__nh3 as air_pollution_nh3,

    to_timestamp(wf.city__sunrise + wf.city__timezone) as sunrise_time_local,
    to_timestamp(wf.city__sunset + wf.city__timezone) as sunset_time_local,

    to_timestamp(wf.city__sunrise) as sunrise_time_utc,
    to_timestamp(wf.city__sunset) as sunset_time_utc

from {{ source('weather_data', 'weather_forecast_hourly') }} wf
left join {{ source('weather_data', 'weather_forecast_hourly__list') }} wfl
    on wf._dlt_id = wfl._dlt_parent_id
left join {{ source('weather_data', 'weather_forecast_hourly__list__weather') }} wflw
    on wfl._dlt_id = wflw._dlt_parent_id
left join air_pollution ap
    on wf.city__coord__lon = ap.coord__lon
    and wf.city__coord__lat = ap.coord__lat
    and wfl.dt = ap.dt
left join {{ ref('cities') }} seed
    on wf.city__coord__lon = seed.lng
    and wf.city__coord__lat = seed.lat