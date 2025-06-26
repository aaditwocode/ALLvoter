# 🗳️ ALLvoter - Voting Application Backend

**ALLvoter** is a secure and scalable backend application for an online voting system. It enables users to register with their Aadhar Card Number, view candidates, and vote (only once). It also provides admin functionalities for managing candidates.

---

## 🔧 Technologies Used

* **Node.js**
* **Express.js**
* **MongoDB**
* **JWT (JSON Web Tokens)** - For secure authentication

---

## ✨ Features

* 🔐 **User Authentication**

  * Sign up and log in using Aadhar Card Number and password

* 👤 **User Functionalities**

  * View list of candidates
  * Vote for one candidate only
  * View profile
  * Change password

* 🛠️ **Admin Functionalities**

  * Add new candidates
  * Update existing candidate information
  * Delete candidates
  * **Note:** Admins **cannot vote**

---

## 🚀 Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Prince-1501/voting_app.git
   cd voting_app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Run the Server:**

   ```bash
   npm start
   ```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| POST   | `/signup` | Register a new user     |
| POST   | `/login`  | Log in an existing user |

---

### 🧑‍💼 Candidates

| Method | Endpoint          | Description            | Access |
| ------ | ----------------- | ---------------------- | ------ |
| GET    | `/candidates`     | Get all candidates     | Public |
| POST   | `/candidates`     | Add new candidate      | Admin  |
| PUT    | `/candidates/:id` | Update candidate by ID | Admin  |
| DELETE | `/candidates/:id` | Delete candidate by ID | Admin  |

---

### 🗳️ Voting

| Method | Endpoint                 | Description                        | Access |
| ------ | ------------------------ | ---------------------------------- | ------ |
| GET    | `/candidates/vote/count` | Get vote counts for all candidates | Public |
| POST   | `/candidates/vote/:id`   | Vote for a candidate by ID         | User   |

---

### 👤 User Profile

| Method | Endpoint                  | Description                | Access |
| ------ | ------------------------- | -------------------------- | ------ |
| GET    | `/users/profile`          | Get logged-in user profile | User   |
| PUT    | `/users/profile/password` | Change user password       | User   |

---

## 🔐 Access Control

* **JWT** is used for authenticating both users and admins.
* Roles are checked to ensure:

  * **Users** can vote only once and manage their own profiles.
  * **Admins** can manage candidates but cannot vote.


## 📬 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
