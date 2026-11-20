package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

type AnalyzeRequest struct {
	Tickers []string             `json:"tickers"`
	Prices  map[string][]float64 `json:"prices"`
}

type AssetMetric struct {
	Ticker     string  `json:"ticker"`
	Volatility float64 `json:"volatility"`
	AvgReturn  float64 `json:"avgReturn"`
}

type AnalyzeResponse struct {
	BestWeights map[string]float64 `json:"bestWeights"`
	BestSharpe  float64            `json:"bestSharpe"`
	Metrics     []AssetMetric      `json:"metrics"`
}

var (
	historyMutex sync.Mutex
	historyDB    []map[string]interface{}
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func calcVolatility(prices []float64) float64 {
	if len(prices) < 2 {
		return 0
	}
	var sum, mean, variance float64
	for _, p := range prices {
		sum += p
	}
	mean = sum / float64(len(prices))
	for _, p := range prices {
		variance += math.Pow(p-mean, 2)
	}
	return math.Sqrt(variance / float64(len(prices)-1))
}

func analyzeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AnalyzeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Имитация сложных вычислений (чтобы прогресс-бар работал)
	time.Sleep(800 * time.Millisecond)

	metrics := []AssetMetric{}
	for _, ticker := range req.Tickers {
		prices := req.Prices[ticker]
		if len(prices) == 0 {
			continue
		}
		vol := calcVolatility(prices)
		avgRet := (prices[len(prices)-1] / prices[0]) - 1

		metrics = append(metrics, AssetMetric{
			Ticker:     ticker,
			Volatility: vol,
			AvgReturn:  avgRet,
		})
	}

	// ФИКС: используем локальный генератор с фиксированным seed (42)
	// Это гарантирует, что при одинаковых данных результат будет одинаковым
	rng := rand.New(rand.NewSource(42))

	bestSharpe := -999.0
	bestWeights := map[string]float64{}

	for i := 0; i < 1000; i++ {
		weights := map[string]float64{}
		sumWeights := 0.0
		for _, t := range req.Tickers {
			w := rng.Float64() // Используем наш локальный rng
			weights[t] = w
			sumWeights += w
		}

		portReturn := 0.0
		portVol := 0.0
		for _, t := range req.Tickers {
			weights[t] /= sumWeights
			for _, m := range metrics {
				if m.Ticker == t {
					portReturn += weights[t] * m.AvgReturn
					portVol += weights[t] * m.Volatility
				}
			}
		}

		sharpe := 0.0
		if portVol > 0 {
			sharpe = portReturn / portVol
		}

		if sharpe > bestSharpe {
			bestSharpe = sharpe
			bestWeights = weights
		}
	}

	resp := AnalyzeResponse{
		BestWeights: bestWeights,
		BestSharpe:  math.Round(bestSharpe*100) / 100,
		Metrics:     metrics,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func historyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var entry map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&entry); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		entry["timestamp"] = time.Now().Format("02 Jan 2006, 15:04")

		historyMutex.Lock()
		historyDB = append(historyDB, entry)
		if len(historyDB) > 20 {
			historyDB = historyDB[1:]
		}
		historyMutex.Unlock()

		w.WriteHeader(http.StatusCreated)
		return
	}

	historyMutex.Lock()
	defer historyMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(historyDB)
}

func main() {
	http.HandleFunc("/api/analyze", corsMiddleware(analyzeHandler))
	http.HandleFunc("/api/history", corsMiddleware(historyHandler))

	fmt.Println("🚀 Go Backend Server started on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
