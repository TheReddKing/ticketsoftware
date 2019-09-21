from server.app import app, db
from server.models.ticket import Ticket
from server.models.user import User

# user = User(1, "test account", False)
# db.session.add(user)
# db.session.commit()

user = User(0, "MIT CSC", True)
db.session.add(user)
print(user.token)
db.session.commit()

user = User(0, "Harvard CSA", True)
db.session.add(user)
print(user.token)
db.session.commit()

