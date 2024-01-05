from flask import Flask, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
db = SQLAlchemy(app)

class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)

  def json(self):
    return {'id': self.id, 'name': self.name, 'email': self.email}

db.create_all()

# Test route
@app.route('/test', methods=['GET'])
def test():
  return jsonify({'message': 'The server is running!'})

# Create a user
@app.route('/api/flask/users', methods=['POST'])
def create_user():
  try:
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
      'id': new_user.id,
      'name': new_user.name,
      'email': new_user.email
    }), 201
  
  except Exception as e:
    return make_response(jsonify({'message': 'Error creating user!', 'error': str(e)}), 500)
  
# Get all users
@app.route('/api/flask/users', methods=['GET'])
def get_users():
  try:
    users = User.query.all()
    users_data = [{'id': user.id, 'name': user.name, 'email': user.email} for user in users]
  
    return jsonify(
      users_data
    ), 200
  
  except Exception as e:
    return make_response(jsonify({'message': 'Error fetching users!', 'error': str(e)}), 500)
  
# Get user by id
@app.route('/api/flask/users/<id>', methods=['GET'])
def get_user(id):
  try:
    user = User.query.filter_by(id=id).first() # Get the first user with a matching id

    if user:
      return make_response(jsonify({'user': user.json()}), 200)
    return make_response(jsonify({'message': 'User not found!'}), 404)
  
  except Exception as e:
    return make_response(jsonify({'message': 'Error fetching user by Id!', 'error': str(e)}), 500)
  
# Update user by id
@app.route('/api/flask/users/<id>', methods=['PUT'])
def update_user(id):
  try:
    user = User.query.filter_by(id=id).first() # Get the first user with a matching id

    if user:
      data = request.get_json()
      user.name = data['name']
      user.email = data['email']
      db.session.commit()
      return make_response(jsonify({'message': 'User updated.'}), 200)
    return make_response(jsonify({'message': 'User not found!'}), 404)
  
  except Exception as e:
    return make_response(jsonify({'message': 'Error fetching user by Id!', 'error': str(e)}), 500)
  
# Delete user by id
@app.route('/api/flask/users/<id>', methods=['DELETE'])
def delete_user(id):
  try:
    user = User.query.filter_by(id=id).first() # Get the first user with a matching id

    if user:
      db.session.delete(user)
      db.session.commit()
      return make_response(jsonify({'message': 'User deleted.'}), 200)
    return make_response(jsonify({'message': 'User not found!'}), 404)
  
  except Exception as e:
    return make_response(jsonify({'message': 'Error deleting user by Id!', 'error': str(e)}), 500)