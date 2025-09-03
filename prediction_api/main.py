from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
# Import the consolidated weather function and the crop prediction function
from utils import pred_crop, pred_temp_hum 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


class Inputs(BaseModel):
    nitrogen: float
    phosphorous: float
    potassium: float
    ph: float
    state: str
    district: str
    month: str


@app.post("/predict/")
async def predict(inputs: Inputs):
    try:
        # Call the single, consolidated function to get all weather data
        temperature, humidity, rainfall = pred_temp_hum.get_weather_data(
            inputs.state, inputs.district
        )

        # Get the crop prediction
        prediction = pred_crop.predict_crop(
            inputs.nitrogen, 
            inputs.phosphorous, 
            inputs.potassium, 
            temperature, 
            humidity, 
            inputs.ph, 
            rainfall
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"result": prediction[0]}