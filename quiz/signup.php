<?php
// signup.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection
$host = 'localhost';
$db = 'quizbolt'; // Change to your database name
$user = 'root'; // Change to your DB user
$pass = ''; // Change to your DB password
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Name and password required']);
    exit();
}

// Check if user exists
$stmt = $conn->prepare('SELECT id FROM users WHERE name = ?');
$stmt->bind_param('s', $name);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['message' => 'User already exists']);
    exit();
}
$stmt->close();

// Hash password
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare('INSERT INTO users (name, password) VALUES (?, ?)');
$stmt->bind_param('ss', $name, $hashed);
if ($stmt->execute()) {
    echo json_encode(['message' => 'Signup successful']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Signup failed']);
}
$stmt->close();
$conn->close();
