<?php

require 'pdo.php';

$stmt = $conn->prepare("SELECT * FROM `records` WHERE id=:id AND admintoken=:token");
$stmt->bindParam(':id', $id);
$stmt->bindParam(':token', $token);

$id = $_GET['id'];
$token = $_GET['token'];

$obj = (object) array();

$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

$obj->cards = json_decode($result['cards']);
$obj->email = $result['email'];
$obj->question= $result['question'];
$obj->answer= $result['answer'];
$obj->id= $result['id'];

echo json_encode($obj);

?>
