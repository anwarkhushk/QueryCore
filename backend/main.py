import os
import requests
import traceback
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load the API key from the .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI(title="QueryCore AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.post("/api/ask-ai")
def ask_ai(request: ChatRequest, tenant_id: str = Header(None)):
    try:
        if not tenant_id:
            return {"error": "tenant-id header is missing"}
        
        schema_string = """
        TABLE users (user_id UUID, tenant_id UUID, username VARCHAR, email VARCHAR);
        TABLE analytics_reports (report_id UUID, tenant_id UUID, title VARCHAR, created_at TIMESTAMPTZ);
        TABLE query_executions (execution_id UUID, ai_request_id UUID, tenant_id UUID, executed_sql TEXT, execution_time_ms INT);
        """
        
        system_prompt = f"""You are an expert PostgreSQL developer for QueryCore. 
        Convert the user's natural language question into a valid SQL query.
        Return ONLY the raw SQL code. Do not use markdown formatting. Do not explain anything.
        
        Here is the database schema:
        {schema_string}
        """
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant", 
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.question}
            ],
            "temperature": 0.0 
        }
        
        # Send request to Groq
        response = requests.post(url, headers=headers, json=payload)
        
        # If Groq complains, return Groq's exact complaint safely to the browser
        if response.status_code != 200:
            return {
                "error": "GROQ REJECTED THE REQUEST", 
                "status_code": response.status_code, 
                "details": response.text
            }
            
        raw_sql = response.json()['choices'][0]['message']['content'].strip()
        secure_sql = f"SELECT * FROM ({raw_sql}) AS secure_subquery WHERE tenant_id = '{tenant_id}';"
        
        return {
            "status": "success",
            "original_question": request.question,
            "raw_llm_sql": raw_sql,
            "secure_sql_to_execute": secure_sql
        }
        
    except Exception as e:
        # IF PYTHON CRASHES ANYWHERE, IT WILL PRINT THE EXACT LINE HERE!
        return {
            "error": "PYTHON CODE CRASHED",
            "message": str(e),
            "traceback": traceback.format_exc()
        }