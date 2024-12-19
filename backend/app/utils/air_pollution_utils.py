class PollutionThresholds:

    @classmethod
    def determine_pollution_level(cls, pollutant, value):
        determined_level = "Good"
        for limit, level in cls.thresholds.get(pollutant, []):
            if value > limit:
                determined_level = level
        return determined_level

    @classmethod
    def get_pollution_message(cls, pollutant, level, value):

        advice_message = cls.messages.get(pollutant, {}).get(
            level,
            f"The level of {pollutant} is elevated, but no specific message is defined."
        )
        return f"The air currently has elevated {pollutant} levels ({value} μg/m3). {advice_message}" if level != "Good" else ""

    thresholds = {
        "SO2": [(20, "Fair"), (80, "Moderate"), (250, "Poor"), (350, "Very Poor")],
        "NO2": [(40, "Fair"), (70, "Moderate"), (150, "Poor"), (200, "Very Poor")],
        "CO": [(4400, "Fair"), (9400, "Moderate"), (12400, "Poor"), (15400, "Very Poor")]
    }

    messages = {
        "SO2": {
            "Fair": "Currently, SO2 levels are slightly elevated. Sensitive groups should limit outdoor activities.",
            "Moderate": "SO2 levels are moderate. Avoid outdoor physical activity.",
            "Poor": "SO2 levels are high. Stay indoors and keep windows closed.",
            "Very Poor": "SO2 levels are critically high. Remain indoors and use air purifiers if possible."
        },
        "NO2": {
            "Fair": "NO2 levels are slightly elevated. Consider limiting time outdoors, especially for sensitive groups.",
            "Moderate": "Moderate levels of NO2 detected. Reduce outdoor exposure.",
            "Poor": "High NO2 levels. It is advisable to stay indoors.",
            "Very Poor": "Critically high NO2 levels. Avoid going outside and seek medical advice if needed."
        },
        "CO": {
            "Fair": "CO levels are slightly elevated. Sensitive groups should limit outdoor activities.",
            "Moderate": "Moderate CO levels detected. Avoid prolonged outdoor activities.",
            "Poor": "High CO levels. Stay indoors and ventilate closed spaces.",
            "Very Poor": "Critically high CO levels. Avoid all outdoor activities and ensure proper ventilation indoors."
        }
    }
