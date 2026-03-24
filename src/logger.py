import logging
import os
from datetime import datetime


LOG_FILE = f"{datetime.now().strftime('%m_%d_%Y_%H_%M_%S')}.log"


logs_dir = os.path.join(os.getcwd(), "logs")
os.makedirs(logs_dir, exist_ok=True)


LOG_FILE_PATH = os.path.join(logs_dir, LOG_FILE)

log_format = "[%(asctime)s] %(lineno)d %(name)s - %(levelname)s - %(message)s"

# Get root logger and clear any existing handlers
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Remove any existing handlers to avoid duplicates
for handler in logger.handlers[:]:
    logger.removeHandler(handler)

# Create file handler
file_handler = logging.FileHandler(LOG_FILE_PATH)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter(log_format))

# Create console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter(log_format))

# Add handlers to logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Create a logger instance for use
logging = logging.getLogger(__name__)

