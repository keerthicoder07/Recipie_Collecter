from fastapi import FastAPI
from fastapi import Depends   
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String,Float
from sqlalchemy.dialects.mysql import JSON
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
from fastapi_pagination import Page,add_pagination,Params
from sqlalchemy.orm import Session   
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends,Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from typing import Optional


from pydantic import BaseModel

app=FastAPI()
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
add_pagination(app)
load_dotenv()
DATABASE_URL = "mysql+pymysql://root:%s@localhost/restaurant" % quote_plus("Kgisl@0207")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  # Assign sessionmaker instance
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class item(Base):
    __tablename__="recipes"
    id=Column(Integer,primary_key=True)
    cuisine=Column(String)
    title=Column(String)
    rating=Column(Float)
    prep_time=Column(Integer)
    cook_time=Column(Integer)
    total_time=Column(Integer)
    description=Column(String)
    nutrients=Column(JSON)
    serves=Column(String)

class itembase(BaseModel):
    id:int
    cuisine:str|None
    title:str|None
    rating:float
    prep_time:int|None
    cook_time:int|None
    total_time:int|None
    description:str|None
    nutrients:dict
    serves:str|None
class config:
    orm_mode=True
    from_attributes=True

@app.get("/api/recipies",response_model=Page[itembase])
def get_users(db: Session = Depends(get_db), params: Params = Depends()):
    return paginate(db.query(item), params)

@app.get("/api/recipies/search", response_model=Page[itembase])
def search(
    title:Optional[str]=Query(None),
    cuisine:Optional[str]=Query(None),
    rating_gte:Optional[float]=Query(None,ge=0,le=5),
    rating_lte:Optional[float]=Query(None,ge=0,le=5),
    total_time_gte:Optional[int]=Query(None),
    total_time_lte:Optional[int]=Query(None),
    calories_gte:Optional[int]=Query(None),
    calories_lte:Optional[int]=Query(None),
    db:Session=Depends(get_db),
    params:Params=Depends()
):
    query=db.query(item)
    if title is not None:
        query=query.filter(item.title.ilike(f"%{title}%"))
    if cuisine is not None:
        query=query.filter(item.cuisine==cuisine)
    if rating_gte is not None:
        query=query.filter(item.rating>=rating_gte)
    if rating_lte is not None:
        query=query.filter(item.rating<=rating_lte)
    if total_time_gte is not None:
        query = query.filter(item.total_time >= total_time_gte)
    
    if total_time_lte is not None:
        query = query.filter(item.total_time <= total_time_lte)
    if calories_gte is not None:
        query = query.filter(
        cast(
            func.regexp_replace(item.nutrients['calories'], '[^0-9]', ''),
            Integer
        ) >= calories_gte
    )

    if calories_lte is not None:
        query = query.filter(
        cast(
            func.regexp_replace(item.nutrients['calories'], '[^0-9]', ''),
            Integer
        ) <= calories_lte
    )
    return paginate(query,params)

