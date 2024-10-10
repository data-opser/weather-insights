This guide explains how to set up and run Apache Airflow with Docker Compose.

Adding Libraries

1. Edit `requirements.txt`
   Add any additional Python libraries if you need in the following format:

   library_name==version

Docker Compose Commands

1. Run this command to build the Docker image after adding or updating libraries in `requirements.txt`:

   docker-compose build

2. Use the following command to start all services:

   docker-compose up

3. Open your web browser and navigate to:

   http://localhost:8080

4. To stop the services, run:

   docker-compose down
