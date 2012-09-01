<?php

// require files
require_once "../classes/Pusher.php";
require_once "../includes/functions.php";


// set config
$key = "abbed27716bfdc0b8829";
$secret = "5d4f760df2d388eb6616";
$appID = "26098";


// create new pusher instance
$pusher = new Pusher($key, $secret, $appID);


// get submitted variables
$socketID = getReqVar("socketID");
$colors = getReqVar("colors");


// send the event
$didEventSend = $pusher->trigger("main", "new_colors", array("colors" => $colors), $socketID);


// output our status
echo "{\"status\": \"";
echo (($didEventSend) ? "success" : "fail");
echo "\"}";

?>