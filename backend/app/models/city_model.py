from app import db
from sqlalchemy.orm import deferred
from sqlalchemy import Column, Integer, String, Float
from app.error_handler import ErrorHandler

from flask import jsonify

class City(db.Model):
    __tablename__ = 'cities'
    __table_args__ = {'schema': 'prod_dbt_seeds'}

    deferred_id = db.Column(db.Integer, primary_key=True)

    city = Column(String)
    city_ascii = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    country = Column(String)
    iso2 = Column(String)
    iso3 = Column(String)
    admin_name = Column(String)
    capital = Column(String)
    population = Column(Float)
    id = Column(db.BigInteger)

    @classmethod
    def check_city_exists(cls, city_name):
        try:
            exists = cls.query.with_entities(cls.city).filter_by(city=city_name).first() is not None
            return exists
        except Exception as e:
            return False

    @classmethod
    def get_lat_lng_by_id(cls, city_id):
        try:
            record = cls.query.with_entities(cls.lat, cls.lng).filter_by(id=city_id).first()
            if record:
                return {
                    "latitude": record.lat,
                    "longitude": record.lng
                }
            else:
                return ErrorHandler.handle_error_2(None, message = "City not found", status_code = 404)
        except Exception as e:
            return ErrorHandler.handle_error_2(e, message="Failed to found city", status_code=500)

    @classmethod
    def get_all_cities_by_id(cls):
        try:
            cities = cls.query.with_entities(cls.id, cls.city).order_by(cls.id).all()
            city_list = [{"id": city.id, "city": city.city} for city in cities]
            return jsonify(city_list)

        except Exception as e:
            return ErrorHandler.handle_error_2(e, message="Failed to retrieve cities", status_code=500 )