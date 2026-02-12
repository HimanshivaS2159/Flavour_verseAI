import os
from dotenv import load_dotenv

load_dotenv()

FOODOSCOPE_API_KEY = os.getenv("FOODOSCOPE_API_KEY", "your_api_key_here")
