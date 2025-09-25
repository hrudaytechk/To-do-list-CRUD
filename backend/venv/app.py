from flask import Flask, request, jsonify
from flask_cors import CORS
from model import db, Product

app = Flask(__name__)
CORS(app)

# Configure SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///products.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# -------------------------
# CRUD API for Products
# -------------------------

# Create Product
@app.route("/products", methods=["POST"])
def create_product():
    data = request.json
    new_product = Product(
        name=data["name"],
        price=float(data["price"]),
        quantity=int(data["quantity"]),
        date=data["date"],
        time=data["time"]
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

# Read All
@app.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

# Read One
@app.route("/products/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

# Update
@app.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json
    product.name = data.get("name", product.name)
    product.price = float(data.get("price", product.price))
    product.quantity = int(data.get("quantity", product.quantity))
    product.date = data.get("date", product.date)
    product.time = data.get("time", product.time)
    db.session.commit()
    return jsonify(product.to_dict())

# Delete
@app.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})

if __name__ == "__main__":
    app.run(debug=True)
