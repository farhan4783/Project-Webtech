import os
import io
import json
import math
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from duckduckgo_search import DDGS
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

# --- CONFIG ---
# Get API Key: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. LOAD USER DATABASE ---
def get_user_data():
    """Simulates fetching user data from FinSync DB"""
    try:
        with open("user_db.json", "r") as f:
            data = json.load(f)
        
        # Calculate 'Disposable Income'
        total_expenses = data["monthly_expenses"]["rent"] + \
                         data["monthly_expenses"]["food"] + \
                         data["monthly_expenses"]["existing_emis"]
        
        data["disposable_income"] = data["monthly_income"] - total_expenses
        data["hourly_wage"] = data["monthly_income"] / 160 # Approx 160 work hours/month
        return data
    except:
        # Fallback if file missing
        return {"monthly_income": 60000, "hourly_wage": 375, "disposable_income": 20000, "current_savings": 50000}

# --- 2. FINANCIAL MATH ---
def calculate_emi(principal, rate_annual=14, tenure_months=12):
    """Calculates Monthly EMI. Default: 14% interest for 1 year"""
    if principal == 0: return 0
    r = rate_annual / (12 * 100) # Monthly interest
    emi = (principal * r * pow(1 + r, tenure_months)) / (pow(1 + r, tenure_months) - 1)
    return round(emi)

# --- 3. THE AI PIPELINE ---
def get_real_price(product_name):
    """Searches for the specific product price"""
    try:
        print(f"🔎 Searching price for: {product_name}...")
        # We append 'buy online india' to get e-commerce results
        results = DDGS().text(f"{product_name} price in india buy online amazon flipkart", max_results=2)
        return str(results)
    except Exception as e:
        print(f"⚠️ Search Error: {e}")
        return "Price Unavailable"

def analyze_image(image_bytes):
    user = get_user_data()
    model = genai.GenerativeModel('gemini-2.5-flash')
    image = Image.open(io.BytesIO(image_bytes))

    # PHASE 1: IDENTIFY (Vision)
    # We ask for the EXACT Model to fix the "Smartphone" issue
    print("👀 Identifying Object...")
    vision_prompt = """
    Identify this product. Be extremely specific.
    - If it's a phone, say "iPhone 15 Pro" or "Samsung S24", not just "Smartphone".
    - If it's a bottle, say "Stanley Cup" or "Milton Bottle".
    - If it's a laptop, say "MacBook Air M2".
    Return ONLY the product name.
    """
    vision_res = model.generate_content([vision_prompt, image])
    product_name = vision_res.text.strip()
    print(f"✅ Identified: {product_name}")

    # PHASE 2: PRICE (Search)
    search_data = get_real_price(product_name)

    # PHASE 3: ANALYSIS (Reasoning)
    analysis_prompt = f"""
    You are a Financial Risk Agent.
    
    1. Product: {product_name}
    2. Market Data: {search_data}
    3. User Financials:
       - Monthly Income: ₹{user['monthly_income']}
       - Disposable Income: ₹{user['disposable_income']}
       - Savings: ₹{user['current_savings']}
       - Hourly Wage: ₹{user['hourly_wage']:.2f}

    TASK:
    1. Extract the most realistic price (INR) from Market Data.
    2. Calculate 'Labor Hours' = Price / User's Hourly Wage.
    3. Determine 'Fund Impact':
       - If Price > Savings: "BANKRUPTCY RISK ⚠️"
       - If Price > Disposable Income: "EMI TRAP 📉"
       - Else: "SAFE BUY ✅"
    4. Estimate EMI (approx 14% interest, 12 months).

    Return VALID JSON:
    {{
        "item": "{product_name}",
        "price": 0,
        "hours": 0,
        "impact": "string", 
        "emi": 0
    }}
    """
    
    final_res = model.generate_content(analysis_prompt)
    clean_json = final_res.text.replace("```json", "").replace("```", "").strip()
    data = json.loads(clean_json)

    # Double Check EMI Math locally (AI is bad at math, Python is good)
    if data['price'] > 0:
        data['emi'] = calculate_emi(data['price'])
        # Recalculate hours exactly
        data['hours'] = round(data['price'] / user['hourly_wage'])

    return data

# --- API ---
@app.post("/scan")
async def scan_product(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = analyze_image(contents)
        print("🚀 Sending:", result)
        return result
    except Exception as e:
        print("❌ Error:", e)
        # Fail Gracefully
        return {"item": "Scan Failed", "price": 0, "hours": 0, "impact": "RETRY", "emi": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)