from typing import Tuple

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TextClassificationPipeline
)


class IntentClassifier:
    def __init__(self, device: str = "cpu"):
        tokenizer = AutoTokenizer.from_pretrained("lxyuan/banking-intent-distilbert-classifier")
        model = AutoModelForSequenceClassification.from_pretrained("lxyuan/banking-intent-distilbert-classifier")
        self.classifier = TextClassificationPipeline(
            model=model,
            tokenizer=tokenizer,
            device=device,
        )

    def get_intent(self, text: str) -> Tuple[str, float]:
        """
        Accepts user question and returns a tuple of (intent, score)
        """
        return self.classifier(text)