<?php

require_once "classes/Pusher.php";


$pusher = new Pusher("abbed27716bfdc0b8829", "5d4f760df2d388eb6616", "26098");
echo $pusher->socket_auth($_POST['channel_name'], $_POST['socket_id']);


?>