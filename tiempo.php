<?php
// Devuelve el tiempo de Tossa (Open-Meteo) con caché de 30 minutos, para que el navegador del visitante no se conecte a terceros.
// SIN PROBAR en el hosting. Uso comercial de Open-Meteo: requiere su plan de pago.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$cache = __DIR__ . '/tiempo_cache.json';
if (is_file($cache) && time() - filemtime($cache) < 1800) { readfile($cache); exit; }
$ctx = stream_context_create(['http' => ['timeout' => 6]]);
$f = @file_get_contents('https://api.open-meteo.com/v1/forecast?latitude=41.72&longitude=2.93&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,is_day&daily=sunrise,sunset,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe%2FMadrid&forecast_days=3', false, $ctx);
$m = @file_get_contents('https://marine-api.open-meteo.com/v1/marine?latitude=41.70&longitude=2.95&current=wave_height,sea_surface_temperature&timezone=Europe%2FMadrid', false, $ctx);
if ($f === false) { if (is_file($cache)) { readfile($cache); } else { http_response_code(503); echo '{}'; } exit; }
$out = json_encode(['f' => json_decode($f, true), 'm' => $m ? json_decode($m, true) : null]);
@file_put_contents($cache, $out);
echo $out;
