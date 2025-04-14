from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os


load_dotenv()

app = Flask(__name__)
CORS(app)
CORS(app, origins=["http://localhost:3000"])


mongo_connection_string = os.getenv('MONGO_CONNECTION_STRING')
if not mongo_connection_string:
    raise ValueError("No MongoDB connection string found in environment variables")

client = MongoClient(mongo_connection_string)
db = client['Codher']

print("Connected to MongoDB")

@app.route('/')
def home():
    return "NullVoid for the win!"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = db.users.find_one({"email": email, "password": password})

    if user:
        return jsonify({
            "status": "success",
            "user_id": user.get("user_id"),
            "email": user.get("email"),
            "role": user.get("role")
        
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
@app.route('/addproduct', methods=['POST'])
def add_product():
    data = request.get_json()
    product_id = data.get('product_id')
    print(product_id)
    product_name = data.get('product_name')
    manufacturer_id = data.get('manufacturer_id') 
    

   
    # Check for duplicate product_id
    existing = db.products.find_one({"product_id": product_id})
    if existing:
        return jsonify({"status": "duplicate"}), 409
    
    product = {
        "product_id": product_id,
        "product_name": product_name,
        "manufacturer_id": manufacturer_id,  # ✅ Store it
        "Blockchain": False
    }

    db.products.insert_one(product)
    return jsonify({"status": "success"}), 201


@app.route('/createuser', methods=['POST'])
def create_user():
    data = request.get_json()
    email_id = data.get('email')
    password = data.get('password')
    private_key = data.get('private_key')
    role = data.get('role')

    if not email_id or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    prefix = "M" if role.lower() == "manufacturer" else "O"

    last_user = db.users.find_one(
        {"user_id": {"$regex": f"^{prefix}\\d{{4}}$"}},
        sort=[("user_id", -1)]
    )

    if last_user and "user_id" in last_user:
        last_number = int(last_user["user_id"][1:])
        new_number = last_number + 1
    else:
        new_number = 1

    user_id = f"{prefix}{new_number:04d}"

    user = {
        "user_id": user_id,
        "email": email_id,
        "password": password,
        "private_key": private_key,
        "role": role
    }

    db.users.insert_one(user)
    return jsonify({"status": "success"}), 201


@app.route('/getusers', methods=['GET'])
def get_user():
    user = list(db.users.find({}, {"_id": 0}))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200
@app.route('/admin/products', methods=['GET'])
def get_all_products():
    whitelisted_products = db.whitelist.distinct("product_id")

  
    products = list(db.products.find(
        {"product_id": {"$nin": whitelisted_products}},
        {'_id': 0}
    ))

    if not products:
        return jsonify({"error": "No unwhitelisted products found"}), 404

    return jsonify(products), 200


@app.route('/product', methods=['GET'])
def get_product():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    whitelisted_products = db.whitelist.distinct("product_id")

    products = list(db.products.find(
        {
            "product_id": {"$nin": whitelisted_products},
            "manufacturer_id": user_id
        },
        {'_id': 0}
    ))

  

    return jsonify(products), 200



# @app.route('/product', methods=['GET'])
# def get_product():
   
#     whitelisted_products = db.whitelist.distinct("product_id")

  
#     products = list(db.products.find(
#         {"product_id": {"$nin": whitelisted_products}},
#         {'_id': 0}
#     ))

#     if not products:
#         return jsonify({"error": "No unwhitelisted products found"}), 404

#     return jsonify(products), 200

@app.route('/whitelist', methods=['GET'])
def get_whitelist_products():
    products = list(db.whitelist.find({}, {'_id': 0, 'product_id': 1}))

    if not products:
        return jsonify({"error": "No products found"}), 404

    return jsonify(products), 200


@app.route('/whitelist/<product_id>', methods=['GET'])
def get_whitelist_by_product(product_id):
    whitelist_entry = db.whitelist.find_one(
        {"product_id": product_id},
        {"_id": 0, "product_id": 1, "route": 1}
    )

    if not whitelist_entry:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(whitelist_entry), 200

@app.route('/addedtoblockchain/<product_id>', methods=['POST'])
def add_to_blockchain(product_id):
   
    result = db.products.update_one(
        {"product_id": product_id},
        {"$set": {"Blockchain": True}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"status": "Product marked as added to blockchain"}), 200


@app.route('/addRoute', methods=['POST'])  # Fixed typo: method -> methods
def addRoute():
    data = request.get_json()
    print(data)
    product_id = data.get('productId')
    route = data.get('route')  # This is a dictionary mapping userId (email) -> {nfc: false, sent: false}

    if not product_id or not route:
        return jsonify({"error": "productId and route are required"}), 400

    existing = db.whitelist.find_one({"product_id": product_id})

    if existing:
        updated_route = existing.get("route", {})
        updated_route.update(route)

        db.whitelist.update_one(
            {"product_id": product_id},
            {"$set": {"route": updated_route}}
        )
    else:
        # Insert new document
        db.whitelist.insert_one({
            "product_id": product_id,
            "route": route
        })

    return jsonify({"status": "Route added/updated successfully"}), 200

@app.route('/whitelist/products/<prodId>', methods=['PUT'])
def update_product(prodId):
    try:
        # Get the updated NFC and sent values from the request JSON body
        data = request.get_json()
        nfc = data.get('nfc')
        sent = data.get('sent')

        # Validate the required fields
        if nfc is None or sent is None:
            return jsonify({"error": "Missing required fields"}), 400

        # Update the product with the given product_id (prodId)
        result = db.whitelist.update_one(
            {"product_id": prodId},  # Find product by product_id
            {"$set": {"nfc": nfc, "sent": sent}}  # Set new values for nfc and sent
        )

        # Check if the update was successful
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({"message": "Product updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/transfer/<product_id>', methods=['POST'])
def transfer(product_id):
 
    # Find the product document by product_id
    product = db.whitelist.find_one({"product_id": product_id})

    if not product:
        return jsonify({"error": "Product ID not found in whitelist"}), 404

    # Get the 'route' data (users and their nfc/sent status)
    route = product.get('route', {})

    # Loop through the users to find the first one with 'nfc' and 'sent' set to False
    for user, status in route.items():
        if not status['nfc'] and not status['sent']:
            # Update the user's NFC and Sent status to True
            route[user]['nfc'] = True
            route[user]['sent'] = True

            # Update the product document with the new route
            db.whitelist.update_one(
                {"product_id": product_id},
                {"$set": {"route": route}}
            )

            # Respond with success and updated user details
            return jsonify({
                "message": "Transfer successful"
            }), 200

    return jsonify({"error": "No users with NFC and Sent status as False"}), 404

    

if __name__ == '__main__':
    app.config['DEBUG'] = False
    app.run(host='0.0.0.0', port=5000)