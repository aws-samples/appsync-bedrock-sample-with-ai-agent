# Use the amazon provided lambda base image
FROM amazon/aws-lambda-python:3.11

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the lambda function
COPY . .

RUN chmod 755 index.py

# Specify the handler of your AWS Lambda function
CMD ["index.handler"]
