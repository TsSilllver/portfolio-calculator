<?php
// api.php — прокси для Yahoo Finance
// Принимает POST с массивом тикеров, возвращает исторические цены

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Обработка preflight-запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Читаем входные данные
$input = json_decode(file_get_contents('php://input'), true);
$tickers = $input['tickers'] ?? [];

if (empty($tickers) || !is_array($tickers)) {
    http_response_code(400);
    echo json_encode(['error' => 'No tickers provided']);
    exit;
}

$result = [];

foreach ($tickers as $ticker) {
    $ticker = strtoupper(trim($ticker));
    if (empty($ticker)) continue;

    // Yahoo Finance Chart API (бесплатный, без ключа)
    $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$ticker}?range=1y&interval=1d";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // ВАЖНО: Yahoo требует User-Agent, иначе 429 / 401
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // для локальной разработки

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 || !$response) {
        $result[$ticker] = ['error' => "Failed to fetch data (HTTP {$httpCode})"];
        continue;
    }

    $data = json_decode($response, true);

    if (!isset($data['chart']['result'][0])) {
        $result[$ticker] = ['error' => 'Invalid response structure'];
        continue;
    }

    $chart = $data['chart']['result'][0];
    $timestamps = $chart['timestamp'] ?? [];
    $closes = $chart['indicators']['quote'][0]['close'] ?? [];

    // Собираем пары timestamp => close, отбрасывая null
    $prices = [];
    for ($i = 0; $i < count($timestamps); $i++) {
        if (isset($closes[$i]) && $closes[$i] !== null) {
            $prices[] = [
                'date' => date('Y-m-d', $timestamps[$i]),
                'close' => round($closes[$i], 2)
            ];
        }
    }

    $result[$ticker] = [
        'symbol' => $ticker,
        'prices' => $prices,
        'currency' => $chart['meta']['currency'] ?? 'USD'
    ];
}

echo json_encode($result);