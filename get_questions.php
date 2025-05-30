<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include 'quiz/dbtest.php'; // fixed path to dbtest.php

$quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;
$with_answer = isset($_GET['with_answer']) ? intval($_GET['with_answer']) : 0;
error_log("QUIZ_ID: " . $quiz_id);

if ($quiz_id > 0) {
    if ($with_answer) {
        $stmt = $conn->prepare("SELECT id, question, option1, option2, option3, option4, answer FROM questions WHERE quiz_id = ?");
    } else {
        $stmt = $conn->prepare("SELECT id, question, option1, option2, option3, option4 FROM questions WHERE quiz_id = ?");
    }
    $stmt->bind_param("i", $quiz_id);
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'SQL Error: ' . $stmt->error]);
        exit;
    }
    $result = $stmt->get_result();
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    echo json_encode(['success' => true, 'questions' => $questions]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid quiz ID']);
}
?>
