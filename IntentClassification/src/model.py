from transformers import T5ForConditionalGeneration, T5Tokenizer

class IntentClassifier:
    def __init__(self, model_name="serj/intent-classifier", device="cpu"):
        self.model = T5ForConditionalGeneration.from_pretrained(model_name).to(device)
        self.tokenizer = T5Tokenizer.from_pretrained(model_name)
        self.device = device


    def predict(self, text, prompt_options, company_name, company_specific) -> str:
        input_text = build_prompt(text, prompt_options, company_name, company_specific)
        # print(input_text)
        # Tokenize the concatenated inp_ut text
        input_ids = self.tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True).to(self.device)

        # Generate the output
        output = self.model.generate(input_ids)

        # Decode the output tokens
        decoded_output = self.tokenizer.decode(output[0], skip_special_tokens=True)

        return decoded_output

def build_prompt(text, prompt="", company_name="", company_specific=""):
    prompt = f"Company name: {company_name} is doing: {company_specific}.\nCustomer: {text}.\nEND MESSAGE\nChoose only ONE topic that matches the customer's issue.\n{prompt}Class name: \""
    print("\n\n\n\n")
    print(prompt)
    return prompt

m = IntentClassifier("serj/intent-classifier")
print(
    m.predict(
        text="Hey, after recent changes, I want to receive a new card, please help",
        prompt_options="OPTIONS:\n Get new card\n Issues with card blocking\n Fraudulent actions\n Other issues related to the company responsibilities\n Not related question or trolling\n",
        company_name="Company",
        company_specific="This company is an online banking"
    )
)

print(
    m.predict(
        text="Hey, recently my card has been blocked, please help",
        prompt_options="OPTIONS:\n Get new card\n Issues with card blocking\n Fraudulent actions\n Other issues related to the company responsibilities\n Not related question or trolling\n",
        company_name="Company",
        company_specific="This company is an online banking"
    )
)

print(
    m.predict(
        text="Hey, I had 100k$ on my card, now it's 0%, please help",
        prompt_options="OPTIONS:\n Get new card\n Issues with card blocking\n Fraudulent actions\n Other issues related to the company responsibilities\n Not related question or trolling\n",
        company_name="Company",
        company_specific="This company is an online banking"
    )
)

print(
    m.predict(
        text="Hey, how do I find all my cards in your banking app, please help",
        prompt_options="OPTIONS:\n Get new card\n Issues with card blocking\n Fraudulent actions\n Other issues related to the company responsibilities\n Not related question or trolling\n",
        company_name="Company",
        company_specific="This company is an online banking"
    )
)

print(
    m.predict(
        text="Hey, I need to cook pasta, please help",
        prompt_options="OPTIONS:\n Get new card\n Issues with card blocking\n Fraudulent actions\n Other issues related to the company responsibilities\n Not related question or trolling\n",
        company_name="Company",
        company_specific="This company is an online banking"
    )
)