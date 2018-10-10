<?php

$servername = "localhost";
$username = "jjtronco_eh";
$password = "jjtronco_eh";

try {
	$conn = new PDO("mysql:host=$servername;dbname=jjtronco_ehweb", $username, $password);
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
	echo "Connection failed: " . $e->getMessage();
}
