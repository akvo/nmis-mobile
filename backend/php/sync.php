<?php
// Set Content-Type to JSON
header('Content-Type: application/json');

// Check if Authorization header is set
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    echo json_encode(["error" => "No Authorization header"]);
    exit;
}

// Check if Authorization header starts with "Bearer "
if (substr($_SERVER['HTTP_AUTHORIZATION'], 0, 7) !== "Bearer ") {
    http_response_code(401);
    echo json_encode(["error" => "Invalid Authorization header"]);
    exit;
}

// Extract the token from the Authorization header
$token = substr($_SERVER['HTTP_AUTHORIZATION'], 7);

// Check if the token is what you expect
if ($token !== "eyjtoken") {
    http_response_code(403);
    echo json_encode(["error" => "Invalid token"]);
    exit;
}

// Get the request body
$body = file_get_contents('php://input');

// Parse the JSON payload
$data = json_decode($body, true);

// Check if JSON parsing failed
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Process the data...
// ...

// Send response
http_response_code(200);
echo json_encode(["message" => "Success"]);
?>
