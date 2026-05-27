<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

<br />

# AI Interview Preparation Platform 🚀
A production-ready, full-stack AI-driven application designed to help software engineers ace technical interviews through realistic mock sessions, interactive coding environments, and granular AI-driven feedback.

---

## 🌟 Key Features

- 🧠 **AI-Powered Mock Interviews**: Dynamic, situational question generation tailored to specific Job Roles, Categories (DSA, System Design, etc.), and Difficulty Levels.
- 👨‍💻 **Secure Online Code Compiler**: Execute Python, Java, and C++ code natively in the browser. Powered by isolated, ephemeral Docker containers running locally.
- 📊 **Advanced Analytics Dashboard**: Track your performance across categories with visual radar charts, historical trend-lines, and gamified leaderboards.
- ⚡ **Deep AI Feedback Engine**: Answers are rigorously evaluated for technical depth, communication, and confidence—returning strengths, weaknesses, and actionable tips.
- 🔐 **Robust Authentication**: Secure JWT-based auth with `bcrypt` hashed passwords and protected routing.
- 🏗 **Enterprise DevOps Pipeline**: Fully Dockerized (multi-stage builds), Nginx Reverse Proxy, and CI/CD pipelines via GitHub Actions and Jenkins.

---

## 🏗 Architecture
The platform is built using the **MERN** stack plus Docker for sandbox execution.

* **Frontend**: React.js + Vite, Tailwind CSS v4, Monaco Editor, Recharts.
* **Backend**: Node.js, Express, Mongoose (MongoDB).
* **Execution Sandbox**: Docker Engine API via `child_process` mounting ephemeral volumes.
* **Deployment Orchestration**: `docker-compose` wrapping Nginx, Node, and MongoDB into an isolated network bridge.

---

## 🛠 Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally (or MongoDB Atlas URI)
- Docker Desktop (Required for the Code Compiler sandbox)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-interview-platform.git
cd ai-interview-platform
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
*(Ensure you update `.env` with a strong `JWT_SECRET` and `MONGO_URI`)*

Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 🚢 Production Deployment

This project includes fully configured `.github/workflows/main.yml` and a `Jenkinsfile`. 
To deploy locally using the production containers:

```bash
# This spins up the Nginx Frontend, Node Backend, and MongoDB Database automatically
docker-compose up --build -d
```
Access the production build at `http://localhost`.

For full deployment specifics, please refer to the `DEPLOYMENT.md` file.

---

## 📸 Screenshots

*(Add your application screenshots here for your GitHub Portfolio)*
- Dashboard & Leaderboard
- Active AI Interview Session
- Performance Analytics & Charts
- Monaco Code Compiler Sandbox

---

## 📝 License
This project is licensed under the MIT License.
