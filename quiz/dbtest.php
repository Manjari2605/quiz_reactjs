<?php
// dbtest.php - Simple script to test database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quizbolt"; // change to your DB name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
// DO NOT close the connection here
?>
