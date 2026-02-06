from fastapi import FastAPI
from engine import run_engine
from schemas import AnalyzeRequest

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    output = run_engine(
        selected_events=request.events,
        companies=request.companies
    )
    return output