<?php 
header('Content-type: text/html; charset=utf-8');

include('db_config.php');



$org_id = $_REQUEST['org_id'];
if (isset($_REQUEST['cats_titles']))
	$cats_titles = $_REQUEST['cats_titles'];
if (isset($_REQUEST['list_comments']))	
	$list_comments = $_REQUEST['list_comments'];

// ****** Org info
$sql = "SELECT o.* 
		FROM rm_org o
		WHERE o.id = ". $org_id;

$org = mysql_query($sql);

$org = mysql_fetch_array($org);

$org_info = array();

$org_info['org_title'] = $org['title'];
$org_info['org_lat'] = $org['lat'];
$org_info['org_lng'] = $org['lng'];

$org_info['org_contacts'] = $org['info_contacts'];
$org_info['org_time'] = $org['info_time'];
$org_info['org_marker_file'] = $org['marker_file_name'];

$org_info['org_misc'] = $org['info_misc'];
// making links clickable
//$org_info['org_misc'] = eregi_replace('(((f|ht){1}tp://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '<a target="_blank" href="\\1">\\1</a>', $org['info_misc']);



$org_info['org_image'] = $org['image'];


// ****** Cats (Titles or ids.. depending on 'cats_titles' parameter) 
if (isset($cats_titles))
	{
	$sql = "SELECT c.title 
			FROM rm_org_category oc
			JOIN rm_category c
			ON oc.category_id = c.id
			WHERE oc.org_id = ". $org_id;
	
	$categories = mysql_query($sql);
	$org_categories = array();

	while ($category = mysql_fetch_array($categories))
		{
		$org_categories[] = $category['title'];
		}
	
	}	
else
	{
	$sql = "SELECT c.category_id 
			FROM rm_org_category c
			WHERE c.org_id = ". $org_id;
	
	$categories = mysql_query($sql);
	$org_categories = "";
	
	while ($category = mysql_fetch_array($categories))
		{
		$org_categories .= $category['category_id'] . "|";
		}

	$org_categories = rtrim($org_categories, "|");
	}
		
$org_info['org_cats'] = $org_categories;


// ****** Ratings
$sql = "SELECT AVG(rating) as avg_rating
		FROM rm_rating
		WHERE org_id = ". $org_id;

$rating = mysql_query($sql);
$rating = mysql_fetch_array($rating);

$org_info['rating'] = $rating['avg_rating'];

if (isset($_COOKIE[$org_id ."_voted"]))
		{
		$org_info['already_voted'] = "true";
		}


// ****** Comments
if (isset($list_comments))
	{
	$sql = "SELECT c.*
	FROM rm_comment c
	WHERE c.org_id = ". $org_id .
	" ORDER BY id DESC";

	$comments = mysql_query($sql);
	
	if ($comments)
		{
		$org_info['comments_count'] = mysql_num_rows($comments);
		$comments_array = array();
		while($comment = mysql_fetch_array($comments))
			{
			$single_comment['name'] = $comment['name'];
			$single_comment['comment'] = $comment['comment'];
			$single_comment['time'] = $comment['time'];
			
			$comments_array[] = $single_comment;		
			}
		
		$org_info['org_comments'] = $comments_array;
		}
		
	
	}


echo json_encode($org_info);

?>
