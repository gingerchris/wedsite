<?php 
$mysqlID = mysql_connect(dbHost, dbUsername, dbPassword) or die("Unable to connect to database");
mysql_select_db(dbDatabase) or die("Unable to select database ".dbDatabase);

mysql_query("SET NAMES 'utf8'"); //should only call once during life of connection.
mysql_query("SET CHARACTER_SET 'utf8'"); //see http://dev.mysql.com/doc/refman/5.0/en/charset-connection.html
?>