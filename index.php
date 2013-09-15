<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//RU">
<html>
<head>
    <title>RecycleMap Mobile v1.1</title>

    <meta http-equiv="Content-Type" content="text/html" charset="cp-1251">

    <link href="css/style.css?update5" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="lib/fancybox/jquery.fancybox-1.3.4.css" type="text/css" media="screen" />
    <!--[if lt IE 7 ]> <link href="ie7.css" rel="stylesheet" type="text/css">    <![endif]-->
    <!--[if IE 7]> <link href="ie7.css" rel="stylesheet" type="text/css"> <![endif]-->
    <!--[if IE 8]> <link href="ie8.css" rel="stylesheet" type="text/css"> <![endif]-->
    <!--[if IE 9]> <link href="ie8.css" rel="stylesheet" type="text/css"> <![endif]-->
   <script src="js/bootstrap.js" type="text/javascript"></script>
    <link href="css/bootstrap.css" rel="stylesheet" media="screen">
    <script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js" type="text/javascript"></script>
    <script src="lib/fancybox/jquery.fancybox-1.3.4.pack.js" type="text/javascript"></script>
    <script src="js/java.js" type="text/javascript"></script>

    <script src="js/JQ.js" type="text/javascript"></script>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui..">
    <script src="http://code.jquery.com/jquery-1.8.3.js"></script>
    <link rel="stylesheet" href="js/chosen/chosen.css">
    <script src="js/chosen/chosen.jquery.js"></script>
    <script src="js/chosen/chosen.jquery.js"></script>


    <?php
    include('db_config.php');
    $sql = "SELECT id,title FROM rm_city";
    $cities = mysql_query($sql);
    ?>


</head>

<body>
<!-- =============Start header====================-->
<header>
 <!-- Logo-->
<div id="logo_wrap">
    <img src="img/logo.png" alt="Вторая жизнь вещей" />
</div>
<!-- Message about geolocation (hidden)-->
<div id="message_location"></div>
<!-- Change city -->
<div id="city_selector">
    Вы смотрите карту пунктов для:&nbsp;&nbsp;


    <script type="text/javascript">
        $(function(){
            $(".chosen-single").chosen();
        });
    </script>

    <select id="city_dropdown" class="chosen-single"  name="faculty" style="width:200px;">
        <option value="0">Выберите город</option>
        <?php while ($city = mysql_fetch_array($cities)) : ?>

            <option value="<?php echo $city['id'] ?>" ><?php echo $city['title']?></option>
        <?php endwhile; ?>
    </select>

</div>
<!-- Filters-->
<div id="filters_list">

    <a href="#filter-paper" id="filter_cat_1" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_1"></div>
    </a>
    <a href="#filter-glass" id="filter_cat_2" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_2"></div>
    </a>
    <a href="#filter-plastic" id="filter_cat_3" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_3"></div>
    </a>
    <a href="#filter-metal" id="filter_cat_4" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_4"></div>
    </a>
    <a href="#filter-clothes" id="filter_cat_5" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_5"></div>
    </a>
    <a href="#filter-danger" id="filter_cat_7" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_7"> </div>
    </a>
    <a href="#filter-misc" 	id="filter_cat_6" class="org_filter icon active" >
            <div class="icon active" id="icon_cat_6"></div>
    </a>
</header>
<!-- =============End header====================-->
        <div id="map_wrapper">

            <div id="map">
            </div>

            <div id="address_search">
                <input type="text" id="address_input" />
            </div>

        </div>

        <div id="map_legend">
        </div>



        <div id="org_card" style="display:none;">


            <div id="org_image">
            </div>

            <div id="org_info">
                <b><span id="org_title"></span></b><br/>
                <br/>
                <label id="rating_label">Оцените пункт:	</label>
                <div id="rating_widget">
                    <div id="star_1" class="rating_stars"></div>
                    <div id="star_2" class="rating_stars"></div>
                    <div id="star_3" class="rating_stars"></div>
                    <div id="star_4" class="rating_stars"></div>
                    <div id="star_5" class="rating_stars"></div>
                </div><br/>

                <label>Принимают: 		</label><span id="org_fractions"></span><br/>
                <label>Время работы: 	</label><span id="org_info_time"></span><br/>
                <label>Адрес/телефон: 	</label><span id="org_info_contacts"></span><br/>
                <label>Дополнительно: 	</label><span id="org_info_misc"></span><br/>

            </div>

        </div>

        <div id="org_comments" style="display:none;">
            <h2>Добавить комментарий</h2>
            <form id="add_comment_form" >
                <label for="add_comment_name">Имя:</label>					<input type="text" id="add_comment_name" /><br/>
                <label for="add_comment_email">E-mail:</label>			<input type="text" id="add_comment_email" /><br/>
                <label for="add_comment_comment">Текст комментария:</label>	<textarea id="add_comment_comment" ></textarea><br/>
                <label for="add_comment_subscribe">Я хочу получать информацию от Гринпис:</label>	<input type="checkbox" value="yes" id="add_comment_subscribe" name="add_comment_subscribe" /><br/>
                <input type="hidden" name="org_id" id="add_comment_hidden" />
                <input type="button" id="add_comment_submit" value="Добавить комментарий" />
            </form>

            <div id="comments_alert" style="display: none;">
            </div>

            <div id="comments_list">
            </div>
        </div>

    </div>

</div>

</body>
</html>		 
