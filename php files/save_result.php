<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/quiz/dbtest.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username'], $data['quiz_id'], $data['score'], $data['total_questions'], $data['attempted'], $data['time_spent'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$username = $data['username'];
$quiz_id = $data['quiz_id'];
$score = $data['score'];
$total_questions = $data['total_questions'];
$attempted = $data['attempted'];
$time_spent = $data['time_spent'];
$timestamp = date('Y-m-d H:i:s');

$sql = "INSERT INTO results (username, quiz_id, score, total_questions, attempted, time_spent, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}
$stmt->bind_param('siiiiss', $username, $quiz_id, $score, $total_questions, $attempted, $time_spent, $timestamp);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
