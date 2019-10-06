from server.app import app, db
from server.models.ticket import Ticket
from server.models.user import User

print("Run python create_users.py -i to add users");
print("Run createUser(ticket_limit, name, is_admin)");
print("ticket_limit == 0 will give the account unlimited tickets!");
def createUser(tickets, name, is_admin):
    user = User(tickets, name, is_admin)
    db.session.add(user)
    db.session.commit()
    print("CREATED USER " + user.description)
    print("TOKEN: " + user.token)