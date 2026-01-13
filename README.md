Residential Apartment Rental Portal

A full-stack web application to manage residential apartment rentals, bookings, payments, messaging, and admin reporting.

TECH STACK
Frontend: Angular, Tailwind CSS
Backend: Flask, Flask-SQLAlchemy, JWT
Database: PostgreSQL
DevOps: Docker, Docker Compose

FEATURES
User:
- Register & Login
- View units
- Book apartments
- Messaging with admin

Admin:
- Manage towers, units, amenities
- Approve/reject bookings
- Manage users
- View reports (Bookings, Revenue, Users)
- Download CSV reports

PROJECT STRUCTURE
Backend/
  app.py
  models.py
  routes/
Frontend/
  src/app/

RUN WITHOUT DOCKER
Backend:
- python -m venv venv
- pip install -r requirements.txt
- flask create-db
- python app.py

Frontend:
- npm install
- ng serve

RUN WITH DOCKER
- docker-compose build
- docker-compose up
- docker-compose exec backend flask create-db

DEFAULT ADMIN
Email: admin@rental.com
Password: admin123

AUTHOR
Sameeksha Nayak

