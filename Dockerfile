# Use Ubuntu 22.04 LTS as a parent image
FROM ubuntu:22.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    golang \
    git \
    protobuf-compiler \
    nodejs \
    npm

# Set up environment variables
ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the current directory contents into the container at /go/src/app
COPY . .

# Initialize go mod
RUN go mod init github.com/usagm-implementations/china-kpi

# Install protoc-gen-go
RUN go get -u google.golang.org/protobuf/cmd/protoc-gen-go
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go

# Install grpc-gateway and protoc-gen-openapiv2
RUN go install \
    github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest \
    github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

# Run custom script for compiling protos (assuming it's present in the current directory)
COPY compile-protos.sh .
RUN chmod +x compile-protos.sh

# Install protoc-gen-go-grpc from GitHub directly
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Run custom script for compiling protos
RUN ./compile-protos.sh

# Tidy go modules
RUN go mod tidy

# Install Node.js and Yarn
RUN npm install -g yarn

# Set up script to start both Go server and React application
RUN chmod +x startServer.sh

# Start both Go server and React application using the script
CMD ["./startserver.sh"]

