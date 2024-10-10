# This Dockerfile creates a custom Docker image based on the official 
# Apache Airflow 2.10.2 image. It installs additional Python libraries 
# specified in a requirements.txt file.

FROM apache/airflow:2.10.2

WORKDIR /opt/airflow

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
