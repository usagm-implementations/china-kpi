#!/bin/bash

# Install the latest version of Go based on the system's OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
    ARCH="amd64"
fi
GO_VERSION=$(curl -s https://golang.org/dl/ | grep -o 'go[0-9]*\.[0-9]*' | head -n 1)

TMP_DIR=$(mktemp -d)
curl -sL "https://golang.org/dl/$GO_VERSION.$OS-$ARCH.tar.gz" | tar -C "$TMP_DIR" -xz
sudo mv "$TMP_DIR/go" /usr/local
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bash_profile
source ~/.bash_profile
rm -rf "$TMP_DIR"

# Initialize a new Go module
go mod init github.com/usagm-implementations/china-kpi

# Install protobuf-related tools
go get -u google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc

# Install protobuf using Homebrew
brew install protobuf

# Install additional protobuf tools
go get -u google.golang.org/protobuf

# Configure environment variables for Go
echo 'export GOPATH=~/go' >> ~/.bash_profile
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bash_profile
source ~/.bash_profile

# Install grpc-gateway and protoc-gen-openapiv2
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

# Compile protobuf files
sh compile-protos.sh

# Tidy Go modules
go mod tidy

# Install Node.js and Yarn globally
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# Run the server in a new tab
go run server/main.go

