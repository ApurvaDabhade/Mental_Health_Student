# 🧠 SAHAY – Digital Mental Health Support Platform

**Problem Statement:** **PKPHM03 – Mental Health Support for Underserved Communities**

---

## 📌 Overview

Mental health awareness in India is improving, yet access to **timely, culturally sensitive, and stigma-free support** remains limited — especially for students, rural youth, and community workers.

**Sahay** is a digital mental wellness platform that provides:

* Early screening
* AI-based emotional assistance
* Professional counselling connection
* Peer community support
* Multilingual resources
* Daily well-being tracking
* Frontline worker training (teachers, ASHA workers, wardens)

---

## 🌟 Core Features

### 🔐 User & Counsellor Access

* Role-based login
* Secure authentication powered by **Firebase Auth**

### 📅 Counsellor Appointment Booking

* Book verified counsellor sessions
* Referral suggestions based on assessment score severity

### 📊 PHQ-9 & GAD-7 Self-Assessments

* Scientifically validated tools for:

  * Depression (PHQ-9)
  * Anxiety (GAD-7)
* Auto-scoring + severity feedback

### 📝 Daily Mood Check-In

* Track emotional patterns over time

### 🤖 DBT-Based Emotional AI Chatbot

* Supports grounding, validation, coping strategies
* 24×7 listener for crisis-free first support

### 🌍 Multilingual Support Hub

* Mental well-being guides in accessible languages
* Designed for rural and semi-urban inclusion

### 🤝 Anonymous Peer Community

* Support group without identity exposure
* Community guidelines + reporting safety layer

### 🧘 Wellness & Mindfulness Zone

* Guided meditation
* Breathing tools with timers
* Habit reminders

### ⭐ Training Lab (Innovation Layer)

For frontline responders **(teachers, ASHA workers, wardens)**:

* Listening skills
* Suicide red-flag protocol
* Trauma-safe language
* Escalation map

---

## 🔒 Privacy & Safety

* Anonymous postings (no names shown in community)
* No personal identity leakage
* Moderation triggers and escalation safety rules

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Firebase Authentication

### Backend

* Node.js
* Express.js
* MongoDB / Atlas

### AI & Wellness Layer

* DBT-based emotional support model
* PHQ-9 & GAD-7 scoring engine

---

## 🧩 Environment Setup

### 🔧 Backend `.env`

Create file inside `/Backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 🔥 Frontend `.env` (Firebase)

Create file inside `/Frontend`:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ▶️ Local Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone (https://github.com/dolly-balwani/PKP.git)
cd <PKP>
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

**Expected Output**

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 3️⃣ Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

Access app at:

👉(http://localhost:5173)

---

## 🎥 Demo Video

📍**Link:**
(https://drive.google.com/file/d/1elDAzfWSYPG6TIy0kWTzkv2TTXxo00P-/view?usp=drivesdk)






