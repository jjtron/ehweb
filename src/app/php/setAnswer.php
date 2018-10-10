<?php

require 'pdo.php';

$answer = $_POST['answer'];
$id = $_POST['id'];
$email = $_POST['email'];
$href = $_POST['href'];

$sql = "UPDATE records SET answer='" . $answer . "' WHERE id=" . $id;

try {
	$stmt = $conn->prepare($sql);
	$stmt->execute();
} catch (Exception $e) {
	$msg = $e->getMessage();
	echo $msg;
	return;
}

$msg = "The record is updated with the answer";

$messageBody  = 'Tha answer to your card reading request is ready.' . PHP_EOL . PHP_EOL;
$messageBody .= 'Click on the following link to get it.' . PHP_EOL . PHP_EOL;
$messageBody .= $href . 'php/ehbuy.php?id=' . $id;

mail(
	$email,
	'A response to your card reading request is ready',
	$messageBody,
	'From: webmaster@jjtron.com'
);

echo $msg;

?>
