from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="SportsVerse AI v2.0 Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "SportsVerse AI v2.0 Backend API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Backend is healthy"}

@app.get("/api/health")
async def api_health():
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    print("=" * 60)
    print("  SportsVerse AI v2.0 Backend API")
    print("=" * 60)
    print("  Server running on: http://localhost:8000")
    print("  API Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
