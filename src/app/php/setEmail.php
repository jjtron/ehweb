<?php

require 'pdo.php';

$href = $_POST['href'];
$email = $_POST['email'];
$cards = $_POST['cards'];
$question = $_POST['question'];
$psychicid = $_POST['psychicid'];
$admintoken = bin2hex(random_bytes(8));

if ($psychicid === '000') {	$psychicid = '002'; }

try {
	$stmt = $conn->prepare("INSERT INTO records (email, cards, question, psychicid, admintoken) VALUES (:email, :cards, :question, :psychicid, :admintoken)");
	
	$stmt->bindParam(':email', $email, PDO::PARAM_STR);
	$stmt->bindParam(':cards', $cards, PDO::PARAM_STR);
	$stmt->bindParam(':question', $question, PDO::PARAM_STR);
	$stmt->bindParam(':psychicid', $psychicid, PDO::PARAM_STR);
	$stmt->bindParam(':admintoken', $admintoken, PDO::PARAM_STR);
	
	$stmt->execute();
	$LAST_ID = $conn->lastInsertId();
	$msg = "The new record is created " . $LAST_ID;
} catch (Exception $e) {
	echo $e->getMessage();
	return;
}

$messageBody  = 'A client has made a request for a reading.' . PHP_EOL . PHP_EOL;
$messageBody .= 'Click on the following link to provide the answer.' . PHP_EOL . PHP_EOL;
$messageBody .= $href . 'admin?id=' . $LAST_ID . PHP_EOL . PHP_EOL;
$messageBody .= 'Security token: ' . $admintoken;

$psychicEmailAddress = '';
if ($psychicid === '001') { $psychicEmailAddress = 'emily-psychic@cfl.rr.com'; }
if ($psychicid === '002') { $psychicEmailAddress = 'gpetron7@cfl.rr.com'; }

mail(
	$psychicEmailAddress,
	'A client has made a request for a reading',
	$messageBody,
	'From: admin@jjtron.com'
);

echo json_encode($LAST_ID);
?>
