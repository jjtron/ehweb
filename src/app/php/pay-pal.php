<?php
require 'pdo.php';

$stmt = $conn->prepare("SELECT `ipn`, `answer` FROM `records` WHERE id=:id");
$stmt->bindParam(':id', $id);
$id = $_GET['id'];
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

$ipn = json_decode($result['ipn']);
if ($ipn && $result['answer']) {
	$status = 'In the payment process';
} else if (!$ipn && !$result['answer']) {
	$status = 'Not yet ready for payment processing';
} else if ($ipn && !$result['answer']) {
	$status = 'Some kind of error';
} else if (!$ipn && $result['answer']) {
	$status = 'Ready for payment processing';
} else {
	$status = 'Some kind of error';
}

?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=us-ascii">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Psychic Cosmic Tarot Pay Pal</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="icon" type="image/x-icon" href="../favicon.ico">
	<script>
		function showSpinner() {
			var spinner = document.getElementById('spinner');
			spinner.style.visibility = 'visible';
			spinner.width = 75;
			var showtext = document.getElementById('text-to-show');
			showtext.innerHTML = "Please wait, accessing Pay Pal ..."
			showtext.align = 'left';
			showtext.style.color = 'yellow';
		}
	</script>
</head>
<body style="background-color: #00f;">

<?php if ($status === 'Ready for payment processing'): ?>
<div style="width: 80%; margin: auto;">

    <div class="text-center" style="padding: 20px; color: #fff;">
        <span style="display: inline-block; vertical-align: middle;">
            <img id="logo-image-tag" src="../assets/Logo.png" width="50">
        </span>
        <span style="display: inline-block; vertical-align: middle;">
            <div style="font-size: 26px;" id="title-tag">Psychic Cosmic Tarot Pay-Pal Entry</div>
        </span>
        <div class="row" style="padding: 5px; color: #fff;">
            <div class="col-md-8 offset-md-2" style="font-size: 16px;">
                <p id="text-to-show" align="justify">Your psychic reader has looked at your cards. Her full analysis is now ready for you to access. Click on the Pay Pal button below to see your future.</p>
                <p style="font-size: 10px; text-align: left;">100% accuracy is not guaranteed. This service makes no representations or warranties of any kind, express or implied. jjtron.com will not be liable for any damages arising from use of this site. All divinatory readings and advice arising from use of this site are understood to be for entertainment purposes only.</p>
            </div>
        </div>
        <img id="spinner" src="../assets/spinner.gif" width="0" style="visibility: hidden;"/>
    </div>

    <div style="text-align: center;">
        <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="YJ328MCK8NGRU">
        <input type="hidden" name="custom" value="<?php echo $_GET['id'] . '-' . $_GET['psychic'] ?>">
        <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" onClick="showSpinner()" name="submit" alt="PayPal - The safer, easier way to pay online!">
        <img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
        </form>
    </div>
    <div class="row" style="text-align: center; padding: 20px; color: #fff;">
        <div  class="col-md-4 offset-md-4" style="font-size: 16px;">Only $1.00</div>
    </div>


<p style="text-align: left;"></p>
</div>

<? elseif ($status === 'Not yet ready for payment processing'): ?>
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
            		<p style="text-align: left;">Your request is not yet processable.</p>
            </div>
        </div>
    </div>
</div>
  
<? elseif ($status === 'In the payment process'): ?>

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
            		<p style="text-align: left;">This request has been processed.</p>
            		<p style="text-align: left;">If you have not received an e-mail with the answer to your reading, please send e-mail to: <span><a  style="color: yellow;" href="mailto:admin@jjtron.com">admin@jjtron.com</a></span></p>
            		<p style="text-align: left;">Please reference this number in your inquiry: <span style="color: yellow;"><?php echo $_GET['id'] . '-' . $_GET['psychic'] ?></span></p>
            		<p style="text-align: left;">Thanks you for your patience.</p>
            </div>
        </div>
    </div>
</div>

<? elseif ($status === 'Some kind of error'): ?>

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
            		<p style="text-align: left;">An error has occured.</p>
            </div>
        </div>
    </div>
</div>

<? else: ?>


<? endif; ?>

</body>
</html>
