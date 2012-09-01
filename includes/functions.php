<?php

function getReqVar($reqKey, $defValue = "") {
	
	return isset($_POST[$reqKey]) ? $_POST[$reqKey] : (isset($_GET[$reqKey]) ? $_GET[$reqKey] : $defValue);
}

?>