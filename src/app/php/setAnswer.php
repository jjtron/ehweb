<?php

require 'pdo.php';

$answer = $_POST['answer'];
$id = $_POST['id'];
$email = $_POST['email'];
$href = $_POST['href'];
$token = $_POST['token'];

try {
	$stmt = $conn->prepare("UPDATE records SET answer=:answer WHERE id=:id AND admintoken=:token");
	$stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
	$stmt->bindParam(':id', $id, PDO::PARAM_STR);
	$stmt->bindParam(':token', $token, PDO::PARAM_STR);
	$stmt->execute();
} catch (Exception $e) {
	$msg = $e->getMessage();
	$resp = (object) array("success" => false, "msg" => $msg);
	$respJSON = json_encode($resp);
	echo $respJSON;
	return;
}

try {
	$stmt = $conn->prepare("SELECT psychicid, question, cards FROM records WHERE id=:id");
	$stmt->bindParam(':id', $id, PDO::PARAM_STR);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	$question = $result['question'];
	$psychicid = $result['psychicid'];
	$cards = json_decode($result['cards']);

	$card1parts = explode('/', $cards[0]);
	$card1grp =  ucwords(str_replace('-', ' ', $card1parts[0]));
	$card1crd =  ucwords(substr(str_replace('-', ' ', $card1parts[1]), 0, -4));

	$card2parts = explode('/', $cards[1]);
	$card2grp =  ucwords(str_replace('-', ' ', $card2parts[0]));
	$card2crd =  ucwords(substr(str_replace('-', ' ', $card2parts[1]), 0, -4));

	$card3parts = explode('/', $cards[2]);
	$card3grp =  ucwords(str_replace('-', ' ', $card3parts[0]));
	$card3crd =  ucwords(substr(str_replace('-', ' ', $card3parts[1]), 0, -4));

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
$messageBody .= 'Your cards:' . PHP_EOL;
$messageBody .= '     ' . $card1grp . ' - ' . $card1crd . PHP_EOL;
$messageBody .= '     ' . $card2grp . ' - ' . $card2crd . PHP_EOL;
$messageBody .= '     ' . $card3grp . ' - ' . $card3crd . PHP_EOL . PHP_EOL;
$messageBody .= 'Your question:' . PHP_EOL;
$messageBody .= '     ' . $question . PHP_EOL . PHP_EOL;
$messageBody .= 'Click on the following link to get you answer.' . PHP_EOL . PHP_EOL;
$messageBody .= $href . 'php/pay-pal.php?id=' . $id . '&psychic=' . $psychicid;
$messageBody .= PHP_EOL . PHP_EOL;
$messageBody .= '100% accuracy is not guaranteed.' . PHP_EOL;
$messageBody .= 'This service makes no representations or warranties of any kind, express or implied.' . PHP_EOL;
$messageBody .= 'jjtron.com will not be liable for any damages arising from use of this site.' . PHP_EOL;
$messageBody .= 'All divinatory readings and advice arising from use of this site are understood to be for entertainment purposes only.' . PHP_EOL;
$messageBody .= 'Your e-mail address is confidential. It will not be shared with or sold to any third party.';

mail(
	$email,
	'A response to your card reading request is ready',
	$messageBody,
	'From: admin@jjtron.com'
);

echo $respJSON;

?>
