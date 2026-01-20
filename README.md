WhatsApp Chat Analyzer - Backend

Author: Praveen Kumar M
Tech Stack: Node.js, Express, MongoDB, Mongoose, Joi, Multer, CORS, dotenv

Project Overview

This is the backend of the WhatsApp Chat Analyzer tool. It handles file uploads, parses WhatsApp chat data, stores relevant information in MongoDB, and exposes API endpoints for the frontend to fetch user activity and analytics.

Key Responsibilities:

Accept and validate uploaded WhatsApp chat files (.txt)

Parse chat data for user activity

Store parsed data in MongoDB

Provide REST API endpoints for frontend data visualization

Features

✅ Upload WhatsApp chat files (.txt)

✅ Validate chat file format using Joi

✅ Parse messages and extract active users and daily activity

✅ Store parsed data in MongoDB

✅ Provide APIs for daily active users and new users

✅ Enable CORS for frontend-backend communication

Installation & Setup

Clone the repo and go to the backend folder:

cd api

Install dependencies:

npm install

Create a .env file in the root of the backend folder and add:

PORT=8000
MONGO_URI=mongodb://localhost:27017/chatApp

Start the backend server:

npm run start

API will be running at:

http://localhost:8000

Libraries Used

Express – Web framework for building APIs

Mongoose – MongoDB object modeling

Joi – Data validation

Multer – File uploads handling

Cors – Cross-origin requests

dotenv – Environment variable management

nodemon – Automatic server reload during development

Folder Structure:

API/
├── config/
│ ├── db.js
│ └── multerConfig.js
├── models/
│ └── chat/
├── controllers/
│ └── index.js
├── router/
│ └── index.js
├── services/
│ └── index.js
├── chatModel.js
├── chatValidator.js
├── routes/
│ └── index.js
├── uploads/
├── node_modules/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js

Postman Collection

You can use the following Postman collection to test the backend APIs of the WhatsApp Chat Analyzer. Import this JSON into Postman to quickly access the endpoints.

Collection JSON:

{
"info": {
"\_postman_id": "f39cf0b6-7c93-4f92-8dcf-0ef3311a7946",
"name": "Chat",
"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
"\_exporter_id": "38914785"
},
"item": [
{
"name": "Chat Upload",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "formdata",
"formdata": [
{
"key": "file",
"type": "file",
"uuid": "ce738072-4255-4df9-a37a-589a51ebdd9e",
"src": "/C:/Users/prave/Downloads/chat.txt"
}
]
},
"url": {
"raw": "{{env}}/chat/upload",
"host": [
"{{env}}"
],
"path": [
"chat",
"upload"
]
}
},
"response": []
},
{
"name": "Get chats Data",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "{{env}}/chat/chats",
"host": [
"{{env}}"
],
"path": [
"chat",
"chats"
]
}
},
"response": []
}
]
}

Usage Instructions:

Open Postman.

Click Import → Raw Text and paste the JSON above.

Set an environment variable env with your backend URL, for example:

env = http://localhost:8000/api/v1

for upload /chat/upload
for get /chat/chats

Use the Chat Upload request to upload .txt WhatsApp chat files.

Use the Get chats Data request to fetch parsed data from MongoDB.

Author

Praveen Kumar M

Contact Number: +91 8248840524
Email: praveenkumar.workss@gmail.com

LinkedIn: www.linkedin.com/in/praveenkumarm-dev
