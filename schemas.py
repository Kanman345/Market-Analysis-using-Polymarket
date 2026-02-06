from pydantic import BaseModel
from typing import List, Dict, Any

class AnalyzeRequest(BaseModel):
    events: List[str]
    companies: List[str]

class AnalyzeResponse(BaseModel):
    result: Dict[str, Any]