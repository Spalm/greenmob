var city_id  ;
var your_city;

var global_map;
var markersArray = [];
var search_marker;

var infowindow = new google.maps.InfoWindow();

var geocoder = new google.maps.Geocoder();

var address_search_city;


/*function defaultmarker() {
    if(navigator.geolocation) {// if have coords of location then mapServiceProvider, else func ErrLocation
        position=navigator.geolocation.getCurrentPosition(function(position) {
            mapServiceProvider (position.coords.latitude,position.coords.longitude);
        }, ErrLocation);
    }

}
function mapServiceProvider (latitude,longitude){
    mapThisGoogle(latitude,longitude);// �������� ����� �����
}
function mapThisGoogle(latitude,longitude){
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
        center: new google.maps.LatLng(latitude,longitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    console.log("I drink here every day!");
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"I drink here every day!"
    });
}
 */
function ErrLocation(err) {
// var foo = document.getElementById('foo');
// foo.innerHTML = '<p>���������, �������� �����</p></br><select><option> ������ </option> </select>';
// ����� ������ ������ ���-���� ������!!!!!!!!!!!!!!!!!!!!!
    if (err.code == 1) {
        message="�� ��������� ������ � ����� �����������";
    }
    if (err.code == 2) {
        message="��� ����� �� ���������";
    }
    if (err.code == 3) {
        message="�������� ����-��� ����������";
    }
    if (err.code == 0) {
        message="���-�� ����� �� ���";
    }

    $("#message_location").addClass("alert alert-error");
    $("#message_location").html(message+" ,����������, �������� ����� �� ������");
}


$(document).ready(function()
{

    /// ************ CMS

    $.ajax({
        url:"ajax_cms.php?cms_id=1",
        success:function(cms_content)
        {
            $("#map_legend").html(cms_content);


            // ************ CITY FROM REQUEST
            var cityname = document.referrer.toString();
            console.log(cityname);
            cityname = cityname.substring(cityname.lastIndexOf("?") + 1);
            var dropdown = document.getElementById('city_dropdown');
            if (cityname == 'spb')	dropdown.options.selectedIndex = '1';
            else if (cityname == 'obninsk')	dropdown.options.selectedIndex = '2';
            else if (cityname == 'omsk')	dropdown.options.selectedIndex = '3';
            else if (cityname == 'novokuznetsk')	dropdown.options.selectedIndex = '4';
            else if (cityname == 'murmansk')	dropdown.options.selectedIndex = '5';
            else if (cityname == 'kaliningrad')	dropdown.options.selectedIndex = '6';
            else if (cityname == 'tomsk')	dropdown.options.selectedIndex = '7';
            else if (cityname == 'vladivostok')	dropdown.options.selectedIndex = '8';
            else if (cityname == 'novosibirsk')	dropdown.options.selectedIndex = '9';
            else if (cityname == 'habarovsk')	dropdown.options.selectedIndex = '10';
            else if (cityname == 'krasnodar')	dropdown.options.selectedIndex = '11';
            else if (cityname == 'ivanovo')	dropdown.options.selectedIndex = '12';
            else if (cityname == 'voronezh')	dropdown.options.selectedIndex = '13';
            else if (cityname == 'rostov')	dropdown.options.selectedIndex = '14';
            else if (cityname == 'barnaul')	dropdown.options.selectedIndex = '15';
            else if (cityname == 'nnovgorod')	dropdown.options.selectedIndex = '16';
            change_city();
        }
    });

    /// ************ CATEGORIES LIST

    $(".icon.active").hover(
        // in
        function()
        {
            if ($(this).hasClass("active"))
            {
                var selection = $(this).attr("id").substr($(this).attr("id").length-1);
                $("#icon_cat_" + selection).addClass("hover");
            }
        },
        // out
        function()
        {
            var selection = $(this).attr("id").substr($(this).attr("id").length-1);
            $("#icon_cat_" + selection).removeClass("hover");
        }
    );

    $(".icon").click(
        function()
        {

            keys=new Array(1,2,3,4,5,6,7,8);

            // visual
            var selection = $(this).attr("id").substr($(this).attr("id").length-1);//1
            console.log("Do splise"+keys);
            keys.splice(selection-1,1);
            console.log("After splise"+keys);

            for (i=0;i<keys.length;i++){
                selection=keys[i];
                console.log(i+"ii element --- iii kluch"+keys[i]);
                $("#icon_cat_" + selection).toggleClass("die");
            }
            keys=Array(1,2,3,4,5,6,7);

    var selection = $(this).attr("id").substr($(this).attr("id").length-1);
            $("#icon_cat_" + selection).toggleClass("active");
            $("#filter_cat_" + selection).toggleClass("active");
            $("#filter_cat_" + selection).toggleClass("selected");
            // markers
            markers_update_list(city_id);

            return false;
        }
    );


    /// ************ ADDRESS

    $("#address_input").autocomplete(
        {
            source: function(request, response)
            {
                geocoder.geocode( {'address': address_search_city + " " + request.term}, function(results, status)
                {
                    var results_formatted = [];
                    for (var i = 0; i < results.length; i++)
                    {
                        var single_result = [];

                        single_result['label'] = results[i].formatted_address;
                        single_result['value'] = results[i].formatted_address;
                        single_result['lat'] = results[i].geometry.location.lat();
                        single_result['lng'] = results[i].geometry.location.lng();

                        results_formatted.push(single_result);
                    }
                    response (results_formatted);
                })
            },

            select: function(event, ui)
            {
                var location = new google.maps.LatLng(ui.item.lat, ui.item.lng);

                global_map.setCenter(location);

                if (search_marker)
                {
                    search_marker.setPosition(location);
                }
                else
                {
                    search_marker = new google.maps.Marker(
                        {
                            position: location,
                            map: global_map,
                            title: "��������� ������"
                        });
                }
            },

            minLength: 4

        }); // autocomplete

    /// ************ MAP

    prepare_city(city_id);

    google.maps.event.addListener(infowindow, 'closeclick', function()
    {
        show_legend();
    });


    /// ************ RATINGS


    $(".rating_stars").hover(
        // in
        function()
        {
            if ($(this).hasClass('star_active'))
            {
                var selection = $(this).attr("id").substr($(this).attr("id").length-1);
                for (var i = selection; i > 0; i--)
                {
                    $("#star_" + i).addClass("rating_hover");
                }
            }
        },
        // out
        function()
        {
            if ($(this).hasClass('star_active'))
            {
                $(".rating_stars").removeClass("rating_hover");
            }
        }
    );

    $(".rating_stars").click(
        function()
        {
            if ($(this).hasClass('star_active'))
            {
                var rating = $(this).attr("id").substr($(this).attr("id").length-1);
                record_rating_vote($("#add_comment_hidden").val(), rating);

            }
        }
    );

    $("#add_comment_submit").click(
        function()
        {
            add_comment();
        });
    $("#add_point_submit").click(
        function()
        {
            add_point();
        });

    /* CITY SELECTION */
    $("#city_dropdown").change(change_city);

}); // document.ready

function change_city() {
//���� ���� ����������
    if((navigator.geolocation)&&($("#city_dropdown option:selected").val()==0)) {
        position=navigator.geolocation.getCurrentPosition(function(position) {
        $.getJSON(// �������� ����� ������������ �� �����������
                "http://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&language=en&sensor=true",
                 function(data){
                your_city=data.results[0].address_components[2].short_name;
                     console.log("your_city---------->"+your_city);
                    //� ����������� �� ������ ������ id
    if (your_city == 'Moscow')	city_id = 1;
    else if (your_city == 'SPB')	city_id = 2;
    else if (your_city == 'obninsk')	city_id = 3;
    else if (your_city == 'omsk')	city_id = 4;
    else if (your_city == 'novokuznetsk')	city_id = 5;
    else if (your_city == 'murmansk')	city_id = 6;
    else if (your_city == 'kaliningrad')	city_id = 7;
    else if (your_city == 'tomsk')	city_id = 8;
    else if (your_city == 'vladivostok')	city_id = 9;
    else if (your_city == 'novosibirsk')	city_id = 10;
    else if (your_city == 'habarovsk')	city_id = 11;
    else if (your_city == 'krasnodar')	city_id = 12;
    else if (your_city == 'ivanovo')	city_id = 13;
    else if (your_city == 'voronezh')	city_id = 14;
    else if (your_city == 'rostov')	city_id = 15;
    else if (your_city == 'barnaul')	city_id = 16;
    else if (your_city == 'novgorod')	city_id = 17;
    else city_id=2;
                     $("#map_wrapper").addClass("map_wrapper_show");
                     $("#message_location").addClass("alert alert-success");
                     $("#message_location").html("���� ���������� �� �����, ��� ������ � ������");
                prepare_city(city_id,14,position.coords.latitude,position.coords.longitude);

            });
            //���� ���������� �� ��������, ������������ ������
        }, ErrLocation);
    }

    if (($("#city_dropdown option:selected").val())!=0){ $("#map_wrapper").addClass("map_wrapper_show");}
//���� ���������� �� �������� �������� �� ������(��������� � ��������� ������)
        prepare_city($("#city_dropdown option:selected").val());

        city_id = $("#city_dropdown option:selected").val();
    $("#map_legend").show();
    $("#add_point").show();
    $("#org_card").hide();
    $("#org_comments").hide();
}

/// ************ MAP

// Prepare city

function prepare_city(city_id,nav_loc_zoom,lat,lng)
{
    $.getJSON(
        "ajax_city_info.php?city_id=" + city_id,
        function(city_info)
        {
            if (nav_loc_zoom){city_info.city_zoom=nav_loc_zoom;}
            if (lat){city_info.city_lat=lat;}
            if (lng){city_info.city_lng=lng;}
            address_search_city = city_info.city_title;

            global_map = InitMap( parseFloat(city_info.city_lat), parseFloat(city_info.city_lng), parseInt(city_info.city_zoom) );

            markers_update_list(city_id);

        }
    );

}


// Starting the map itself
function InitMap(init_lat, init_lng, init_zoom)
{
    var city = new google.maps.LatLng(init_lat, init_lng);
    var myOptions = { zoom: init_zoom, center: city, mapTypeId: google.maps.MapTypeId.ROADMAP }

    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    return map;

}

function markers_update_list(city_id)
{

    // clearing existing markers
    delete_markers();

    // building categories filter
    var cat_filter = "";
    $("#filters_list a.selected").each(function(i)
    {
        category_string = this.id.substring(this.id.length - 1);
        cat_filter = category_string;
    });


  /*  if (!cat_filter)
    {
        console.log("filter is null");
        defaultmarker();

    } else {console.log(cat_filter);}*/



    // markers.xml
    $.ajax(
        {

            url: "ajax_markers_xml.php?city_id=" + city_id + "&cat_filter=" + cat_filter,
            success: function(data)
            {
                $(data).find("marker").each(function()
                {
                    var marker_xml = $(this);
                    var point = new google.maps.LatLng(marker_xml.attr("lat"),marker_xml.attr("lng"));
                    var image = new google.maps.MarkerImage('img/markers/' + cat_filter + '.png', null, null, new google.maps.Point(21, 18));
                    var marker = new google.maps.Marker(
                        {
                            position: point,
                            map: global_map,
                            title:marker_xml.attr("title"),
                            icon: image
                        });
                    // saving markers for future...
                    markersArray.push(marker);

                    console.log("ajax complete");

                    google.maps.event.addListener(marker, 'click', function()
                    {
                        show_org_info(marker_xml.attr("id"), marker)
                    });
                });
            }
        }); // markers_xml.php

}

function show_org_info(org_id, marker)
{
    $.getJSON(
        "ajax_org_info.php?org_id=" + org_id + "&cats_titles=1&list_comments=1",
        function(org_info)
        {

            if (marker)
            {
                show_map_popup(org_info, marker);
            }

            show_org_card(org_info, org_id);

        });
}

function show_map_popup(org_info, marker)
{
    var popup_content = "<div class='popup_org_title'><b>" + org_info.org_title + "</b></div>";

    if (org_info.rating)
    {
        rating = Math.round(org_info.rating);
        popup_content += "<div class='popup_org_rating'>"
        if (rating > 0)
            popup_content += '<div  class="popup_voted"></div>';
        else
            popup_content += '<div  class="popup_simple"></div>';

        if (rating > 1)
            popup_content += '<div  class="popup_voted"></div>';
        else
            popup_content += '<div  class="popup_simple"></div>';

        if (rating > 2)
            popup_content += '<div class="popup_voted"></div>';
        else
            popup_content += '<div class="popup_simple"></div>';

        if (rating > 3)
            popup_content += '<div class="popup_voted"></div>';
        else
            popup_content += '<div class="popup_simple"></div>';

        if (rating > 4)
            popup_content += '<div class="popup_voted"></div>';
        else
            popup_content += '<div class="popup_simple"></div>';

        popup_content += 	"</div>" +
            "<br style='clear:both' />";
    }

    if (org_info.comments_count)
    {
        popup_content += "<div class='popup_org_comments_count'>" + org_info.comments_count + " �������</div>";
    }

    popup_content += "<div class='popup_org_comments_count'>������ �������� ��� ������</div>";

    infowindow.setContent( popup_content );
    infowindow.open(global_map, marker);

}

function delete_markers() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}


/// ************ ORG CARD

function show_org_card(org_info, org_id)
{

    $("#org_title").html(org_info.org_title);

    $("#org_fractions").html(org_info.org_cats.join(', '));

    if (org_info.org_time) 	$("#org_info_time").html(org_info.org_time)
    else $("#org_info_time").html("-");

    if (org_info.org_contacts) $("#org_info_contacts").html(org_info.org_contacts)
    else $("#org_info_contacts").html("-");

    if (org_info.org_misc) $("#org_info_misc").html(org_info.org_misc)
    else $("#org_info_misc").html("-");


    // Image
    if (org_info.org_image)
    {
        $("#org_image").html(	"<a id='fancybox' title='" + org_info.org_title + "'href='"  + org_info.org_image + "'> " +
            "<img src='" + org_info.org_image + "' width='116' />" +
            "</a>");
        $("#fancybox").fancybox();
    }
    else
    {
        $("#org_image").html("");
    }

    // Rating
    clear_rating();
    if (org_info.already_voted == "true")
    {
        set_rating(org_info.rating);
    }



    // Hidden element for send comments form
    $("#add_comment_hidden").val(org_id)

    // Comments
    var comments_list = "";
    var toggle = "odd";
    $.each(org_info.org_comments, function()
    {
        // Split mysql timestamp into [ Y, M, D, h, m, s ]
        //var t = .split(/[- :]/);
        // Apply each element to the Date function
        //var comment_date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

        comments_list += "<div class='single_comment " + toggle + "'>"
        comments_list += "<div class='comments_author'><span>" + this.name + "</span><br/>" + this.time + "</div>";
        comments_list += "<div class='comments_content'>" + this.comment + "</div>";
        comments_list += "</div>";

        if (toggle == "odd") toggle = "even"
        else toggle = "odd";

    });
    $("#comments_list").html(comments_list);


    $("#map_legend").hide();
    $("#add_point").hide();
    $("#org_card").show();
    $("#org_comments").show();
}

function show_legend()
{
    $("#org_card").hide();
    $("#org_comments").hide();
    $("#map_legend").show();
    $("#add_point").show();
}

/// ************ RATINGS

function record_rating_vote(org_id, rating)
{
    $.ajax(
        {
            url: "/ajax_rating_vote.php?org_id=" + org_id + "&rating=" + rating,
            success: function(data)
            {
                show_org_info(org_id, null);
            }
        });
}

function set_rating(rating)
{
    $(".rating_stars").removeClass("star_active");
    rating = Math.round(rating);
    for (var i = rating; i > 0; i--)
    {
        $("#star_" + i).addClass("rating_voted");
    }
}

function clear_rating()
{
    $(".rating_stars").removeClass("rating_voted");
    $(".rating_stars").removeClass("rating_hover");
    $(".rating_stars").addClass("star_active");
}

/// ************ COMMENTS

function add_comment()
{

    if (!$("#add_comment_email").val() || !$("#add_comment_name").val() || !$("#add_comment_comment").val() )
    {
        $("#comments_alert").html("����������, ��������� ��� ���� �����!");
        $("#comments_alert").slideDown('slow');
    }
    else
    {
        $("add_comment_submit").attr('disabled', 'disabled');
        $.ajax(
            {
                url: "/ajax_post_comment.php?org_id=" + $("#add_comment_hidden").val()
                    + "&email=" 	+ $("#add_comment_email").val()
                    + "&name="  	+ $("#add_comment_name").val()
                    + "&comment=" 	+ $("#add_comment_comment").val().replace(/\n/g, "|")
                    + "&subscribe="	+ $("#add_comment_subscribe").attr("checked"),
                success: function(data)
                {
                    $("#comments_alert").addClass("positive");
                    $("#comments_alert").html(data);
                    $("#comments_alert").slideDown('slow');

                    show_org_info($("#add_comment_hidden").val(), null);

                    $("add_comment_submit").removeAttr('disabled');

                    $("#add_comment_email").val("");
                    $("#add_comment_name").val("");
                    $("#add_comment_comment").val("");
                }
            });
    }
}

/// ************ ADD POINT
function add_point()
{
    $("add_point_submit").attr('disabled', 'disabled');
    $.ajax(
        {
            url: "/ajax_add_point.php?title=" + $("#add_point_title").val()
                + "&fractions="	+ $("#add_point_fractions").val()
                + "&city=" 	+ $("#add_point_city").val()
                + "&contacts=" 	+ $("#add_point_contacts").val()
                + "&timetable=" + $("#add_point_timetable").val()
                + "&misc_info="	+ $("#add_point_misc").val()
                + "&name="	+ $("#add_point_name").val()
                + "&email="	+ $("#add_point_email").val()
                + "&subscribe="	+ $("#add_point_subscribe").attr("checked"),
            success: function(data)
            {

                if ( data == "�������, ���� ���������� ����������.")
                {
                    $("#point_alert").addClass("positive");
                    $("#add_point_title").val("");
                    $("#add_point_fractions").val("");
                    $("#add_point_city").val("")
                    $("#add_point_contacts").val("");
                    $("#add_point_timetable").val("")
                    $("#add_point_misc").val("");
                    $("#add_point_name").val("");
                    $("#add_point_email").val("");
                }

                $("#point_alert").html(data);
                $("#point_alert").slideDown('slow');

                $("add_point_submit").removeAttr('disabled');

            }
        });
}

