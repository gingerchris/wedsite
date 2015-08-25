<?php

require("_includes/declare_var.php");
require("_includes/connection.php");
require("_includes/functions.php");

$bError = false;
$sqlStr = array(); 

//get form values  
$name = $_POST['fullname'];

for($x = 0; $x < count($name); $x++ )
{

	$fullname = isset($_POST['fullname'][$x]) ? $_POST['fullname'][$x] : 'null';
	$rsvp = isset($_POST['rsvp'][$x]) ? $_POST['rsvp'][$x] : 'null';
	$transport = isset($_POST['transport'][$x]) ? $_POST['transport'][$x] : 'null';
	$meal = isset($_POST['meal'][$x]) ? $_POST['meal'][$x] : 'null';
	$special = isset($_POST['special'][$x]) ? $_POST['special'][$x] : 'null';

	//check required fields 
	if(strlen($fullname)==0){
		$bError = true; 
		$response = array(
			"success" => false,
			"type" => 'guest '.$x.' name required' 
		);
		break;
	}

	//if there are no errors insert into array 
	if($bError==false){

		$sqlStr[] = "(
				'".makesafe($fullname)."', 
				'".makesafe($rsvp)."', 
				'".makesafe($transport)."', 
				'".makesafe($meal)."', 
				'".makesafe($special)."', 
				'".date("Y-m-d H:i:s")."', 
				'".date("Y-m-d H:i:s")."'
			)";

	}

}

//if there are no errors insert into database 
if($bError==false){

	mysql_query('INSERT INTO tbl_guest (var_fullname, var_rsvp, var_transport, var_meal, var_special, date_createdate, date_updatedate) VALUES '.implode(',', $sqlStr));
	
	$response = array(
		"success" => true
	);
}

//add the header here
header('Content-Type: application/json');
echo json_encode( $response );

?>