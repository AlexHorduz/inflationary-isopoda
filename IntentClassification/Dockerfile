FROM python:3.9-slim

WORKDIR /app/src

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./

# Initialize the tokenizer and model by running Python commands
RUN python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; \
    AutoTokenizer.from_pretrained('lxyuan/banking-intent-distilbert-classifier'); \
    AutoModelForSequenceClassification.from_pretrained('lxyuan/banking-intent-distilbert-classifier')"

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
