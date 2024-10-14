# Intent Classification Service

This service is a simple FastAPI application that serves as an API for intent classification

## Building the Docker Image

To build the Docker image, run the following command from the project root directory (where the `Dockerfile` is located):

> docker build -t intent_classifier .

## Running the Docker Container

After the image is built, you can run the Docker container with the following command:

> docker run -d -p 8000:8000 intent_classifier

This will start the FastAPI application and expose it on port 8000.

## Accessing the Application

You can access the FastAPI application at `http://localhost:8000/getIntent`.