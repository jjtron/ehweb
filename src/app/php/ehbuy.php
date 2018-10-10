<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=us-ascii">
	<title></title>
</head>
<body>
<div style="width: 80%; margin: auto;">
<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:36px;">Experimental Site for Pay Pal Demo</span></span></p>

<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="YJ328MCK8NGRU">
<input type="hidden" name="custom" value="<?php echo $_GET['id']; ?>">
<input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>


<p style="text-align: left;"></p>
</div>
</body>
</html>
