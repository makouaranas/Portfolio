from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend is running! CI/CD works!"}

@app.get("/api/health")
def health():
    return {"status": "ok"}