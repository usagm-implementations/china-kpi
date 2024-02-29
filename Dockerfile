# Use an official Go runtime as a parent image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the current directory contents into the container at /go/src/app
COPY . .

# Initialize go mod
RUN go mod init github.com/usagm-implementations/china-kpi

# Install protoc-gen-go
RUN go get -u google.golang.org/protobuf/cmd/protoc-gen-go
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go

# Install protobuf tools
RUN apt-get update && apt-get install -y protobuf-compiler

# Install google.golang.org/protobuf
RUN go get -u google.golang.org/protobuf

# Set up environment variables
RUN echo 'export GOPATH=~/go' >> ~/.bash_profile
RUN echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bash_profile
RUN /bin/bash -c "source ~/.bash_profile"

# Install grpc-gateway and protoc-gen-openapiv2
RUN go install \
    github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest \
    github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

# Run custom script for compiling protos (assuming it's present in the current directory)
COPY compile-protos.sh .
RUN chmod +x compile-protos.sh

# Install protoc-gen-go-grpc from GitHub directly
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Add the Go binary directory to the PATH
ENV PATH="${PATH}:${GOPATH}/bin"

# Run custom script for compiling protos
RUN ./compile-protos.sh

# Tidy go modules
RUN go mod tidy

# Install Node.js and Yarn
RUN apt-get install -y nodejs npm
RUN npm install -g yarn

# Set up script to start both Go server and React application
COPY startserver.sh .
RUN chmod +x startserver.sh

# Start both Go server and React application using the script
CMD ["./startserver.sh"]

