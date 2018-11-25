<?php namespace Listener;

require 'pdo.php';
require('PaypalIPN.php');
use PaypalIPN;
$ipn = new PaypalIPN();
// Use the sandbox endpoint during testing.
$ipn->useSandbox();
$verified = $ipn->verifyIPN();

if ($verified) {
	
	$customData = explode("-", $_POST['custom']);
	
	$sql = "UPDATE records SET ipn = '" . json_encode($_POST) . "' WHERE id=" . $customData[0];
    $stmt = $conn->prepare($sql);
	$stmt->execute();
	
    $psychicEmailAddress = '';
    if ($customData[1] === '001') { $psychicEmailAddress = 'emily-psychic@cfl.rr.com'; }
    if ($customData[1] === '002') { $psychicEmailAddress = 'gpetron7@cfl.rr.com'; }
	
    $messageBody  = 'Purchase on ' . $customData[0];
	
	mail(
			$psychicEmailAddress,
			'Purchase on record ' . $customData[0],
			$messageBody,
			'From: admin@jjtron.com'
			);
	
} else {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn NOT verified' . PHP_EOL, FILE_APPEND);
}

// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
?>