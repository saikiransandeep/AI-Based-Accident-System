# TrafficAI: Modern Accident Detection & Monitoring System

TrafficAI is an advanced AI-powered traffic monitoring system designed to detect road accidents in real-time using CCTV footage. It leverages a robust hybrid pipeline featuring **YOLOv8** for detection, **DeepSORT** for multi-object tracking, and a custom **EfficientNet CNN** for pinpoint accident classification. It also features a premium **Next.js** dashboard for real-time monitoring, alerts, and historical data analysis.

---

## 🚀 Key Features

- **Real-time Accident Detection**: Powered by YOLOv8 for accurate vehicle collision identification.
- **Unified Monitoring Dashboard**: A sleek, modern interface for tracking live camera feeds.
- **Instant Alerts**: Critical incident notifications with confidence mapping.
- **Emergency Management**: Built-in emergency contact system with response time tracking.
- **Historical Analysis**: Comprehensive logs of all detected incidents for post-analysis.
- **Multi-Source Support**: Capability to handle image uploads, video processing, and live streams.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, Tailwind CSS, Shadcn UI, Recharts, Lucide Icons.
- **Backend**: Flask (Python), SQLite, PyTorch, YOLOv8 (Ultralytics), OpenCV, DeepSORT.
- **Detection**: YOLOv8m + EfficientNet-B0 + DeepSORT Object Tracking.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) (Recommended) or npm

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/saikiransandeep/AI-Based-Accident-System.git
cd AI-Based-Accident-System
```

### 2. Backend Setup (Flask & AI)
Navigate to the backend directory and set up the Python environment:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` folder (or edit the existing one):
```env
# Flask Settings
FLASK_SECRET_KEY=your_random_secret_key

# Detection Settings
ACCIDENT_THRESHOLD=60

# Email/SMTP Settings (Optional for Alerts)
GMAIL_SENDER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### 3. Frontend Setup (Next.js)
Open a new terminal window, navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
pnpm install
# or
npm install
```

---

## 🚀 Running the Project

### Phase 1: Start the Backend
Make sure your virtual environment is active in the `backend` folder:
```bash
python app.py
```
*The backend will run on `http://127.0.0.1:5000`.*

### Phase 2: Start the Frontend
In the `frontend` folder, run:
```bash
pnpm dev
# or
npm run dev
```
*The dashboard will be available at `http://localhost:3000`.*

---

## 🧠 Model Training (EfficientNet CNN)

This project has been upgraded to support a custom **EfficientNet-B0 CNN** alongside **YOLOv8m** and **DeepSORT Object Tracking** for highly accurate accident classification. 

If you want to train the model on your own dataset:

### 1. Prepare your Dataset
Ensure your dataset is placed in the `backend/dataset/` directory with the following structure:
```text
backend/
└── dataset/
    ├── train/
    │   ├── accident/       # Images of accidents
    │   └── non_accident/   # Images of normal traffic
    └── val/
        ├── accident/
        └── non_accident/
```

### 2. Train the CNN Model
Once the dataset is in place, trigger the PyTorch training script. Navigate to the `backend` folder:
```bash
cd backend

# Ensure your virtual environment is still activated
python train_cnn.py
```

The script will:
- Load images and apply data augmentations (flips, rotations, color jitters).
- Train the EfficientNet-B0 model over 15 epochs (this can be configured inside `train_cnn.py`).
- Automatically save the highest-performing weights as `efficientnet_accident.pth` in the `backend/` directory.

### 3. Run the Inference Pipeline
You do not need to change any configuration! When `app.py` runs, `yolo_model.py` will automatically look for the trained `efficientnet_accident.pth` weights. 
- **YOLOv8** will detect vehicles.
- **DeepSORT** will track those vehicles across consecutive frames.
- The **EfficientNet CNN** will evaluate cropped bounding boxes of tracked vehicles to output a real-time accident probability!
*(Note: If the `.pth` weights file is missing, the system will seamlessly fall back to overlap and motion heuristics, so nothing breaks).*

---

## 📁 Project Structure

```text
AI-Based-Accident-System/
├── backend/               # Flask Application & AI Logic
│   ├── app.py             # Main Entry Point
│   ├── yolo_model.py      # AI Detection Wrapper
│   ├── yolov8n.pt         # YOLO Weights
│   ├── app.db             # SQLite Database
│   └── requirements.txt   # Python Dependencies
├── frontend/              # Next.js Dashboard
│   ├── app/               # Next.js Pages & Layouts
│   ├── components/        # UI Components
│   └── package.json       # Node Dependencies
└── README.md              # Project Documentation
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Developed for Safer Roads and Intelligent Traffic Management.*
