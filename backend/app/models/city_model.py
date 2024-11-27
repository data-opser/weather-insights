from app import db
from sqlalchemy.orm import deferred
from sqlalchemy import Column, String, Float
from app.utils import ErrorHandler
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
            cities = (
                cls.query.with_entities
                (cls.id, cls.city, cls.country, cls.iso2, cls.iso3, cls.admin_name)
                .order_by(cls.id).all()
            )
            city_list = [{
                "id": city.id, "city": city.city, "country": city.country,
                "iso2": city.iso2, "iso3": city.iso3, "admin_name": city.admin_name
            } for city in cities]
            return jsonify(city_list)
        except Exception as e:
            return ErrorHandler.handle_error(e, message="Failed to retrieve cities")

    @classmethod
    def get_city_name_by_id(cls, city_id):
        try:
            if not City.check_city_exists(city_id):
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )

            city_record = cls.query.with_entities(cls.city).filter_by(id=city_id).first()
            return jsonify({"id": city_id, "city": city_record.city})
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while getting city name",
                status_code=500
            )

    @classmethod
    def get_city_data_by_id(cls, city_id):
       try:
           city_record = (
               cls.query.with_entities(cls.city, cls.iso2, cls.country).
               filter_by(id=city_id).first()
           )
           return {
               "id": city_id,
               "city": city_record.city,
               "iso2": city_record.iso2,
               "country": city_record.country
           }
       except Exception as e:
           raise ErrorHandler.handle_error(
               e,
               message="Database error while getting city data",
               status_code=500
           )
