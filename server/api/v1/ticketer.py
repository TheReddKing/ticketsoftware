from flask_restful import Api, Resource, reqparse
from server.models.ticket import Ticket
from server.models.user import User
from server.controllers.email import sendCodeEmail
from server.app import app, db
import requests
import json

ticketAddParser = reqparse.RequestParser(bundle_errors=True)
ticketAddParser.add_argument(
    'email', help='Email cannot be blank', required=True)
ticketAddParser.add_argument(
    'token', help='User Token cannot be blank', required=True)
ticketAddParser.add_argument(
    'notes', help='Notes cannot be blank', required=True)

class Add(Resource):
    def post(self):
        data = ticketAddParser.parse_args()
        email = data['email']
        notes = data['notes']
        token = data['token']
        user = User.query.filter_by(token=token).first()
        if (user is None):
            return {'success': False, 'error': 'Can\'t find user!'}
        if (len(email) == 0 or "@" not in email):
            return {'success': False, 'error': "Email incorrect"}
        # Limiting tickets sold!
        if (user.ticket_limit != 0):
            if(Ticket.query.filter_by(user=user).count() > user.ticket_limit):
                return {'success': False, 'error': 'Too many tickets!'}
        
        ticket = Ticket(email, notes, user)
        retry = 10
        committed = False
        while (not committed and retry > 0):
            try:
                db.session.add(ticket)
                db.session.commit()
            except exc.IntegrityError:
                db.session.rollback()
                ticket.generateCode()
                retry -= 1
            else:
                committed = True
        sendCodeEmail(email, ticket.code)
        return {'success': True}


ticketGetParser = reqparse.RequestParser(bundle_errors=True)
ticketGetParser.add_argument(
    'token', help='User Token cannot be blank', required=True)

class Get(Resource):
    def post(self):
        data = ticketGetParser.parse_args()

        token = data['token']
        user = User.query.filter_by(token=token).first()
        if (user is None):
            return {'success': False}
        tickets = []
        if (user.is_admin):
            tickets = [x.json() for x in Ticket.query.all()]
        else:
            tickets = [x.json() for x in Ticket.query.filter_by(user=user)]
        return {'success': True, 'tickets': tickets, "limit": user.ticket_limit if user.ticket_limit != 0 else "infinity"}


class Login(Resource):
    def post(self):
        # Get is same as login
        data = ticketGetParser.parse_args()
        token = data['token']
        user = User.query.filter_by(token=token).first()
        if (user is None):
            return {'success': False}
        return {'success': True, 'name': user.description}