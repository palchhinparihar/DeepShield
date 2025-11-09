# backend/database/config.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load .env file from same folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "deepfake_db")

if not MONGO_URL:
    raise RuntimeError("❌ MONGO_URL not found. Please add it to database/.env")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
