from firebase_admin import auth


class FirebaseUtils:
    def verify_token(firebase_uid):
        try:
            decoded_token = auth.verify_id_token(firebase_uid)
            return decoded_token
        except auth.InvalidIdTokenError:
            return None
