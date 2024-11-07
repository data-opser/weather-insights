import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key_here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'postgresql://psqladmin:(-md(IPu1#vbj[y?@weather.postgres.database.azure.com:5432/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True

