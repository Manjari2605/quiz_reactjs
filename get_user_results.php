<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include 'quiz/dbtest.php';

$username = isset($_GET['username']) ? $_GET['username'] : '';
if (!$username) {
    echo json_encode(['success' => false, 'message' => 'Missing username']);
    exit;
}

$sql = "SELECT * FROM results WHERE username = ? ORDER BY timestamp DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$results = [];
while ($row = $result->fetch_assoc()) {
    $results[] = $row;
}
$stmt->close();
$conn->close();
echo json_encode(['success' => true, 'results' => $results]);
