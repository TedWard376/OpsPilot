from fastapi import FastAPI
from app.api.routes.engineers import router as engineers_router
from app.api.routes.servers import router as servers_router
from app.api.routes.incidents import router as incidents_router
from app.api.routes.alerts import router as alerts_router


app = FastAPI()
app.include_router(servers_router)
app.include_router(engineers_router)
app.include_router(incidents_router)
app.include_router(alerts_router)


@app.get("/")
def root():
    return {"message": "Welcome to OpsPilot API"}

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }