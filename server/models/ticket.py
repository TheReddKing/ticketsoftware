from server.app import db
import datetime
import json
import secrets

class Ticket(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True, unique=True,  autoincrement=True)
    email = db.Column(db.String(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("User")

    submitted_at = db.Column(db.DateTime, default=datetime.datetime.now)

    code = db.Column(db.Text, unique=True)

    notes = db.Column(db.Text, default="")

    def __init__(self, email, notes, user, ticketNumber=""):
        self.email = email
        self.notes = notes
        self.user = user
        self.generateCode()

    def generateCode(self):
        self.code = secrets.token_hex(16)

    def json(self):
        return {"email": self.email, "code": self.code,"id": self.id,"user": self.user.description, "notes": self.notes}