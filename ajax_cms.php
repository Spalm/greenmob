<?php 
header('Content-type: text/html; charset=utf-8');

require('db_config.php');

$cms_id = $_REQUEST['cms_id'];

$sql = "SELECT c.content 
		FROM rm_cms c
		WHERE c.id = ". $cms_id;



$cms = mysql_query($sql);

$cms = mysql_fetch_array($cms);

echo $cms['content'];

?>
