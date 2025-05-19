FROM node:24.0.2 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept build args and write to a .env file for Vite
ARG VITE_TINYMCE_API_KEY
ARG VITE_PORTFOLIO_API_URL

RUN echo "VITE_TINYMCE_API_KEY=$VITE_TINYMCE_API_KEY" > .env
RUN echo "VITE_PORTFOLIO_API_URL=$VITE_PORTFOLIO_API_URL" >> .env

RUN npm run build
