# Co-Edit

<p align="center">
  <img width="350" src="https://github.com/jenniehuang/Co-Edit/blob/master/co-edit.png?raw=true">
</p>
📜Co-edit is a WYSIWYG editor allows you to co-editing the same document with others online in real-time.
<br/>
<br/>
🔗Website URL: https://www.co-edit.xyz/
<br/>
<br/>
Test account and password: test@test.com/testtest
<br/>
<br/>

![image](https://github.com/jenniehuang/Co-Edit/blob/master/Demo-v1.gif?raw=true)

## Table of Contents

- [Main Features](#main-features)
- [Backend Technique](#backend-technique)
  - [Infrastructure](#infrastructure)
  - [Environment](#environment)
  - [Database](#database)
  - [Cloud Services](#cloud-services)
  - [Networking](#networking)
  - [Test](#test)
  - [Third Party Library](#third-party-library)
  - [Version Control](#version-control)
  - [Key Points](#key-points)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Frontend Technique](#frontend-technique)
  - [React (hook)](#react-hook)
  - [React Router](#react-router)
  - [Redux (redux-toolkit)](#redux-redux-toolkit)
  - [Tailwind CSS, Tailwind UI](#tailwind-css-tailwind-ui)
  - [Third-Party Modules](#third-party-library-1)
  - [Cloud Services](#cloud-services-1)
- [API Doc](#api-doc)
- [Contact](#contact)

## Main Features

- Users can sign in locally or use Google OAuth 2.0.
- User authentication with Json Web Token.
- Use socket.io for real time co-editing.
- Supports English and Chinese.
- Setup CICD pipeline with cloudbuild cloud pub/sub.
- Differentiate every user with different colors in editor.
- Supports mobile devices so you can update content anytime anywhere.
- Only host can grant or remove access to your documents.
- Supports exporting your documents as PDF files.
- Hosting images on firebase storage.

## Backend Technique

### Infrastructure

- Docker
- docker-compose

### Environment

- Node.js/Express.js

### Database

- MongoDB Atlas

### Cloud Services

- Compute Engine
- Container Registry
- Cloud Build
- Cloud Pub/Sub

### Networking

- HTTP & HTTPS
- Domain Name System (DNS)
- NGINX
- SSL (Let's Encrypt)

### Test

- Unit test: Jest, Sinon, Supertest

### Third Party Library

- passport.js
- bcrypt
- luxon
- joi.js

### Version Control

- Git/GitHub

### Key Points

- socket.io
- MVC Pattern

## Architecture

- Server Architecture

  ![image](https://github.com/jenniehuang/Co-Edit/blob/master/Server%20Architecture.png?raw=true)

- Socket Architecture

  ![image](https://github.com/jenniehuang/Co-Edit/blob/master/Socket%20Architecture.png?raw=true)

## Database Schema

![image](https://github.com/jenniehuang/Co-Edit/blob/master/DB%20schema.png?raw=true)

## Frontend Technique

### React (hook)

- SPA with functional components

![image](https://github.com/jenniehuang/Co-Edit/blob/master/React%20Components.png?raw=true)

### React Router

- SPA routing

### Redux (redux-toolkit)

- managing global states and using `createAsyncThunk` handling async request lifecycles

### Tailwind CSS, Tailwind UI

- simply maintainable and easy scalability

### Third Party Library

- i18next
- axios
- lodash
- luxon
- quill.js

### Cloud Services

- Firebase for hosting images
- Cloud Storage for frontend SPA

## API Doc

[API doc](https://app.swaggerhub.com/apis-docs/jenniehuang/co-edit/1.0.0#/)

## Contact

👩‍💻Yu-ting, Huang
<br/>

📧Email: ting1236t19@gmail.com
