from sarvamai import SarvamAI
from config import SARVAM_API_KEY

def get_llm_client():
    return SarvamAI(api_subscription_key=SARVAM_API_KEY)

def call_llm(client, prompt: str) -> str:
    response = client.chat.completions(
        messages=[
            {"role": "system", "content": "You are a macro market intelligence engine."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content