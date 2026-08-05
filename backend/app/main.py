from fastapi import FastAPI
from app.api.routes.engineers import router as engineers_router
from app.api.routes.servers import router as servers_router

app = FastAPI()
app.include_router(servers_router)
app.include_router(engineers_router)

@app.get("/")
def root():
    return {"message": "Welcome to OpsPilot API"}

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }