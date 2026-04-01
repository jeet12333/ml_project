import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from src.utils import save_object
import os

# Load data
df = pd.read_csv('nootbook/Data/Stud.csv')

# Prepare X and Y
X = df.drop(columns=['math score'], axis=1)
y = df['math score']

# Create preprocessor
num_features = X.select_dtypes(exclude="object").columns
cat_features = X.select_dtypes(include="object").columns

numeric_transformer = StandardScaler()
oh_transformer = OneHotEncoder()

preprocessor = ColumnTransformer(
    [
        ("OneHotEncoder", oh_transformer, cat_features),
        ("StandardScaler", numeric_transformer, num_features),
    ]
)

# Fit preprocessor
X_transformed = preprocessor.fit_transform(X)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_transformed, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Save objects
save_object(file_path=os.path.join("artifacts", "preprocessor.pkl"), obj=preprocessor)
save_object(file_path=os.path.join("artifacts", "model.pkl"), obj=model)

print("Model and preprocessor retrained and saved.")