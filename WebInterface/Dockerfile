FROM python:3.11
COPY . /app
WORKDIR /app
RUN pip3 install poetry && poetry install
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload", "--proxy-headers", "--forwarded-allow-ips=*"]
EXPOSE 8080