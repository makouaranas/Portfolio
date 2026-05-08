from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "33ddBackend is running! CI/CD works!"}

@app.get("/api/health")
def health():
    return {"status": "ok"}