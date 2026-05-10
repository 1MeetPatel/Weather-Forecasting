# 🌦️ SkyCast — High-Fidelity Weather Intelligence

**SkyCast** is a modern, full-stack weather forecasting application designed to provide precise, real-time meteorological data with a premium user experience. Built with a Flask backend and a Vite-powered React frontend, SkyCast leverages the Open-Meteo API to deliver accurate 5-day forecasts, temperature trends, and precipitation analytics without the need for complex API keys.

---

## ✨ Features

### 📡 Real-Time Intelligence
- **Instant Geocoding**: Automatically resolves city names to precise coordinates.
- **Current Conditions**: Get live updates on temperature, humidity, and weather states.
- **5-Day Forecast**: Plan ahead with detailed daily breakdowns including Min/Max temperatures.

### 📊 Advanced Analytics
- **Dynamic Charting**: Visualize humidity and precipitation probability over a 24-hour cycle.
- **Trend Analysis**: Backend logic that analyzes temperature fluctuations to provide predictive weather insights.
- **Intelligent Caching**: Optimized server-side caching to ensure lightning-fast response times and reduced API overhead.

### 🛠️ Professional Architecture
- **Flask Backend**: Robust RESTful API with structured logging and error handling.
- **Vite Frontend**: Ultra-fast, modern React interface for a smooth, lag-free experience.
- **CORS Enabled**: Ready for cross-origin integration with development and production environments.

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/1MeetPatel/Weather-Forecasting.git
cd Weather-Forecasting
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # On Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```
*The backend will run at `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run at `http://localhost:5173` (or your configured Vite port)*

---

## 📂 Project Structure

```text
├── app.py              # Main Flask Entry Point
├── services/           # External API Integrations (Open-Meteo)
├── utils/              # Caching, Prediction Logic, and Logging
├── frontend/           # Vite + React Application
│   ├── src/            # Components & Logic
│   └── public/         # Static Assets
└── requirements.txt    # Python Dependencies
```

---

## 🛠️ Technology Stack
- **Backend**: Flask, Requests, Flask-CORS
- **Frontend**: React, Vite, Chart.js/Recharts (for analytics)
- **Data Source**: Open-Meteo (No API Key Required)
- **Caching**: Custom in-memory implementation

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributors
- **1MeetPatel** — Lead Developer & Architect
