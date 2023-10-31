from flask import current_app, Flask, g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

_database = None

def init(app: Flask) -> None:
    global _database
    _database = SQLAlchemy(model_class=DeclarativeBase)
    _database.init_app(app)
    app.teardown_appcontext(teardown)

def get() -> SQLAlchemy:
    """Get the database connection for the session."""
    if 'db' not in g:
        g.db = _database
    return g.db

def teardown(exception):
    """Close the database connection on session teardown."""
    db: SQLAlchemy = g.pop('db', None)
    if db is not None:
        db.session.close()