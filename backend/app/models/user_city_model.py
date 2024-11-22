from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.utils import ErrorHandler
from app.models.city_model import City

class UserCity(db.Model):
    __tablename__ = 'user_city'
    __table_args__ = {'schema': 'user_data'}

    user_city_id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey('user_data.user.user_id', ondelete='CASCADE'),
        nullable=False
    )
    city_id = db.Column(db.BigInteger, nullable=False)
    is_main = db.Column(db.Boolean, default=False)

    user = db.relationship('User', back_populates='cities')

    @classmethod
    def get_user_cities(cls, user_id):
        try:
            user_cities = cls.query.filter_by(user_id=user_id).all()

            cities = []
            for uc in user_cities:
                city = City.check_city_exists(uc.city_id)
                if city:
                    cities.append({
                            "city_id": uc.city_id,
                            "city_name": city.city,
                            "is_main": uc.is_main
                        })
                else:
                    return ErrorHandler.handle_error(
                        None,
                        message=f"City with ID '{uc.city_id}' not found.",
                        status_code=404
                    )
            return jsonify({'cities': cities}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving cities for user",
                status_code=500
            )

    @classmethod
    def add_user_city(cls, user_id, city_id):
        try:
            city = City.check_city_exists(city_id)
            if city:
                if cls.query.filter_by(user_id=user_id, city_id=city_id).first():
                    raise ValueError("City already added to the user.")

                new_user_city = cls(user_id=user_id, city_id=city_id)
                db.session.add(new_user_city)
                db.session.commit()
                return jsonify({'message': 'City was added to user successfully.'}), 201
            else:
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )
        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while adding city to user", status_code=500)

    @classmethod
    def delete_user_city(cls, user_id, city_id):
        try:
            city = City.check_city_exists(city_id)
            if city:
                user_city = cls.query.filter_by(user_id=user_id, city_id=city_id).first()
                if not user_city:
                    raise ValueError("City not found for the user.")

                db.session.delete(user_city)
                db.session.commit()
                return jsonify({'message': 'City was deleted from user successfully.'}), 200
            else:
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )
        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while deleting city from user", status_code=500)

    @classmethod
    def set_main_user_city(cls, user_id, city_id):
        try:
            city = City.check_city_exists(city_id)
            if city:
                user_city = cls.query.filter_by(user_id=user_id, city_id=city_id).first()
                if not user_city:
                    raise ValueError("City not found for the user.")

                cls.query.filter_by(user_id=user_id).update({"is_main": False}, synchronize_session=False)
                user_city.is_main = True
                db.session.commit()
                return jsonify({'message': 'City was set as main for user successfully.'}), 200
            else:
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )
        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while while setting main city", status_code=500)
