## Getting Your Email & DB Credentials

- **EMAIL_USER**: Use a Gmail account (like `youremail@gmail.com`)
- **EMAIL_PASS**: Create an "App Password" from your Google Account → Security → App Passwords  
  *(Only available if 2-Step Verification is enabled)*

### DB Config:
- `DB_HOST` = usually `localhost`
- `DB_USER` = your MySQL username (`root` by default)
- `DB_PASS` = your MySQL password
- `DB_NAME` = name of the database (`gs_tech_db`)

--

## Database Tables

- **`contacts`**: stores all contact form submissions  
- **`user_tracking`**: stores all tracking logs and session activities  

---

## Setup Steps

1. Run `npm install` to install dependencies  
2. Create and verify `.env` file with above credentials  
3. Start the backend using `npm start`  
4. Backend server runs at: `http://localhost:5000`

---

## API Endpoints


-URL: http://localhost/5000/

- `POST /contact`  
  → Accepts contact form data (name, email, message), stores in DB, sends email to admin  

- `POST /track`  
  → Accepts user tracking data (device info, OS, pages viewed, session time, etc.)  

- `GET /tracking-data`  
  → (Optional, secured by secret key) Returns tracking logs for use in frontend charts/analytics  

---
