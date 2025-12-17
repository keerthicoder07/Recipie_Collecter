from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import sqlalchemy
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
#from database import Base
import pandas as pd
load_dotenv()
password=os.getenv('password')
DATABASE_URL = "mysql+pymysql://root:%s@localhost/restaurant" % quote_plus(password)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
cuisine=[]
title=[]
rating=[]
prep_time=[]
cook_time=[]
total_time=[]
description=[]
nutrients=[]
serves=[]
data=pd.read_json("US_recipes.json")
df=pd.DataFrame(data)
for i in df:
    c=df[i]
    cuisine.append(c[2])
    title.append(c[3])
    rating.append(c[5])
    cook_time.append(c[8])
    prep_time.append(c[7])
    total_time.append(c[6])
    description.append(c[9])
    nutrients.append(c[12])
    serves.append(c[13])

data1={"cuisine":cuisine,
      "title":title,
      "rating":rating,
      "prep_time":prep_time,
      "cook_time":cook_time,
      "total_time":total_time,
      "description":description,
      "nutrients":nutrients,
      "serves":serves
      }
df1=pd.DataFrame(data1)
#print(nutrients)
#print(df1.columns)
#df.drop("Continent",axis=0)     
#print(df.columns.tolist) 
df1.to_sql('recipes',con=engine,if_exists='append',index=False,dtype={'nutrients': sqlalchemy.types.JSON,})



