# Qubot_backend
This is the backend for Qubot 
For the frontend refer to https://github.com/NuowenQ/Qubot_frontend

## How to set up 
### Postgresql server 
1. Install Postgresql on your device
2. Set up User and Database 
  ```
CREATE USER tester WITH PASSWORD 'test_password';
CREATE DATABASE qubot OWNER tester
  ```
3. create table
  ```
CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "userName" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
  ```
4. use \conninfo to find out port and database 

### Backend code 
1. run git clone
2. npm install
3. Set up .env folder
   ```
    DB_NAME=qubot
    DB_USER=zishen1
    DB_PASSWORD=password
    DB_PORT=5432
    SECRETKEY=5432
     // Interchangable with whatever values you set your variable at in your DB 
   ```
4. npm start

## Potential difficulty 
### CORS error 
Ensure Frontend port is the same as the allowed port on the backend 
```
______Frontend______
  "scripts": {
    "start": "PORT=8080 react-scripts --openssl-legacy-provider start",
    "build": "react-scripts --openssl-legacy-provider build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },

// in Login.tsx
 const response = await axios.post('http://localhost:4000/api/users/login',
// Ensure this matches your backend port

// in Register.tsx
const response = await axios.post('http://localhost:4000/api/users/signup', {

_______Backend_______
in server.js
const corsOptions = {
    credentials: true,
    origin: [ 'http://localhost:8080'] // Whitelist the domains you want to allow
};
```
Sometimes certain port does not work so can try by changing to different port 

