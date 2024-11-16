from app import db
from sqlalchemy.orm import deferred
from sqlalchemy import Column, Integer, String, Float

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
