package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	pb "github.com/usagm-implementations/china-kpi/proto"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/grpclog/glogger"

	_ "github.com/denisenkom/go-mssqldb"
)

type appServer struct {
	pb.UnimplementedChinaAppServiceServer
	db *sql.DB
}

const (
	dbserver = "sql-opr-adap-dev-eus.database.windows.net"
	port     = 1433
	user     = "sql_reader"
	password = "0PRRe@derP@$$!47"
	database = "syndwopradapdeveus"
)

const sqlQuery = `
SELECT
ISNULL(aar.vrs_rsid, '') AS vrs_rsid,
ISNULL(dd.author_name, '') AS author_name,
ISNULL(dd.language, '') AS language,
ISNULL(dd.country_region, '') AS country_region,
ISNULL(dd.entity, '') AS entity,
ISNULL(dd.platform_opr, '') AS platform_opr,
ISNULL(dd.status, '') AS status,
ISNULL(dd.account_url, '') AS account_url,
ISNULL(aar.dimension, '') AS dimension,
ISNULL(aar.report_name, '') AS report_name,
ISNULL(aar.item_id, 0) AS item_id,
ISNULL(aar.report_start_date, '') AS report_start_date,
ISNULL(aar.report_end_date, '') AS report_end_date,
ISNULL(aar.load_time, '') AS load_time,
SUM(aar.audio_play_e3) AS audio_play,
SUM(aar.video_play_e5) AS video_play_e5,
SUM(aar.visits) AS visits,
SUM(aar.return_visits) AS return_visits,
SUM(aar.avg_time_spent_on_site_per_visit_C) AS avg_time_spent_on_site_per_visit,
SUM(aar.page_views) AS page_views,
SUM(aar.article_views) AS article_views
FROM
vw_data_dictionary dd INNER JOIN
vw_par_adobe_web_all_reports aar
ON
dd.author_id = aar.vrs_rsid
WHERE
dd.country_region = 'China'
AND
dd.platform_opr = 'Adobe Analytics'
AND
dd.entity IN ('VOA', 'RFA')
AND
dd.service IN ('Mandarin', 'Cantonese', 'Uyghur')
AND
aar.report_start_date >= ?
AND
aar.report_end_date <= ?
GROUP BY
aar.vrs_rsid, dd.author_name,
dd.language, dd.country_region, dd.entity,
dd.platform_opr, dd.status, dd.account_url,
aar.dimension, aar.report_name, aar.item_id,
aar.report_start_date, aar.report_end_date,
aar.load_time
`

func (s *appServer) ExecuteQuery(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponseList, error) {
	log.Printf("received: Start Date - %v, End Date - %v", req.GetReportStartDate(), req.GetReportEndDate())

	rows, err := s.db.Query(sqlQuery, req.ReportStartDate, req.ReportEndDate)
	if err != nil {
		log.Printf("Error executing query: %v", err)
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	var results []*pb.QueryResponse
	for rows.Next() {
		var result pb.QueryResponse
		err := rows.Scan(
			&result.VrsRsid, &result.AuthorName, &result.Language, &result.CountryRegion,
			&result.Entity, &result.PlatformOpr, &result.Status, &result.AccountUrl,
			&result.Dimension, &result.ReportName, &result.ItemId, &result.ReportStartDate,
			&result.ReportEndDate, &result.LoadTime, &result.AudioPlay, &result.VideoPlayE5,
			&result.Visits, &result.ReturnVisits, &result.AvgTimeSpentOnSitePerVisit,
			&result.PageViews, &result.ArticleViews,
		)
		if err != nil {
			log.Printf("Error scanning rows: %v", err)
			return nil, fmt.Errorf("failed to scan rows: %v", err)
		}

		results = append(results, &result)
	}

	return &pb.QueryResponseList{Responses: results}, nil
}

func connectDB() (*sql.DB, error) {
	connectionString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s", dbserver, user, password, port, database)
	db, err := sql.Open("mssql", connectionString)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("database connection failed: %v", err)
	}

	fmt.Println("Database connection successful")
	return db, nil
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Recovered from panic:", r)
		}
	}()

	db, err := connectDB()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	log.Println("Starting gRPC server...")
	lis, err := net.Listen("tcp", ":7777")
	if err != nil {
		log.Fatalf("TCP connection failed: %v", err)
	} else {
		log.Printf("gRPC Server Listening at %v", lis.Addr())
	}

	size := 1024 * 1024 * 1000
	s := grpc.NewServer(grpc.MaxRecvMsgSize(size), grpc.MaxSendMsgSize(size))
	pb.RegisterChinaAppServiceServer(s, &appServer{db: db})

	// Create a new CORS-enabled handler
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	mux := mux.NewRouter()
	mux.Use(corsHandler)

	// Serve the React app statically
	reactAppDir := "./webapp/build" // Adjust this path based on your React app build location
	reactAppPath := "/webapp/"
	reactHandler := http.StripPrefix(reactAppPath, http.FileServer(http.Dir(reactAppDir)))
	mux.PathPrefix(reactAppPath).Handler(reactHandler)

	// Register the HTTP handler on the same ServeMux
	mux.HandleFunc("/api/query", func(w http.ResponseWriter, r *http.Request) {
		startDate := r.URL.Query().Get("startDate")
		endDate := r.URL.Query().Get("endDate")

		req := &pb.QueryRequest{
			ReportStartDate: startDate,
			ReportEndDate:   endDate,
		}

		resp, err := (&appServer{db: db}).ExecuteQuery(r.Context(), req)
		if err != nil {
			log.Printf("Error executing query: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp.Responses)
	})

	go func() {
		log.Println("Starting HTTP server...")
		err := http.ListenAndServe(":7778", mux)
		if err != nil {
			log.Fatalf("HTTP server failed: %v", err)
		} else {
			log.Printf("HTTP server started.")
		}
	}()

	if err := s.Serve(lis); err != nil {
		log.Fatalf("gRPC server failed: %v", err)
	} else {
		log.Printf("gRPC, HTTP, and API server started.")
	}
}
