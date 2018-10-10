<?php

$responseObj = (object) $_POST;

$responseObj->cards = ['the-sun.png', 'the-moon.png', 'the-star.png'];


echo json_encode($responseObj);

?>