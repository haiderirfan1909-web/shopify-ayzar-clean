import os
import requests
import logging
from typing import Optional, Dict, List, Any

logger = logging.getLogger(__name__)

class ShopifyService:
    def __init__(self):
        self.store_domain = os.environ.get('SHOPIFY_STORE_DOMAIN')
        self.storefront_token = os.environ.get('SHOPIFY_STOREFRONT_TOKEN')
        
        if not self.store_domain or not self.storefront_token:
            logger.warning("Shopify credentials not found in environment variables")
            self.api_url = None
        else:
            self.api_url = f"https://{self.store_domain}/api/2024-10/graphql.json"
    
    def _ensure_configured(self):
        """Ensure Shopify is configured before making requests"""
        if not self.api_url:
            raise ValueError("Shopify is not configured. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN")
    
    def _make_request(self, query: str, variables: Optional[Dict] = None) -> Dict:
        """Make a GraphQL request to Shopify Storefront API"""
        self._ensure_configured()
        
        headers = {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": self.storefront_token
        }
        
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
        
        try:
            response = requests.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Shopify API request failed: {str(e)}")
            raise
    
    def get_all_products(self, limit: int = 10) -> List[Dict]:
        """Fetch all products from Shopify"""
        query = """
        query getProducts($first: Int!) {
            products(first: $first) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        descriptionHtml
                        availableForSale
                        priceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        images(first: 5) {
                            edges {
                                node {
                                    url
                                    altText
                                }
                            }
                        }
                        variants(first: 10) {
                            edges {
                                node {
                                    id
                                    title
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    availableForSale
                                }
                            }
                        }
                    }
                }
            }
        }
        """
        
        variables = {"first": limit}
        response = self._make_request(query, variables)
        
        if "data" in response and "products" in response["data"]:
            products = []
            for edge in response["data"]["products"]["edges"]:
                node = edge["node"]
                products.append({
                    "id": node["id"],
                    "title": node["title"],
                    "handle": node["handle"],
                    "description": node["description"],
                    "descriptionHtml": node.get("descriptionHtml", ""),
                    "availableForSale": node["availableForSale"],
                    "price": node["priceRange"]["minVariantPrice"]["amount"],
                    "currencyCode": node["priceRange"]["minVariantPrice"]["currencyCode"],
                    "priceRange": node["priceRange"],
                    "images": [img["node"]["url"] for img in node["images"]["edges"]],
                    "variants": [
                        {
                            "id": v["node"]["id"],
                            "title": v["node"]["title"],
                            "price": v["node"]["price"]["amount"],
                            "currencyCode": v["node"]["price"]["currencyCode"],
                            "availableForSale": v["node"]["availableForSale"]
                        }
                        for v in node["variants"]["edges"]
                    ]
                })
            return products
        
        return []
    
    def get_product_by_handle(self, handle: str) -> Optional[Dict]:
        """Fetch a single product by handle"""
        query = """
        query getProductByHandle($handle: String!) {
            product(handle: $handle) {
                id
                title
                handle
                description
                descriptionHtml
                availableForSale
                productType
                tags
                vendor
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                    maxVariantPrice {
                        amount
                        currencyCode
                    }
                }
                images(first: 10) {
                    edges {
                        node {
                            url
                            altText
                        }
                    }
                }
                variants(first: 20) {
                    edges {
                        node {
                            id
                            title
                            price {
                                amount
                                currencyCode
                            }
                            availableForSale
                            selectedOptions {
                                name
                                value
                            }
                        }
                    }
                }
            }
        }
        """
        
        variables = {"handle": handle}
        response = self._make_request(query, variables)
        
        if "data" in response and "product" in response["data"] and response["data"]["product"]:
            node = response["data"]["product"]
            return {
                "id": node["id"],
                "title": node["title"],
                "handle": node["handle"],
                "description": node["description"],
                "descriptionHtml": node.get("descriptionHtml", ""),
                "availableForSale": node["availableForSale"],
                "productType": node.get("productType", ""),
                "tags": node.get("tags", []),
                "vendor": node.get("vendor", ""),
                "price": node["priceRange"]["minVariantPrice"]["amount"],
                "currencyCode": node["priceRange"]["minVariantPrice"]["currencyCode"],
                "priceRange": node["priceRange"],
                "images": [img["node"]["url"] for img in node["images"]["edges"]],
                "variants": [
                    {
                        "id": v["node"]["id"],
                        "title": v["node"]["title"],
                        "price": v["node"]["price"]["amount"],
                        "currencyCode": v["node"]["price"]["currencyCode"],
                        "availableForSale": v["node"]["availableForSale"],
                        "selectedOptions": v["node"].get("selectedOptions", [])
                    }
                    for v in node["variants"]["edges"]
                ]
            }
        
        return None
    
    def get_collections(self, limit: int = 10) -> List[Dict]:
        """Fetch collections from Shopify"""
        query = """
        query getCollections($first: Int!) {
            collections(first: $first) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        image {
                            url
                            altText
                        }
                    }
                }
            }
        }
        """
        
        variables = {"first": limit}
        response = self._make_request(query, variables)
        
        if "data" in response and "collections" in response["data"]:
            collections = []
            for edge in response["data"]["collections"]["edges"]:
                node = edge["node"]
                collections.append({
                    "id": node["id"],
                    "title": node["title"],
                    "handle": node["handle"],
                    "description": node.get("description", ""),
                    "image": node.get("image", {}).get("url") if node.get("image") else None
                })
            return collections
        
        return []
    
    def create_checkout(self, line_items: List[Dict]) -> Optional[Dict]:
        """Create a Shopify cart with line items using new Cart API"""
        query = """
        mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
                cart {
                    id
                    checkoutUrl
                    totalQuantity
                    cost {
                        subtotalAmount {
                            amount
                            currencyCode
                        }
                        totalAmount {
                            amount
                            currencyCode
                        }
                        totalTaxAmount {
                            amount
                            currencyCode
                        }
                    }
                    lines(first: 50) {
                        edges {
                            node {
                                id
                                quantity
                                merchandise {
                                    ... on ProductVariant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        product {
                                            title
                                            handle
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
        """
        
        # Transform line items to new Cart API format
        cart_lines = [
            {
                "merchandiseId": item["variantId"],
                "quantity": item["quantity"]
            }
            for item in line_items
        ]
        
        variables = {
            "input": {
                "lines": cart_lines
            }
        }
        
        response = self._make_request(query, variables)
        
        # Log full response for debugging
        logger.info(f"Shopify cart response: {response}")
        
        if "data" in response and "cartCreate" in response["data"]:
            cart_data = response["data"]["cartCreate"]
            
            if cart_data.get("userErrors"):
                errors = cart_data["userErrors"]
                logger.error(f"Cart creation errors: {errors}")
                return None
            
            cart = cart_data.get("cart")
            if cart:
                return {
                    "id": cart["id"],
                    "webUrl": cart["checkoutUrl"],
                    "totalQuantity": cart["totalQuantity"],
                    "subtotal": cart["cost"]["subtotalAmount"]["amount"],
                    "tax": cart["cost"].get("totalTaxAmount", {}).get("amount", "0") if cart["cost"].get("totalTaxAmount") else "0",
                    "total": cart["cost"]["totalAmount"]["amount"],
                    "currencyCode": cart["cost"]["totalAmount"]["currencyCode"],
                    "lineItems": [
                        {
                            "id": item["node"]["id"],
                            "title": item["node"]["merchandise"]["product"]["title"],
                            "quantity": item["node"]["quantity"],
                            "variantId": item["node"]["merchandise"]["id"],
                            "price": item["node"]["merchandise"]["price"]["amount"]
                        }
                        for item in cart["lines"]["edges"]
                    ]
                }
        
        return None


# Initialize service
shopify_service = ShopifyService()
