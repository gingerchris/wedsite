<?php

function makesafe($string) {
	//to help prevent sql-injection attacks etc
	return mysql_real_escape_string($string);
} 
 
?>