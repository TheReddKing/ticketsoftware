from server.app import db
import datetime
import secrets


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, unique=True,  autoincrement=True)

    token = db.Column(db.String(), primary_key=True, unique=True)
    token_created_at = db.Column(db.DateTime, default=datetime.datetime.now)
    
    description = db.Column(db.Text, default="")
    ticket_limit = db.Column(db.Integer, default=0)
    is_admin = db.Column(db.Boolean, default=False)

    def __init__(self, ticket_limit, description="", is_admin=False):
        self.generateLoginToken()
        self.ticket_limit = ticket_limit
        self.description = description
        self.is_admin = is_admin

    def generateLoginToken(self):
        self.token = secrets.token_hex(32)