import os
from flask import Flask, request, make_response
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, current_user
from flask_migrate import Migrate
from flask_restful import Api, Resource, reqparse
from models import db, User, Campaign, Donation, bcrypt
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Home(Resource):
    def get(self):
        response_dict = {
            "Message": "Hello, Fundraiser"
        }
        response = make_response(response_dict, 200)
        return response

# User Resource and List Resource
user_parser = reqparse.RequestParser()
user_parser.add_argument('username')
user_parser.add_argument('password')
user_parser.add_argument('email')

class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user.to_dict()

    def patch(self, user_id):
        data = user_parser.parse_args()
        user = User.query.get_or_404(user_id)
        if 'username' in data and data['username']:
            user.username = data['username']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        if 'email' in data and data['email']:
            user.email = data['email']
        db.session.commit()
        return user.to_dict()

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"Message": "User deleted .."}, 204

class UserListResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

    def post(self):
        data = user_parser.parse_args()
        new_user = User(username=data['username'], email=data['email'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user) 
        return new_user.to_dict(), 201

# Login Resource
class LoginResource(Resource):
    def post(self):
        try:
            data = user_parser.parse_args()
            user = User.query.filter_by(username=data['username']).first()
            if user and user.check_password(data['password']):
                login_user(user, remember=True)  # Log in the user
                return {"Message": "Logged in successfully", "user_id": user.user_id}, 200
            return {"Message": "Invalid username or password"}, 401
        except Exception as e:
            print(f"Error during login: {e}")
            return {"Message": "An error occurred during login"}, 500

# Logout Resource
class LogoutResource(Resource):
    def post(self):
        logout_user()
        return {"Message": "Logged out successfully"}, 200

# Campaign Resource and List Resource
campaign_parser = reqparse.RequestParser()
campaign_parser.add_argument('title')
campaign_parser.add_argument('description')
campaign_parser.add_argument('goal_amount', type=float)
campaign_parser.add_argument('current_amount', type=float)
campaign_parser.add_argument('start_date')
campaign_parser.add_argument('end_date')
campaign_parser.add_argument('user_id', type=int)

class CampaignResource(Resource):
    def get(self, campaign_id):
        campaign = Campaign.query.get_or_404(campaign_id)
        return campaign.to_dict()

    def patch(self, campaign_id):
        campaign = Campaign.query.get_or_404(campaign_id)
        data = request.get_json() 
        if 'title' in data and data['title']:
            campaign.title = data['title']
        if 'description' in data and data['description']:
            campaign.description = data['description']
        if 'goal_amount' in data and data['goal_amount'] is not None:
            campaign.goal_amount = data['goal_amount']
        if 'current_amount' in data and data['current_amount'] is not None:
            campaign.current_amount = data['current_amount']
        if 'start_date' in data and data['start_date']:
            campaign.start_date = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data and data['end_date']:
            campaign.end_date = datetime.fromisoformat(data['end_date'])
        db.session.commit()
        return campaign.to_dict()

    def delete(self, campaign_id):
        campaign = Campaign.query.get_or_404(campaign_id)
        db.session.delete(campaign)
        db.session.commit()
        return '', 204

class CampaignListResource(Resource):
    def get(self):
        campaigns = Campaign.query.all()
        return [campaign.to_dict() for campaign in campaigns]

    def post(self):
        data = request.get_json()
        start_date = datetime.fromisoformat(data['start_date'])
        end_date = datetime.fromisoformat(data['end_date'])
        new_campaign = Campaign(
            title=data['title'],
            description=data['description'],
            goal_amount=data['goal_amount'],
            current_amount=data.get('current_amount', 0.0),
            start_date=start_date,
            end_date=end_date,
            user_id=data['user_id']
        )
        db.session.add(new_campaign)
        db.session.commit()
        return new_campaign.to_dict(), 201

# Donation Resource and List Resource
donation_parser = reqparse.RequestParser()
donation_parser.add_argument('amount', type=float)
donation_parser.add_argument('date')
donation_parser.add_argument('user_id', type=int)
donation_parser.add_argument('campaign_id', type=int)

class DonationResource(Resource):
    def get(self, donation_id):
        donation = Donation.query.get_or_404(donation_id)
        return donation.to_dict()

    def patch(self, donation_id):
        data = donation_parser.parse_args()
        donation = Donation.query.get_or_404(donation_id)
        if 'amount' in data and data['amount'] is not None:
            donation.amount = data['amount']
        if 'date' in data and data['date']:
            donation.date = datetime.fromisoformat(data['date'])
        if 'user_id' in data and data['user_id']:
            donation.user_id = data['user_id']
        if 'campaign_id' in data and data['campaign_id']:
            donation.campaign_id = data['campaign_id']
        db.session.commit()
        return donation.to_dict()

class DonationListResource(Resource):
    def get(self):
        donations = Donation.query.all()
        return [donation.to_dict() for donation in donations]

    def post(self):
        data = donation_parser.parse_args()
        new_donation = Donation(
            amount=data['amount'],
            date=datetime.fromisoformat(data['date']),
            user_id=data['user_id'],
            campaign_id=data['campaign_id']
        )
        campaign = Campaign.query.get(data['campaign_id'])
        if campaign:
            campaign.current_amount += data['amount']
        db.session.add(new_donation)
        db.session.commit()
        return new_donation.to_dict(), 201


# End points here........
api.add_resource(Home, '/')
api.add_resource(UserListResource, '/users')
api.add_resource(UserResource, '/users/<int:user_id>')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(CampaignListResource, '/campaigns')
api.add_resource(CampaignResource, '/campaigns/<int:campaign_id>')
api.add_resource(DonationListResource, '/donations')
api.add_resource(DonationResource, '/donations/<int:donation_id>')

if __name__ == '__main__':
    app.run(debug=True)
