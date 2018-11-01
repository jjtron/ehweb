<?php namespace Listener;

require('PaypalIPN.php');
use PaypalIPN;
$ipn = new PaypalIPN();

// Use the sandbox endpoint during testing.
$ipn->useSandbox();

$verified = $ipn->verifyIPN();

if ($verified) {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn verified' . PHP_EOL, FILE_APPEND);
    /*
     * Process IPN
     * A list of variables is available here:
     * https://developer.paypal.com/webapps/developer/docs/classic/ipn/integration-guide/IPNandPDTVariables/
     */
} else {
    file_put_contents(dirname(__FILE__).'/test.txt', 'paypal ipn NOT verified' . PHP_EOL, FILE_APPEND);
}

// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
?>