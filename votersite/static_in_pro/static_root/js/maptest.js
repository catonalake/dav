var map;
var redImage, blueImage, greenImage, yellowImage;
var delayvar = 20;
var plotted = 0;
var plotlimit = 0;
var ploterror = 0;


// not using this one right  now  cag20160311
function setAddressMarkers(mapAddress, title) {
    console.log('in setAddressMarkers with address ' + mapAddress + " and title = "+title);   

    var latlng;
    var mapstatus;

    var mapobj = $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+mapAddress+'&v=3&key=AIzaSyDjRfoyViYxyvXyTk0Z93hp6QZ3xcdICPg', null, function (data) {
        if ("geometry" in data.results[0]) {
            var p = data.results[0].geometry.location;
            map.setCenter(p);
            latlng = new google.maps.LatLng(p.lat, p.lng);
            console.log('lat lng is............................ '+latLng);
            map.setCenter(p);
            new google.maps.Marker({
                position: latlng,
                map: map,
                title: title,
                icon: redImage
            }); // end google maps Marker
            if ("status" in data.results[0]) {
                mapstatus = 'found status in data.results[0]  = '+data.results[0].status; // set the status
            } else {mapstatus = 'no status json key in results[0]'};
        } // end if to see if we got tdata
        else {
            console.log('ugh did not find geometry json key in results!!  ');
            latlng = {'lat': 0, 'lng': 0};
            if (data.results.length > 0 && "status" in data.results[0]) {
                mapstatus = data.results[0].status; 
            } else { mapstatus = "just not sure what the status is but keep up the great work!!"} // end else if else

            }; // end else

    }) // end get json
    .done(function() {
        console.log('done with status '+ mapstatus);   
    })
    .fail(function() {
        console.log('failed  :(');   
    })
    .always(function(){
        console.log('address ' + mapAddress);   
    })

    mapobj.always(function(){
        return latlng; // second complete
    });

// reference for ajax calls: http://api.jquery.com/jQuery.ajax/#jqXHR

} // end setAddressMarkers





function setMapMarkers(mapAddress, title, titleaddr, d1) {
    var mapAddress = mapAddress;
    var title = title;
    var titleaddr = titleaddr;
    var latlng = {};
    var image; // use this to point to the correct color based on household affiliation - note this really only works well for single homes

    //console.log('in setMapMarkers title is ' + title);

    if((title.indexOf('D') === -1) && ((title.indexOf('R') != -1) || (title.indexOf('U') != -1))) 
        {  // republican in the house
            image = redImage;
            //console.log('using red image');
        }
         else 
            {     
                if((title.indexOf('D') != -1) && ((title.indexOf('R') === -1) && (title.indexOf('U') === -1)) ) 
                    {  // only dems in the house
                        image = blueImage;
                        //console.log('using blue image');
                    } else {
                            image = yellowImage; 
                            //console.log('using green image');
                        }

            };
    title = titleaddr  +"      \n      "+ title; // concatenate for display

    // for plotting all the addresses reference
    //        - http://stackoverflow.com/questions/19640055/multiple-markers-google-map-api-v3-from-array-of-addresses-and-avoid-over-query

    // to add or delete markers
    //review this https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    // look into this: https://developers.google.com/maps/articles/geocodestrat#intro

    geocoder = new google.maps.Geocoder(); 
    setTimeout(function(){
        geocoder.geocode({ 'address': mapAddress}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                plotted +=1;
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  title: title,
                  icon: image
                });

            var infowindow = new google.maps.InfoWindow({
                content: title
            });

            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(16);
                infowindow.open(map,marker);
            });


                //console.log('lat and lng is '+results[0].geometry.location.lat()+" "+results[0].geometry.location.lng() + " in the OK status logic :)");
                latlng = {'lat': results[0].geometry.location.lat(), 'lng': results[0].geometry.location.lng()};
                //console.log('in ok - resolving with latlng.lat = '+latlng.lat+ ' and latlng.lng = ' +latlng.lng);
                return d1.resolve(latlng);


              } // end if OK
              else { 
                  latlng = {'lat': 0, 'lng':0}; // set these to something if there is an error

                  if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    plotlimit +=1;
                    //console.log(' OVER_QUERY_LIMIT - think about using bing and storing the lat lng on vstats? delay = ' + delayvar);
                    //delayvar = delayvar + 20;
                  } // end if
                   else {
                        ploterror +=1;
                        console.log('status not ok ' + status);
                        } //end else - this is some other error (i.e. not over query limit)
                    }; // end else
                //console.log('printing what i am about to return - latlng.lat = '+latlng.lat+ ' and latlng.lng = ' +latlng.lng);
                return d1.resolve(latlng);


            }); // end geocode function
    
      }, delayvar);
        
} // end setMapMarkers

//NOTE
    // below is more for server side processing ... 
    //$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + mapAddress + '&v=3', null, function (data) {
    //    var p = data.results[0].geometry.location
    //    var latlng = new google.maps.LatLng(p.lat, p.lng);
    //    new google.maps.Marker({
    //        position: latlng,
    //        map: map,
    //        icon: image,
    //        title: title
    //    });
    //});// end getJSON


function loadMaps() {

    console.log('in loadMaps');
    redImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(20, 40)
    );  
    blueImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(20, 40)
    );  
    greenImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(20, 40)
    );  
    yellowImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(20, 40)
    );  



    //eventually replace this hardcoding with finding the users location 
    //  todo: use geolocatin (now that i turned it on!)  see onenote for api keys
    var lat = 41.580095;
    var lng = -71.477429;
    var myLatLng = {
        lat: lat,
        lng: lng
    };

    currentLocation = new google.maps.LatLng(myLatLng);
    //var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    // good reference https://developers.google.com/maps/documentation/javascript/markers#add

    var mapOptions = {
        center: currentLocation,
        scrollwheel: false,
        zoom: 9
        //mapTypeId: google.maps.mapTypeId.ROADMAP
    };
    //once AJAX API is loaded successfully.  load the markers
    //google.load("maps", "2", {"callback" : initMap});
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions, {"callback" : initMap()});
}

function testAddressesOnMap(addresses) {
        for (var x = 0; x < addresses.length; x++) {
        var title = 'number of voters - ' + x; // just playing for now
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&v=3', null, function (data) {
            var p = data.results[0].geometry.location;
           console.log(' length of data.results = '+data.results.length);

            var latlng = new google.maps.LatLng(p.lat, p.lng);
            new google.maps.Marker({
                position: latlng,
                map: map,
                title: title,
                icon: redImage
            }); // end google maps Marker

        }); // end get json
        console.log('data = ' + addresses[x])
    } // end for loop
} // end function
function initMap() {
    console.log('in initMap');
    var addresses = ['50 henrietta st providence ri', '1289 douglas ave n providence ri', '2 gaudet st n providence ri','1600 smith st providence ri','50 sherwood st providence ri'];
    //testAddressesOnMap(addresses);
}

$(document).ready(function () {
    console.log('in document ready in maptest.html - this is not doing anyting - get rid of this?');

    //commenting out below as it only applies on the mapvoters2.html page
      //var heading = document.getElementById("baseWindowOpenHeading");
      //heading.innerHTML="Map of voters - mapvoters2.html";
      //alert('after setting baseWindowOpenHeading');
}); 
