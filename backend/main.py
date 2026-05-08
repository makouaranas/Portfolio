from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend CI/CD is working!"}

@app.get("/health")
def health():
    return {"status": "okay"}