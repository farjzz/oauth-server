# OAuth 2.0 Server

A **simple OAuth 2.0 authorization server** built with **Node.js** and **Express**, providing **authorization code** and **access token** issuance.  
This server allows clients to authenticate users and obtain access tokens for protected resources.

## Features

- **User authentication** with in-memory user storage  
- **Client validation** with in-memory client storage  
- **Authorization code generation** (`/authorization`)  
- **Access token issuance** (`/token`)  
- **Protected resource endpoint** (`/resource`)  
- **Access token expiration** (1 hour)  
- Simple **Bearer token** authorization  

## Endpoints

### 1. `/authorization` (GET)
Request authorization for a client.  

**Query Parameters**:  
- `client_id` – Client identifier  
- `redirect_uri` – Redirect URI of the client  
- `username` – User username  
- `password` – User password  

**Response**:  
```json
{
  "message": "Client and user authorized",
  "code": "random_authorization_code"
}
