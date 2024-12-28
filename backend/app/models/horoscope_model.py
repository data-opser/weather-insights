import html
from app import db
from sqlalchemy import Column, String, BigInteger
from app.utils import ErrorHandler
from flask import jsonify


class Horoscope(db.Model):
    __tablename__ = 'horoscope'
    __table_args__ = {'schema': 'prod_dbt'}

    row_id = Column(BigInteger, primary_key=True)
    sign_id = Column(BigInteger)
    sign_name = Column(String)
    prediction = Column(String)
    prediction_date = Column(String)

    @classmethod
    def get_all_predictions(cls):
        try:
            predictions = (
                db.session.query(
                    cls.sign_name,
                    cls.prediction_date,
                    cls.prediction
                ).all()
            )
            prediction_list = [{
                "sign_name": prediction.sign_name,
                "date": prediction.prediction_date,
                "prediction": html.unescape(prediction.prediction)
            } for prediction in predictions]
            return jsonify(prediction_list)
        except Exception as e:
            return ErrorHandler.handle_error(e, message="Failed to retrieve predictions")
