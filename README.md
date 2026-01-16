# Residential Apartment Rental Portal

A full-stack web application to manage residential apartment rentals, bookings, payments, messaging, users, and admin reporting.

---

## Mini Project Brief

### Objective
- **Public / Resident App (Angular 20):**
  Browse flats, view amenities (gym, pool, parking), request bookings, and view booking status.
- **Admin Portal (Angular 20):**
  Manage towers, units, amenities; approve or decline bookings; manage tenants; and view occupancy and mock payment data.
- **Backend (Flask):**
  Provide REST APIs with authentication, PostgreSQL persistence, JWT-based sessions, and Dockerized deployment.

This project demonstrates a complete **full-stack web solution** covering UI, API, database design, and containerized cloud deployment.

---

## Tech Stack

- **Frontend:** Angular 20, Tailwind CSS, TypeScript
- **Backend:** Flask, Flask-SQLAlchemy, Flask-CORS, Flask-JWT-Extended, Blueprints
- **Database:** PostgreSQL 15
- **DevOps:** Docker, Docker Compose
- **Cloud:** Google Cloud Platform (Compute Engine – Free Tier)

---

## Features

### User Portal
- User registration and login with JWT authentication
- Browse available apartments
- Search units by tower name and location
- Book apartments and request demo visits via messaging
- View booking status
- User profile with bookings, leases, payments, and messages
- Responsive and modern UI using Tailwind CSS

### Admin Portal
- Dashboard with booking, revenue, and user reports
- Download CSV reports
- Tower management (add, edit, delete)
- Unit management with status tracking (available, occupied, maintenance)
- Amenity management
- Booking approval / rejection
- User management with detailed user activity view
- Lease and payment management
- Messaging with users

---

## Project Structure

```
Residential Apartment Rental Portal/
├── backend/
│   ├── app.py                  # Flask application entry point
│   ├── models.py               # Database models
│   ├── migrations/             # Managing database schemas
│   ├── routes/                 # Separate route for db models using Blueprint
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── Admin-portal/            # Admin Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/  # Admin components
│   │   │   │   ├── services/    # API services
│   │   │   │   ├── guards/      # Auth & admin guards
│   │   │   │   └── interceptors/ # HTTP interceptors
│   │   │   ├── styles.css
│   │   │   └── index.html
│   │   ├── package.json
│   │   ├── postcssrc.json     # Tailwind CSS Json file
│   │   ├── Dockerfile
│   └── User-portal/           # User Interface Angular application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/  # UI components
│       │   │   ├── services/    # API services
│       │   │   └── guards/      # Route guards
│   │   │   │   └── interceptors/ # HTTP interceptors 
│       │   ├── styles.css
│       │   └── index.html
│       ├── package.json
│       ├── postcssrc.json    # Tailwind CSS Json file
│       ├── Dockerfile
├── .env
├── docker-compose.yml
├── .gitignore
└── README.md


---

## Prerequisites (Local Development)

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose
- Git

---

## Running Locally (Without Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt
flask create-db
python app.py
```


### Running User Portal Locally

```bash
cd frontend/User-portal
npm install
ng serve
```

### Running Admin Portal Locally

```bash
cd frontend/Admin-portal
npm install
ng serve
```

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

### Docker Running

1. Clone the repository

git clone <repository-url>
cd "Residential Apartment Rental Portal"

2. Start all services with Docker Compose

```bash
docker-compose up --build
```

- Build and start the PostgreSQL database
- Build and start the Flask backend API
- Build and start the User Portal (Angular)
- Build and start the Admin Portal (Angular)
- Set up networking between all containers

Seed Database

```bash
docker-compose exec backend flask create-db
```

Check if Database ,tables and data exists

```bash
docker-compose exec backend flask create-db
```

In Frontend/Admin-portal and Frontend/User-portal terminal

```bash
ng build --configuration=production
```
In src/environments/environment.development.ts of both Admin-portal and User-portal

change -> apiUrl:'http://<Backend_Container_Name>:5000/api'


3. Accessing the application

Admin portal : http://localhost:4200
User Portal : http://localhost:4208
Backend API : http://localhost:5000/api


## Google Cloud Deployment

This project is deployed on Google Cloud Platform using a Compute Engine Virtual Machine.
No application code was modified for deployment. Only infrastructure and environment
configuration was used.

### VM Setup
- Platform: Google Cloud Compute Engine
- OS: Ubuntu 22.04 LTS
- Access: SSH
- Docker-based deployment
- Free Tier compatible

### Commands Used

# Connect to VM
gcloud compute ssh <VM_NAME>

# Update system
sudo apt update

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Clone repository
git clone <GIT_REPOSITORY_URL>
cd Residential-Apartment-Rental-Portal

# Build and start containers
docker compose up -d --build

# Verify running containers
docker ps

### Environment Configuration

JWT authentication requires secret keys to be set as environment variables.

export JWT_SECRET_KEY="super-secret-key"
export SECRET_KEY="super-secret-key"

Restart backend container after setting variables:

docker restart flask_backend

### Firewall Rules

Allow public access to required ports.

gcloud compute firewall-rules create allow-app-ports \
  --allow tcp:4200,tcp:4208,tcp:5000 \
  --source-ranges 0.0.0.0/0

### Seed Database

```bash
docker-compose exec backend flask create-db
```

### Database Access

PostgreSQL runs inside a Docker container.

docker exec -it postgres psql -U postgres

## Install nano

```bash
sudo apt update
sudo apt install nano -y
```

### Change api_url in src/environments/environment.development.ts of both Admin-portal and User-portal

```bash
cd Admin-portal
nano src/environments/environment.prod.ts
change -> apiUrl:'http://<EXTERNAL_API>:4200'
ctrl + o
enter
ctrl + x
```
```bash
cd User-portal
nano src/environments/environment.prod.ts
change -> apiUrl:'http://<EXTERNAL_API>:4208'
ctrl + o
enter
ctrl + x
```
### Add the above url in backend/app.py

```bash
cd backend
nano app.py
In line "origins": ["http://localhost:4200",'http://localhost:4208']
Add "origins": "*" or "origins": ["http://localhost:4200",'http://localhost:4208',"http://<EXTERNAL_API>:4200","http://<EXTERNAL_API>:4208"]
ctrl + o
enter
ctrl + x
```

### Rebuild docker

```bash
docker-compose down
docker-compose up --build -d
docker ps (optional:to check if containers are running)
```

### Application Access

User Portal:
http://<VM_EXTERNAL_IP>:4208

Admin Portal:
http://<VM_EXTERNAL_IP>:4200

Backend API:
http://<VM_EXTERNAL_IP>:5000/api


### Deployment Summary

- Hosted on Google Cloud Compute Engine
- Dockerized multi-service application
- Single public deployment link
- Admin and User portals served from the same VM
- No source code changes were made


### DEFAULT CREDENTIALS

For Admin

Email: admin@rental.com
Password: admin123

For User

Email: john@example.com
Password: user1

or

Email: jane@example.com
Password : user2

# Database Schema

### Users

- Stores user information with role-based access (admin/resident)
- Password hashing with werkzeug security

### Tower

- Residential building information
- Multiple units per tower

### Unit

- Individual apartment details
- Status tracking (available, occupied, maintenance)
- Pricing and specifications

### Amenity

- Facility information (gym, pool, parking, etc.) for a tower
- capacity management

### Bookings

- Amenity booking requests
- Status workflow (pending → approved/declined)
- Admin notes for feedback

### Lease

- Tenant-unit associations
- Lease period and payment tracking

### Payment

- Mock payment records
- Transaction history

### Message

- Manages the interaction between users and admin

## 🧪 Sample Data

The application comes pre-seeded with:

- 3 users (1 admin, 2 residents)
- 2 towers (Sunrise Tower, Sunset Tower)
- 5 apartment units
- 6 amenities (Pool, Gym, Parking, Club House, Tennis Court, Kids Play Area)
- Sample bookings,lease and payments

## 🔒 Security Features

- JWT Authentication: Secure token-based authentication
- Password Hashing: Werkzeug password hashing
- HTTP-Only Tokens: Secure token storage
- CORS Configuration: Controlled cross-origin requests
- Route Guards: Protected routes in Angular
- Input Validation: Both frontend and backend validation

### Deployment Summary

- Deployed on Google Cloud Compute Engine
- Fully Dockerized multi-service application
- Single VM hosting Admin and User portals
- No application code changes were made

### Application WorkFlow

## User Workflow (Resident)

1. Register / Login

    - User registers or logs in using email and password.
    - Backend validates credentials and generates a JWT token.
    - Token is attached to all authenticated API requests.

2. Browse Apartments

    - View available towers and apartment units.
    - Search and filter units by tower name and location.
    - View rent, unit status, amenities, and specifications.

3. Booking / Visit Request

    - User submits a booking request for an apartment.
    - Booking status is initially set to Pending.
    - User can send a message requesting a site visit or demo.

4. Track Booking Status

    - User can track booking status in real time:
        Pending
        Approved
        Declined
    - Status updates automatically after admin action.

5. Profile Dashboard

    - User can view:
        Booking history
        Lease details
        Payment records (mock data)
        Messages exchanged with admin

6. Messaging

    - User communicates with admin regarding:
        Booking confirmation
        Visit requests
        Lease and payment queries

## Admin Workflow

1. Admin Login

    - Admin logs in using secure credentials.
    - Role-based access ensures only admins can access admin features.

2. Tower Management

    - Add, edit, and delete residential towers.

3. Unit Management

    - Add and manage apartment units under towers.
    - Update unit status:
        Available
        Occupied
        Maintenance
    - View Occupant details if status is occupied

4. Amenity Management

    - Add, edit, or remove amenities for towers.
    - Manage amenity capacity .

5. Booking Approval

    - Review user booking requests.
    - Approve or decline bookings.
    - Add admin remarks for user visibility.

6. Lease & Payment Management

    - Create leases after booking approval.
    - View, edit, and manage lease details.
    - Track mock payment records linked to leases.

7. User Management

    - View registered users.
    - Access individual user details (click on particular user):
        Bookings
        Leases
        Payments
        Messages

8. Reports

    - Generate reports for:
        Users
        Bookings
        Revenue
    - Download reports in CSV format.

9. Messaging

    - Respond to user messages related to:
        Bookings
        Visits
        Lease and payments
 

AUTHOR
Sameeksha Nayak
