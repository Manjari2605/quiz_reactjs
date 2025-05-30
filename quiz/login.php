<?php
// login.php
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
$stmt = $conn->prepare('SELECT password FROM users WHERE name = ?');
$stmt->bind_param('s', $name);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['message' => 'User not found']);
    exit();
}
$stmt->bind_result($hashed);
$stmt->fetch();
if (password_verify($password, $hashed)) {
    echo json_encode(['message' => 'Login successful']);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid password']);
}
$stmt->close();
$conn->close();
