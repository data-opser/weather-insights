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
    def check_city_exists(cls, city_id):
        record = cls.query.with_entities(cls.city).filter_by(id=city_id).first()
        return record

    @classmethod
    def get_all_cities_by_id(cls):
        try:
            cities = cls.query.with_entities(cls.id, cls.city).order_by(cls.id).all()
            city_list = [{"id": city.id, "city": city.city} for city in cities]
            return jsonify(city_list)
        except Exception as e:
            return ErrorHandler.handle_error_2(e, message="Failed to retrieve cities")

    @classmethod
    def get_city_name_by_id(cls, city_id):
       try:
           City.check_city_exists(city_id)
           city_record = cls.query.with_entities(cls.city).filter_by(id=city_id).first()
           return jsonify({"id": city_id, "city": city_record.city})
       except Exception as e:
           return ErrorHandler.handle_error_2(e, message=f"City with ID '{city_id}' not found.", status_code=404)