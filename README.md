# Products
Products Microservice

## Install

1. Setup Environment Variables
```
$ cp .env.example .env
```

2. Setup NPM Registry
Replace `YOUR_PERSONAL_TOKEN` with a classic personal token with `package:read` access.
```
$ cp .npmrc.example .npmrc
```

3. Install Dependencies
```
$ npm install
```

4. Migrate Database
```
$ npm run migrate
```

5. Seed Database
```
$ npm run seed
```

## Usage
```
npm start
```

## API Documentation
1. Start Server
2. Visit [localhost:3000/api/v1/documentation](http://localhost:3000/api/v1/documentation) for Swagger UI

## Deploy
[![VM Publish Production](https://github.com/VR-web-shop/Products/actions/workflows/vm-publish-production.yml/badge.svg)](https://github.com/VR-web-shop/Products/actions/workflows/vm-publish-production.yml)

The GitHub Workflow: [vm-publish-production.yml](/.github/workflows/vm-publish-production.yml); execute a CI/CD flow on push to main.

## Docker
1. Setup Environment Variables
```
$ cp .env.example .env
```

2. Setup npmrc File
```
$ cp .npmrc.example .npmrc
```

3. Build Docker Image
```
$ docker build -t products:v1.0 .
```

4. Run Docker Container
```
$ docker run -p 3002:3002 products:v1.0
```

## Docker Compose
1. Setup Environment Variables
```
$ cp .env.example .env
```

2. Setup npmrc File
```
$ cp .npmrc.example .npmrc
```

3. Build Docker Image
```
$ docker build -t products:v1.0 .
```

4. Save the image to a tar file
```
$ docker save -o products.tar products:v1.0
```

5. Load the image into Docker
```
$ docker load -i products.tar
```

6. Run Docker Compose
```
$ docker compose up
```
