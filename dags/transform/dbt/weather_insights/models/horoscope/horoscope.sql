{{
  config(
    post_hook="{{ set_primary_key('row_id') }}"
  )
}}

select
    row_number() over () as row_id,

    data__daily_prediction__sign_id as sign_id,
    data__daily_prediction__sign_name as sign_name,

    data__daily_prediction__prediction as prediction,
    data__daily_prediction__date as prediction_date
from {{ source('horoscope_data', 'horoscope') }} cw
