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
	$resp = (object) array("success" => false, "msg" => $msg);
	$respJSON = json_encode($resp);
	echo $respJSON;
	return;
}

$psychicid = '';
try {
    $stmt2 = $conn->query("SELECT psychicid FROM records WHERE id=" . $id); 
    $row = $stmt2->fetchObject();
    $psychicid = $row->psychicid;
} catch (Exception $e) {
	$msg2 = $e->getMessage();
	$resp2 = (object) array("success" => false, "msg" => $msg2);
	$respJSON2 = json_encode($resp2);
	echo $respJSON2;
	return;
}

$resp = (object) array("success" => true);
$respJSON = json_encode($resp);

$messageBody  = 'The answer to your card reading request is ready.' . PHP_EOL . PHP_EOL;
$messageBody .= 'Click on the following link to get it.' . PHP_EOL . PHP_EOL;
$messageBody .= $href . 'php/pay-pal.php?id=' . $id . '&psychic=' . $psychicid;
$messageBody .= PHP_EOL . PHP_EOL;
$messageBody .= '100% accuracy is not guaranteed.' . PHP_EOL;
$messageBody .= 'This service makes no representations or warranties of any kind, express or implied.' . PHP_EOL;
$messageBody .= 'jjtron.com will not be liable for any damages arising from use of this site.' . PHP_EOL;
$messageBody .= 'All divinatory readings and advice arising from use of this site are understood to be for entertainment purposes only.';

mail(
	$email,
	'A response to your card reading request is ready',
	$messageBody,
	'From: admin@jjtron.com'
);

echo $respJSON;

?>
