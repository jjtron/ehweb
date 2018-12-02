<?php

    require 'pdo.php';

    $customData = explode("-", $_GET['cm']);

    $sql = "UPDATE records SET ipn = '" . json_encode(array('payment_status' => 'pre-ipn-processing')) . "' WHERE id=" . $customData[0];
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $query = "SELECT `email`, `answer` FROM `records` WHERE id=" . $customData[0];
	foreach ($conn->query($query) as $row) {
		$email = $row['email'];
		$answer= $row['answer'];
	}

	$messageBody  = 'Here is the answer to your tarot card reading request: '  . PHP_EOL . PHP_EOL . $answer . PHP_EOL;
	$messageBody .= '------------------------------------------------------' . PHP_EOL . PHP_EOL;
	$messageBody .= '100% accuracy is not guaranteed.' . PHP_EOL;
	$messageBody .= 'This service makes no representations or warranties of any kind, express or implied.' . PHP_EOL;
	$messageBody .= 'jjtron.com will not be liable for any damages arising from use of this site.' . PHP_EOL;
	$messageBody .= 'All divinatory readings and advice arising from use of this site are understood to be for entertainment purposes only.' . PHP_EOL;
	$messageBody .= 'Your e-mail address is confidential. It will not be shared with or sold to any third party.';
	
	mail(
			$email,
			'Tarot card reading answer',
			$messageBody,
			'From: admin@jjtron.com'
			);

?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=us-ascii">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Psychic Cosmic Tarot Thanks You</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="icon" type="image/x-icon" href="../favicon.ico">
</head>
<body style="background-color: #00f;">
    
<div style="width: 80%; margin: auto;">
    <div class="text-center" style="padding: 20px; color: #fff;">
        <span style="display: inline-block; vertical-align: middle;">
            <img id="logo-image-tag" src="../assets/Logo.png" width="100">
        </span>
        <span style="display: inline-block; vertical-align: middle;">
            <div style="font-size: 30px;" id="title-tag">Psychic Cosmic Tarot</div>
        </span>
        <div class="row" style="padding: 20px; color: #fff;">
            <div class="col-md-6 offset-md-3" style="font-size: 18px;">
            		<p style="text-align:left">You will receive an e-mail soon with the answer to your tarot card reading request.</p>
            		<p style="text-align:left">It may take several minutes.</p>
            		<p style="text-align:left">Check your junk mail if it seems like it is taking too long.</p>
            		<p style="text-align:left">If it never arrives, email <span><a  style="color: yellow;" href="mailto:admin@jjtron.com">admin@jjtron.com</a></span></p>
            		<p style="text-align:left">Thanks you for purchasing your card reading service. You are welcome any time to get another reading.</p>
            </div>
        </div>
    </div>
</div>
</body>
</html>
