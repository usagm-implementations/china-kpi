// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v4.25.0
// source: proto/app.proto

package china_kpi

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	ChinaAppService_ExecuteQuery_FullMethodName = "/app.ChinaAppService/ExecuteQuery"
)

// ChinaAppServiceClient is the client API for ChinaAppService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ChinaAppServiceClient interface {
	ExecuteQuery(ctx context.Context, in *QueryRequest, opts ...grpc.CallOption) (*QueryResponseList, error)
}

type chinaAppServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewChinaAppServiceClient(cc grpc.ClientConnInterface) ChinaAppServiceClient {
	return &chinaAppServiceClient{cc}
}

func (c *chinaAppServiceClient) ExecuteQuery(ctx context.Context, in *QueryRequest, opts ...grpc.CallOption) (*QueryResponseList, error) {
	out := new(QueryResponseList)
	err := c.cc.Invoke(ctx, ChinaAppService_ExecuteQuery_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ChinaAppServiceServer is the server API for ChinaAppService service.
// All implementations must embed UnimplementedChinaAppServiceServer
// for forward compatibility
type ChinaAppServiceServer interface {
	ExecuteQuery(context.Context, *QueryRequest) (*QueryResponseList, error)
	mustEmbedUnimplementedChinaAppServiceServer()
}

// UnimplementedChinaAppServiceServer must be embedded to have forward compatible implementations.
type UnimplementedChinaAppServiceServer struct {
}

func (UnimplementedChinaAppServiceServer) ExecuteQuery(context.Context, *QueryRequest) (*QueryResponseList, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ExecuteQuery not implemented")
}
func (UnimplementedChinaAppServiceServer) mustEmbedUnimplementedChinaAppServiceServer() {}

// UnsafeChinaAppServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ChinaAppServiceServer will
// result in compilation errors.
type UnsafeChinaAppServiceServer interface {
	mustEmbedUnimplementedChinaAppServiceServer()
}

func RegisterChinaAppServiceServer(s grpc.ServiceRegistrar, srv ChinaAppServiceServer) {
	s.RegisterService(&ChinaAppService_ServiceDesc, srv)
}

func _ChinaAppService_ExecuteQuery_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChinaAppServiceServer).ExecuteQuery(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: ChinaAppService_ExecuteQuery_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChinaAppServiceServer).ExecuteQuery(ctx, req.(*QueryRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// ChinaAppService_ServiceDesc is the grpc.ServiceDesc for ChinaAppService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ChinaAppService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "app.ChinaAppService",
	HandlerType: (*ChinaAppServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ExecuteQuery",
			Handler:    _ChinaAppService_ExecuteQuery_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/app.proto",
}
