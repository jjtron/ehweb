<?php namespace Listener;

require('PaypalIPN.php');
use PaypalIPN;
$ipn = new PaypalIPN();
// Use the sandbox endpoint during testing.
$ipn->useSandbox();
$verified = $ipn->verifyIPN();

if ($verified) {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn verified' . PHP_EOL, FILE_APPEND);
    foreach ($_POST as $key => $value) {
        file_put_contents(dirname(__FILE__).'/test.txt', $key . ' - ' . $value . PHP_EOL, FILE_APPEND);
    }
    file_put_contents(dirname(__FILE__).'/test.txt', 'post list ended' . PHP_EOL, FILE_APPEND);
} else {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn NOT verified' . PHP_EOL, FILE_APPEND);
}

// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
?>