<?php

require 'pdo.php';

$query = "SELECT * FROM `records` WHERE id='" . $_GET['id'] . "'";

$obj = (object) array();
foreach ($conn->query($query) as $row) {

	$obj->cards = json_decode($row['cards']);
	$obj->email = $row['email'];
	$obj->question= $row['question'];
	$obj->answer= $row['answer'];
	$obj->id= $row['id'];

	echo json_encode($obj);
	break;
}

?>