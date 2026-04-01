# Student Exam Performance Prediction - Backend

## Overview
This project implements a machine learning backend for predicting student mathematics exam scores based on demographic and academic features. Built with Python and Flask, it provides a RESTful API for score predictions using a trained regression model.

## Features
- **Data Ingestion**: Automated loading and preprocessing of student performance data
- **Feature Engineering**: Categorical encoding and numerical scaling using scikit-learn transformers
- **Model Training**: Linear regression model trained on student exam data
- **Prediction Pipeline**: Real-time prediction API with input validation
- **Model Persistence**: Serialized model and preprocessing pipeline storage
- **Error Handling**: Custom exception handling for robust backend operations
- **Logging**: Comprehensive logging system for monitoring and debugging

## Technology Stack
- **Python 3.10**
- **Flask**: Web framework for API endpoints
- **scikit-learn**: Machine learning library for preprocessing and modeling
- **pandas & numpy**: Data manipulation and numerical computing
- **dill**: Object serialization for model persistence
- **CatBoost & XGBoost**: Alternative ML algorithms (available in training pipeline)

## Project Structure
```
├── app.py                    # Main Flask application
├── application.py            # Alternative app entry point
├── src/
│   ├── __init__.py
│   ├── exception.py          # Custom exception classes
│   ├── logger.py             # Logging utilities
│   ├── utils.py              # Helper functions for model operations
│   └── components/
│       ├── __init__.py
│       ├── data_ingestion.py # Data loading component
│       ├── data_transformation.py # Feature preprocessing
│       └── model_trainer.py  # Model training logic
├── artifacts/
│   ├── model.pkl            # Trained model
│   ├── preprocessor.pkl     # Fitted preprocessing pipeline
│   ├── train.csv            # Training data
│   ├── test.csv             # Test data
│   └── data.csv             # Raw data
├── logs/                    # Application logs
├── requirements.txt         # Python dependencies
├── setup.py                # Package setup
└── Dockerfile              # Containerization
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ml_project
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   # or
   source venv/bin/activate     # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model** (optional, pre-trained model included)
   ```bash
   python train.py
   ```

## Usage

### Running the Application
```bash
python app.py
```
The API will be available at `http://127.0.0.1:5000`

### API Endpoints

#### GET `/`
Returns the home page.

#### GET `/predictdata`
Returns the prediction form interface.

#### POST `/predictdata`
Predicts math score based on input features.

**Request Body** (form data):
- `gender`: "male" or "female"
- `ethnicity`: "group A", "group B", "group C", "group D", "group E"
- `parental_level_of_education`: "associate's degree", "bachelor's degree", "high school", "master's degree", "some college", "some high school"
- `lunch`: "free/reduced" or "standard"
- `test_preparation_course`: "none" or "completed"
- `reading_score`: integer (0-100)
- `writing_score`: integer (0-100)

**Response**: Renders prediction result with predicted math score.

## Model Details

### Features Used
- Gender
- Race/Ethnicity
- Parental Level of Education
- Lunch Type
- Test Preparation Course Status
- Reading Score
- Writing Score

### Preprocessing Pipeline
1. **Categorical Encoding**: OneHotEncoder for categorical variables
2. **Numerical Scaling**: StandardScaler for reading and writing scores
3. **Column Transformation**: Combined preprocessing using ColumnTransformer

### Model Architecture
- **Algorithm**: Linear Regression
- **Training Data**: Student performance dataset
- **Evaluation**: R² score and RMSE metrics
- **Persistence**: Model saved using dill serialization

## Data Pipeline Components

### Data Ingestion (`data_ingestion.py`)
- Loads CSV data from specified path
- Splits data into train/test sets (80/20)
- Saves processed data to artifacts directory

### Data Transformation (`data_transformation.py`)
- Identifies categorical and numerical features
- Creates preprocessing pipeline
- Fits transformers on training data
- Returns transformed data and preprocessor object

### Model Trainer (`model_trainer.py`)
- Trains Linear Regression model
- Evaluates model performance
- Saves trained model to artifacts

### Prediction Pipeline (`predict_pipeline.py`)
- Loads saved model and preprocessor
- Processes input data through CustomData class
- Returns prediction results

## Configuration

### Environment Variables
- `FLASK_ENV`: Set to "development" for debug mode
- `FLASK_APP`: Set to "app.py"

### Model Hyperparameters
- Test size: 0.2
- Random state: 42
- No additional hyperparameters for Linear Regression

## Error Handling
- Custom `CustomException` class for detailed error reporting
- Logging integration for error tracking
- Graceful handling of invalid inputs

## Logging
- Logs stored in `logs/` directory
- Separate log files for different components
- Timestamped entries with error levels

## Deployment
- **Docker**: Containerized deployment using Dockerfile
- **WSGI**: Production-ready with gunicorn (recommended)
- **Environment**: Supports both development and production modes

## Development

### Adding New Features
1. Update data classes in `predict_pipeline.py`
2. Modify preprocessing in `data_transformation.py`
3. Retrain model using `train.py`
4. Test API endpoints

### Model Retraining
```bash
python train.py
```
This will regenerate `model.pkl` and `preprocessor.pkl` with current data.

## Dependencies
Key packages (see `requirements.txt`):
- flask==3.1.3
- scikit-learn==1.7.2
- pandas==2.3.3
- numpy==2.2.6
- dill==0.4.1

## Contributing
1. Fork the repository
2. Create feature branch
3. Make changes to backend components
4. Test thoroughly
5. Submit pull request

