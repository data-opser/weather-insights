from datetime import date
from app.utils import ErrorHandler
import requests

class GoogleUtils:

    @staticmethod
    def fetch_google_birthday(access_token):
        headers = {'Authorization': f'Bearer {access_token}'}

        try:
            response = requests.get('https://people.googleapis.com/v1/people/me?personFields=birthdays',
                                    headers=headers)
            response.raise_for_status()

            birthday_info = response.json().get('birthdays', [{}])[0].get('date', {})

            return date(
                birthday_info.get('year', 1900),
                birthday_info.get('month', 1),
                birthday_info.get('day', 1)
            )

        except requests.exceptions.RequestException as e:
            return ErrorHandler.handle_error(
                e,
                message="Request failed while fetching birthday",
                status_code=500
            )

    @staticmethod
    def get_fresh_google_access_token(user, google):

        if not user.google_refresh_token:
            raise ValueError("Refresh token not available for the user.")

        refresh_token = user.get_refresh_token()

        try:
            data = {
                "client_id": google.client_id,
                "client_secret": google.client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token"
            }

            response = requests.post(google.access_token_url, data=data)
            response.raise_for_status()

            token_data = response.json()
            access_token = token_data.get('access_token')

            if not access_token:
                raise ErrorHandler.handle_error(
                    None,
                    message="Failed to obtain a new access token.",
                    status_code=500
                )

            return access_token

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except requests.exceptions.RequestException as e:
            return ErrorHandler.handle_error(
                e,
                message="Request failed while fetching google token",
                status_code=500
            )
