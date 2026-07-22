from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import after loading environment
from shopify_service import shopify_service

# Optional MongoDB connection
try:
    mongo_url = os.environ.get('MONGO_URL')
    if mongo_url:
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ.get('DB_NAME', 'ayzar')]
    else:
        db = None
except Exception as e:
    logger.error(f"MongoDB not connected: {e}")
    db = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    if db is not None:
        _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        return []
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Shopify Routes
@api_router.get("/shopify/products")
async def get_shopify_products(limit: int = 10):
    """Get all products from Shopify"""
    try:
        products = shopify_service.get_all_products(limit=limit)
        return {"success": True, "products": products}
    except Exception as e:
        logger.error(f"Error fetching Shopify products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")

@api_router.get("/shopify/product/{handle}")
async def get_shopify_product(handle: str):
    """Get a single product by handle from Shopify"""
    try:
        product = shopify_service.get_product_by_handle(handle)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "product": product}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Shopify product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch product: {str(e)}")

@api_router.get("/shopify/collections")
async def get_shopify_collections(limit: int = 10):
    """Get all collections from Shopify"""
    try:
        collections = shopify_service.get_collections(limit=limit)
        return {"success": True, "collections": collections}
    except Exception as e:
        logger.error(f"Error fetching Shopify collections: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch collections: {str(e)}")

class CheckoutLineItem(BaseModel):
    variantId: str
    quantity: int

class CheckoutCreate(BaseModel):
    lineItems: List[CheckoutLineItem]

@api_router.post("/shopify/checkout")
async def create_shopify_checkout(checkout_data: CheckoutCreate):
    """Create a Shopify checkout and return checkout URL"""
    try:
        # Convert to format expected by Shopify
        line_items = [
            {
                "variantId": item.variantId,
                "quantity": item.quantity
            }
            for item in checkout_data.lineItems
        ]
        
        checkout = shopify_service.create_checkout(line_items)
        if not checkout:
            raise HTTPException(status_code=400, detail="Failed to create checkout")
        
        return {"success": True, "checkout": checkout}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating Shopify checkout: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if 'client' in globals() and client:
        client.close()