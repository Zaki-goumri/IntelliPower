# IntelliPower Smart Facility Assistant (SFA) – Frontend

The **Smart Facility Assistant (SFA)** is an AI-driven web platform built to monitor and optimize **energy efficiency**, **security**, and **operations** in real-time for server rooms, ATM stations, and control centers.

This frontend is built using **Next.js**, delivering a highly interactive dashboard, real-time data visualizations, and AI-powered insights — all through a fast, modern web experience.

---

## 🖥️ Key Features

- 📊 **Real-Time Dashboards**: Visualize live temperature, sensor data, and security alerts.
- 🧠 **AI Alerts & Recommendations**: Receive AI-generated insights on energy use and threat detection.
- 🗺️ **Interactive Facility Map**: Drag-and-drop interface for camera and sensor placement over facility images.
- 📹 **Camera Monitoring UI**: View feeds and blind spot warnings from AI-optimized placement.
- 🧑‍💼 **Role-Based Access**: Interface adapts for Admins, Employees, and AI system roles.
- 🎮 **Simulation Mode** *(WIP)*: Replay attack scenarios and system behavior through a gamified interface.

---

## 🧱 Tech Stack

- **Next.js** – React-based framework for SSR and routing
- **TypeScript** – Type safety across the entire codebase
- **Tailwind CSS** – Utility-first CSS framework for responsive design
- **Socket.IO** – Real-time WebSocket updates for alerts and sensor data
- **Recharts** – Data visualizations
- **Axios / React Query** – API communication and caching
- **ShadCN** – Modern UI components
- **Threejs** – Modern 3D componenents
- **Zustand** - State mangement 
---

## 🛠️ Getting Started

To run the frontend locally:

### 1. Clone the repository

```bash
git clone https://github.com/Zaki-goumri/ast.git
cd ast
```
## 🧑‍💼 User Roles

- **Admin**: Full access to camera configuration, alerts, dashboards, and simulations.  
- **Employee**: View dashboards, interact with maps, and receive notifications.  
- **AI System**: Background monitoring and automated trigger handler.

---

## 📈 Performance Goals

- Dashboards load in under **2 seconds**  
- Real-time data delay of **< 1 second**  
- Interactive map generation in under **10 seconds**  
- Fully responsive UI across all screen sizes

---

## 🧪 Development Notes

- Ensure all backend services (MQTT, Redis, PostgreSQL) are running.  
- All APIs are accessible through the API Gateway at `/api`.

---

Built with ❤️ for the **Nest Hackathon Challenge — April 2025**  
Frontend by **1ngry n3rds**

