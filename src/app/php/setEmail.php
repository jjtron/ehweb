<?php

require 'pdo.php';

$href = $_POST['href'];
$email = $_POST['email'];
$cards = $_POST['cards'];
$question = $_POST['question'];
$psychicid = $_POST['psychicid'];

if ($psychicid === '000') {
	$psychicid = '002';
}

$sql = "INSERT INTO records (email, cards, question, answer, psychicid)  VALUES ('" . $email . "', '" .  $cards . "', '" . $question. "', '', '" . $psychicid. "')";

try {
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$LAST_ID = $conn->lastInsertId();
	$msg = "The new record is created " . $LAST_ID;
} catch (Exception $e) {
	echo $e->getMessage();
	return;
}

$messageBody  = 'A client has made a request for a reading.' . PHP_EOL . PHP_EOL;
$messageBody .= 'Click on the following link to provide the answer.' . PHP_EOL . PHP_EOL;
$messageBody .= $href . 'admin?id=' . $LAST_ID;

// ALTERNATE RECIPIENT 'emily-psychic@cfl.rr.com'
mail(
	'emily-psychic@cfl.rr.com',
	'A client has made a request for a reading',
	$messageBody,
	'From: webmaster@jjtron.com'
);

echo json_encode($LAST_ID);
?>
