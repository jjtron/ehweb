<?php namespace Listener;

require 'pdo.php';
require('PaypalIPN.php');
use PaypalIPN;
$ipn = new PaypalIPN();
// Use the sandbox endpoint during testing.
$ipn->useSandbox();
$verified = $ipn->verifyIPN();

if ($verified) {
    $sql = "UPDATE records SET ipn = '" . json_encode($_POST) . "' WHERE id=" . substr($_POST['custom'], 0, 2);
    $stmt = $conn->prepare($sql);
	$stmt->execute();
	
	$query = "SELECT `email`, `answer` FROM `records` WHERE id=" . substr($_POST['custom'], 0, 2);
	foreach ($conn->query($query) as $row) {
		$email = $row['email'];
		$answer= $row['answer'];
	}
	
	$messageBody  = 'Here is your answer: ' . $answer . PHP_EOL;
	
	mail(
			$email,
			'Here is your answer',
			$messageBody,
			'From: admin@jjtron.com'
			);
	
} else {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn NOT verified' . PHP_EOL, FILE_APPEND);
}

// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
?>