from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to OpsPilot API"}

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }