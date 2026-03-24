
# Accident Detection System Using Flask

This project is a Flask-based application designed to detect road accidents using CCTV footage. It leverages machine learning models trained on a Kaggle dataset.

---

## Steps to Set Up the Project

### 1. Clone the Repository
To get started, start the project :
```
   accident detection system
```

### 2. Navigate to the Directory
Navigate to the project directory:
```bash
cd Accident-detection-system-using-Flask
```

### 3. Install Required Libraries
Install all the dependencies Required Like:
```bash
flask , twillio api, tensorflow, opencv
```

pip install flask opencv-python numpy werkzeug python-dotenv

### 4. Run the Application
Start the application by running the `app.py` file:
```bash
python app.py
```

---

## Dataset Information
The dataset used for this project is sourced from Kaggle:  
[Accident Detection from CCTV Footage](https://www.kaggle.com/datasets/ckay16/accident-detection-from-cctv-footage)

---

## Model Training
To train the custom CNN model for accident classification, run the following command in your terminal:

```bash
python train_cnn.py
```

This script will use the dataset in the `dataset/` directory to train and save the `efficientnet_accident.pth` model.

### Pre-Trained Model
If you prefer to use a pre-trained model, you can download it from the link below:  
[Download Pre-Trained Model](https://drive.google.com/file/d/1RgK3zSAC7E0BpKxyR8TisxWWkTdYrGpf/view?usp=sharing)

---

## Notes
- Ensure you have Python installed on your system before setting up the project.
- Make sure all required libraries are installed to avoid runtime errors.

---

### Good Luck!
