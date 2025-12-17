
A full-stack application for browsing and searching recipes with FastAPI and React.

**Features**
- Browse recipes with pagination
- Advanced filtering (title, cuisine, rating, time, calories)
- Detailed recipe view with nutritional information
- Star rating display

**Tech Stack**
Backend: FastAPI, SQLAlchemy, MySQL, Python
Frontend: React, Axios


**Logic to parse json and to store data in database**
1. Load JSON file using pandas
2. Extract recipe data from each column:
   - Index 2: cuisine
   - Index 3: title
   - Index 5: rating
   - Index 7: prep_time
   - Index 8: cook_time
   - Index 6: total_time
   - Index 9: description
   - Index 12: nutrients (as JSON)
   - Index 13: serves
3. Create new DataFrame with extracted data
4. Insert into MySQL using `to_sql()` method
5. Preserve nutrients as JSON type for flexible querying


**Api Logic**

**Endpoint 1: GET /api/recipies (Get All Recipes)**
**Purpose: Retrieve all recipes with pagination**

**Logic:**

1.Accept pagination parameters (page, size) from query string

2.Use Depends(get_db) to inject database session

3.Use Depends(Params) to inject pagination parameters

4.Query all records from recipes table using db.query(item)

5.Pass query to paginate() function with params

6.paginate() automatically:

7.Counts total records

8.Calculates offset based on page number

9.Applies LIMIT and OFFSET to query

10.Returns paginated response with items, total, page, size

11.Return paginated JSON response


**Endpoint 2: GET /api/recipies/search (Search with Filters)
Purpose: Search recipes with multiple filter options and pagination**

**Logic:**

**Step 1: Accept Parameters**

Accept 8 optional filter parameters (title, cuisine, rating_gte, rating_lte, etc.)

All filters default to None if not provided

Accept pagination parameters (page, size)

Inject database session using Depends(get_db)

Inject pagination params using Depends(Params)

**Step 2: Build Base Query**

Start with base query: db.query(item)

Query is not executed yet (lazy loading)

**Step 3: Apply Filters Conditionally**

For each filter, check if parameter is not None

If filter exists, add WHERE condition to query

Title Filter:

Check if title is not None

Apply case-insensitive partial match: item.title.ilike(f"%{title}%")

Uses SQL ILIKE for case-insensitive search

Cuisine Filter:

Check if cuisine is not None

Apply exact match: item.cuisine == cuisine

Rating Filters:

Check if rating_gte is not None

Apply greater than or equal: item.rating >= rating_gte

Check if rating_lte is not None

Apply less than or equal: item.rating <= rating_lte

Time Filters:

Check if total_time_gte is not None

Apply: item.total_time >= total_time_gte

Check if total_time_lte is not None

Apply: item.total_time <= total_time_lte

Calorie Filters (Complex):

Check if calories_gte is not None

Extract number from JSON string:

Access JSON field: item.nutrients['calories'] → "389 kcal"

Use regex to remove non-digits: func.regexp_replace(..., '[^0-9]', '') → "389"

Cast to integer: cast(..., Integer) → 389

Compare: >= calories_gte

Same logic for calories_lte with <= operator

**Step 4: Chain All Filters**

Each filter adds to the same query object

Multiple filters combine with AND logic

Query still not executed (still building SQL)

**Step 5: Apply Pagination**

Pass filtered query to paginate(query, params)

paginate() function:

Counts total matching records

Calculates which records to return based on page/size

Adds LIMIT and OFFSET to SQL query

Executes the final query

Returns structured response

**Step 6: Return Response**

Response includes:

items: Array of matching recipes

total: Total count of matching records

page: Current page number

size: Items per page

pages: Total number of pages

**Example screenshots of application**

**Endpoint1**
<img width="1904" height="978" alt="Screenshot 2025-12-17 101436" src="https://github.com/user-attachments/assets/13282780-9464-4c25-8696-060753316c2f" /><br>
<img width="625" height="973" alt="Screenshot 2025-12-17 101405" src="https://github.com/user-attachments/assets/59bb7c7b-734e-48a5-a692-12f67837bfee" />
**Endpoint2**
**with search query**
<img width="1917" height="971" alt="Screenshot 2025-12-17 101350" src="https://github.com/user-attachments/assets/f3590606-2b00-43d8-9630-f0d5992ec303" /><br>
**when have no results**
<img width="1916" height="974" alt="Screenshot 2025-12-17 101705" src="https://github.com/user-attachments/assets/e7c275be-34ce-4653-aac4-50d5f8063ce4" />


