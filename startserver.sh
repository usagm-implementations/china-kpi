#!/bin/bash

# Start Go server in the background
go run /go/src/app/server/main.go 

# # Start React application
cd /go/src/app/webapp
yarn install
yarn start
