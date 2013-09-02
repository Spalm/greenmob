<?php

function parseToXML($htmlStr) 
{ 
$xmlStr=str_replace('<','&lt;',$htmlStr); 
$xmlStr=str_replace('>','&gt;',$xmlStr); 
$xmlStr=str_replace('"','&quot;',$xmlStr); 
$xmlStr=str_replace("'",'&#39;',$xmlStr); 
$xmlStr=str_replace("&",'&amp;',$xmlStr); 
return $xmlStr; 
} 

include('db_config.php');

$city_id 		= 	$_REQUEST['city_id'];
$cat_filter		= 	$_REQUEST['cat_filter'];

if ($cat_filter)
	{

	$cat_filter = rtrim ($cat_filter, '|');
	$cat_filter = explode('|', $cat_filter);
	$cat_filter_sql = "";

	foreach ($cat_filter as $single_cat_id)
		{
		$cat_filter_sql .= " oc.category_id = $single_cat_id OR";
		}
	$cat_filter_sql = rtrim ($cat_filter_sql, 'OR'); 	
	
	$sql =	"SELECT o.*
			FROM `rm_org` o
			JOIN rm_org_category oc
			ON o.id = oc.org_id
			WHERE o.city_id =	" . $city_id . " AND (" . $cat_filter_sql . ")" .
			" GROUP BY o.id";
	}
else
	{
            /*$sql =	"SELECT o.*
			FROM `rm_org` o
			WHERE o.city_id =	" . $city_id;*/
	}

$result = mysql_query($sql);


//******** OUTPUT

header("Content-Type: text/xml; charset=utf-8");

echo '<?xml version="1.0" encoding="utf-8"?>';
echo '<markers>';

while($row = mysql_fetch_array($result))
	{
	echo 	'<marker '.
		'title="'.	parseToXML($row['title']).'" '.
		'lat="'.	parseToXML($row['lat'])	.'" '.
		'lng="'.	parseToXML($row['lng'])	.'" '.
		'rating="'.	parseToXML($row['rating']).'" '.
		'id="'.	parseToXML($row['id']).'" '.
		'file_name="'.	parseToXML($row['marker_file_name']).'" '.
		'/>';
	}		

echo "</markers>";


?>
