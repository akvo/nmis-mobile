#!/bin/sh

echo "SERVER_URL=${BACKEND_IP_ADDRESS}" > .env
npm install
npm start
