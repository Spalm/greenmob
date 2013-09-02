<?php
		$script_root = "http://recyclemap.ru/";

		$security_key = "0ddddAFY4GmBJ4TspkfUb48awZj5FMDbxTGDkpOGHUvU1usa7VXF0Uj5";

		$con = mysql_connect('localhost', 'root', '');
			if (!$con)
			  {
			  die('Could not connect: ' . mysql_error());
			  }

		mysql_select_db("db_gprussia_7", $con);
		mysql_query("SET NAMES 'utf8'");
mysql_query ("set character_set_client='cp1251'");
mysql_query ("set character_set_results='cp1251'");
mysql_query ("set collation_connection='cp1251_general_ci'");
mysql_set_charset ('cp-1251');
?>
