# 🔐 Secure Contact Management System

A backend-based **Contact Management System** developed using **Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt**.

The application allows registered users to securely manage their contacts. It also provides protected administrator functionality for managing users and contacts.

## 🚀 Technologies Used

* **Node.js** – JavaScript runtime
* **Express.js** – Backend web framework
* **MongoDB Atlas** – Cloud database
* **Mongoose** – MongoDB object modeling
* **bcrypt** – Password hashing
* **JSON Web Token (JWT)** – Authentication and authorization
* **dotenv** – Environment variable management
* **CORS** – Cross-Origin Resource Sharing

## ✨ Features

### 👤 User Features

* User signup
* Secure password hashing using bcrypt
* User login
* JWT token authentication
* Create contacts
* View own contacts
* Update own contacts
* Delete own contacts
* User-specific contact access

### 👨‍💼 Admin Features

* Admin login
* JWT-based admin authentication
* Admin authorization middleware
* View all users
* View all contacts
* Delete users
* Delete contacts

## 🔒 Security Design

Security is an important part of this project.

### Admin Signup Removed

A public **Admin Signup API is intentionally not provided**.

A route such as:

```text
POST /admin/signup
```

was avoided because allowing anyone to create an administrator account would create a security risk.

For example, if an application exposed:

```text
POST /admin/signup
```

any person could potentially create an admin account and obtain administrator-level access.

Therefore, the application provides:

```text
POST /admin/login
```

for existing administrators, but **does not provide a public admin registration route**.

### Admin Account Creation

Administrator accounts should be created through a controlled process, such as:

* Directly creating the administrator account in a controlled database/administrative environment
* A private administrative setup process
* A protected deployment or initialization process

Admin credentials should never be exposed through a public registration API.

### Password Protection

User and administrator passwords are stored using bcrypt hashing rather than plain-text passwords.

Example:

```javascript
const hasedpassword = await bcrypt.hash(password,10)
```

During login, the password is verified using:

```javascript
bcrypt.compare(password,user.password)
```

### JWT Authentication

After successful login, the application generates a JWT token.

User tokens contain information such as:

```text
userId
username
role
```

Admin tokens contain:

```text
username
role: admin
```

Protected routes require authentication middleware.

### Role-Based Authorization

Admin operations use:

```text
authmiddleware
adminmiddleware
```

This provides two levels of protection:

```text
Request
   ↓
Authentication
   ↓
JWT Verification
   ↓
Admin Authorization
   ↓
Admin Route
```

## 🗄️ Database Models

### User Model

| Field    | Type   | Required | Description        |
| -------- | ------ | -------- | ------------------ |
| username | String | Yes      | User username      |
| password | String | Yes      | Hashed password    |
| role     | String | No       | Defaults to `user` |

### Contact Model

| Field   | Type     | Required | Description          |
| ------- | -------- | -------- | -------------------- |
| name    | String   | Yes      | Contact name         |
| phoneNo | String   | Yes      | Contact phone number |
| userId  | ObjectId | Yes      | Owner of the contact |

The `userId` field connects each contact with the user who created it.

### Admin Model

| Field    | Type   | Required | Description           |
| -------- | ------ | -------- | --------------------- |
| username | String | Yes      | Admin username        |
| password | String | Yes      | Hashed admin password |
| type     | String | No       | Admin type            |

## 📡 API Endpoints

### 👤 User Authentication

#### User Signup

```http
POST /signup
```

Creates a new normal user account.

Example request:

```json
{
  "username": "vinay",
  "password": "123456"
}
```

---

#### User Login

```http
POST /login
```

Authenticates the user and returns a JWT token.

Example request:

```json
{
  "username": "vinay",
  "password": "123456"
}
```

---

# 📱 Contact APIs

These routes require user authentication.

### Create Contact

```http
POST /create
```

Example:

```json
{
  "name": "Rahul",
  "phoneNo": "9876543210"
}
```

The `userId` is obtained from the authenticated JWT token.

### Get User Contacts

```http
GET /contacts
```

Returns only the contacts belonging to the logged-in user.

### Update Contact

```http
PUT /update/:id
```

Updates a contact belonging to the authenticated user.

### Delete Contact

```http
DELETE /delete/:id
```

Deletes a contact belonging to the authenticated user.

# 👨‍💼 Admin APIs

Admin routes are protected using authentication and admin authorization middleware.

## Admin Login

```http
POST /admin/login
```

Authenticates an existing administrator.

Example:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

A JWT token is returned after successful authentication.

> There is intentionally **no `/admin/signup` route** in this project.

---

## View All Users

```http
GET /admin/users
```

Returns the registered users.

Passwords should not be returned in the response.

---

## Delete User

```http
DELETE /admin/user/delete/:id
```

Allows an authorized administrator to delete a user.

---

## View All Contacts

```http
GET /admin/contacts
```

Allows an authorized administrator to view all contacts.

---

## Delete Contact

```http
DELETE /admin/delete/:id
```

Allows an authorized administrator to delete a contact.

## 🔄 Application Flow

```text
                         APPLICATION
                              │
                 ┌────────────┴────────────┐
                 │                         │
                USER                      ADMIN
                 │                         │
              Signup                  Existing Admin
                 │                         │
               Login                     Login
                 │                         │
             JWT Token                JWT Token
                 │                         │
        Authentication              Authentication
                 │                         │
       ┌─────────┴─────────┐       Admin Authorization
       │         │         │              │
     Create    View      Update     ┌─────┴─────┐
    Contact   Contact   Contact     │           │
       │         │         │      Users      Contacts
       └─────────┴─────────┘         │           │
               │                  View/Delete  View/Delete
               │
             Delete
             Contact
               │
             MongoDB Atlas
```

## 🧩 Middleware

The project uses two middleware components:

```text
middlewares/
│
├── usermiddleware.js
└── adminmiddleware.js
```

### User Middleware

Used to authenticate protected user operations:

```text
POST   /create
GET    /contacts
PUT    /update/:id
DELETE /delete/:id
```

### Admin Middleware

Used to protect administrator operations:

```text
GET    /admin/users
DELETE /admin/user/delete/:id
GET    /admin/contacts
DELETE /admin/delete/:id
```

## ⚙️ Environment Variables

Create a `.env` file:

```env
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
jwttoken=YOUR_SECRET_JWT_KEY
port=5000
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
jwttoken=my_secret_key
port=5000
```

The `.env` file must not be uploaded to GitHub.

Add:

```text
node_modules/
.env
```

to `.gitignore`.

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/vinaylv515206-ai/SecureContactManagementSystem.git
```

### 2. Open the project

```bash
cd secure-contact-management-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create `.env` and add your MongoDB Atlas connection string and JWT secret.

### 5. Start the server

```bash
node server.js
```

Expected output:

```text
mongodb connected succesfully
server running succesfully
```

## 🧪 API Testing

The APIs can be tested using:

* Thunder Client
* Postman

### User Testing Flow

```text
1. Signup
      ↓
2. Login
      ↓
3. Receive JWT
      ↓
4. Create Contact
      ↓
5. View Contacts
      ↓
6. Update Contact
      ↓
7. Delete Contact
```

### Admin Testing Flow

```text
1. Existing Admin Login
      ↓
2. Receive Admin JWT
      ↓
3. View Users / Contacts
      ↓
4. Delete User / Contact
```

## 🛠️ CRUD Operations

### User Contact CRUD

| Operation | Method | Endpoint      |
| --------- | ------ | ------------- |
| Create    | POST   | `/create`     |
| Read      | GET    | `/contacts`   |
| Update    | PUT    | `/update/:id` |
| Delete    | DELETE | `/delete/:id` |

### Admin Operations

| Operation      | Method | Endpoint                 |
| -------------- | ------ | ------------------------ |
| Login          | POST   | `/admin/login`           |
| View Users     | GET    | `/admin/users`           |
| Delete User    | DELETE | `/admin/user/delete/:id` |
| View Contacts  | GET    | `/admin/contacts`        |
| Delete Contact | DELETE | `/admin/delete/:id`      |

## 📚 Learning Outcomes

Through this project, I learned and implemented:

* Node.js backend development
* Express.js
* MongoDB Atlas
* Mongoose
* REST API development
* CRUD operations
* JWT authentication
* Role-based authorization
* Password hashing with bcrypt
* Authentication middleware
* Admin authorization middleware
* Environment variables
* API testing
* User-specific database operations
* Secure administrator access design

## 🔮 Future Improvements

Possible future improvements include:

* Input validation
* Duplicate username prevention
* Refresh tokens
* Forgot password functionality
* Contact search and filtering
* Pagination
* Rate limiting
* Improved error handling
* Production deployment
* Secure admin initialization system

## 👨‍💻 Author

**Yanala Sri Vinay Sai Manikanta**

B.Tech CSE Student

## 📄 License

This project is developed for educational and portfolio purposes.

