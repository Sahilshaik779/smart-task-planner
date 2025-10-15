# 🚀 Momentum Planner

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg)
![Docker](https://img.shields.io/badge/Docker-20.10+-2496ED.svg)

An intelligent web application designed to transform complex goals into clear, actionable project plans. This tool leverages the power of Google's Gemini API to provide instant task breakdowns, dependency mapping, and timeline generation, helping users build momentum and achieve their objectives efficiently.

✨ **[Live Demo - Coming Soon!]**

---

## 📋 Project Overview

In a world of ambitious projects and tight deadlines, the hardest part is often getting started. Momentum Planner tackles this initial inertia by bridging the gap between a high-level goal and a concrete, step-by-step plan. Users can simply describe their objective, and the AI will generate a comprehensive project timeline, complete with phases, priorities, and dependencies, turning overwhelming goals into manageable tasks.

---

## 🔥 Core Features

-   **AI-Powered Planning:** Utilizes Google's `gemini-pro-latest` model to intelligently break down any goal into a detailed list of actionable tasks.
-   **Dynamic Timeline Generation:** Automatically calculates realistic start and end dates for each task based on estimated hours and dependencies.
-   **Interactive UI:** A clean, modern, and fully responsive interface built with React and Tailwind CSS, featuring multiple views for your plan.
-   **Expandable Task Details:** Click on any task to view an AI-generated elaboration, including sub-tasks and productivity suggestions.
-   **Dependency Graph:** Visualize the entire project flow with an auto-generated graph showing how tasks connect and depend on one another.
-   **Interactive Calendar View:** See your entire project schedule laid out on a full-page calendar.
-   **PDF & JSON Export:** Easily download your generated plan as a professionally formatted PDF for sharing or as a JSON file for data integration.

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, decoupled architecture, featuring a Python backend and a React frontend.

-   **Backend:**
    -   **Framework:** FastAPI
    -   **Database:** PostgreSQL (with SQLAlchemy ORM)
    -   **Data Validation:** Pydantic
    -   **AI Integration:** Google Generative AI SDK
-   **Frontend:**
    -   **Library:** React
    -   **Build Tool:** Vite
    -   **Styling:** Tailwind CSS
    -   **Diagrams:** Mermaid.js
    -   **PDF Generation:** jsPDF & html2canvas
-   **Database:**
    -   **Production:** PostgreSQL
    -   **Development:** SQLite
-   **Containerization:**
    -   Docker & Docker Compose

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Python 3.11+
-   Node.js 20+
-   Docker Desktop

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/momentum-planner.git](https://github.com/your-username/momentum-planner.git)
    cd momentum-planner
    ```
2.  **Setup Backend**
    ```sh
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env # IMPORTANT: Add your GEMINI_API_KEY to this file
    ```
3.  **Setup Frontend**
    ```sh
    cd ../frontend
    npm install
    ```
4.  **Run the Application (Local Mode)**
    - In one terminal (in the `backend` folder), run: `uvicorn app.main:app --reload`
    - In a second terminal (in the `frontend` folder), run: `npm run dev`

---

