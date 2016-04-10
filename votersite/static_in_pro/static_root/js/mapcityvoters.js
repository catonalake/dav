// some global variables? 
var myWindow = false; // used for the pop up with homes
var parentWindow; // used to capture the parent window 
var mapWindow = false;

// view https://editor.datatables.net/examples/advanced/deepObjects.html
// currently this function is commented out..
function showDataOnList(parsedAddress) {
        //parsedAddress is kind of a dumb name - would be beter to call it passedAddressesJSON
        //also - wouldn't it be great if this function was more generic?
        // from https://jsperf.com/jquery-append-vs-html-list-performance/235
        var frag = document.createDocumentFragment();
        var len = parsedAddress.household.length;
        for (var i = 0, el; i < len; i++) {
          el = document.createElement('div');
          el.textContent = ' ' + 
              parsedAddress.household[i].street_number + " " + 
              parsedAddress.household[i].street_name + " " +
              parsedAddress.household[i].city + " " +
              parsedAddress.household[i].unit + 
              " Republicans "  + 
              parsedAddress.household[i].rvoters + 
              " Unaffiliated " + 
              parsedAddress.household[i].uvoters + 
              " Moderates " + 
              parsedAddress.household[i].mvoters + 
              " Democrats " + 
              parsedAddress.household[i].dvoters;




              // for loop to go through parsedAddress.household[i].voter array ? 
              // instead could this be populated with  datatables??
              // ....or....  put a promise here to look up the voter information for the specific address
              // and promise.then( would include the appendchild below?? )
          frag.appendChild(el);
        }
        document.getElementById('list').appendChild(frag); // this worked - can we use a datatable instead??
        // take above code and put into
}; // end function showDataOnList

function getData() {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred();
    console.log('Called getData!');
    console.log('address_data.city = ' + address_data.city);

    var csrftoken = getCookie('csrftoken');
    console.log('in getData 100 - set csrftoken = ', csrftoken);
    var address_data_json = {}; //use this to create a json request with an array of homes  

    console.log('in getData 101 - about to call promise function ');
    var promise = new Promise(function(resolve, reject) {
            $.ajax({
            url: 'http://127.0.0.1:8000/elections/homesincity/',
            type: 'GET',
            async: true,
            data: address_data,
            dataType: 'json',
            success: function (json) {
                //alert('in getData - 200 - ', json);
                //alert(address_data); - this shows up as an object
                var houseHolds = '';
                var obj = jQuery.parseJSON(json);
                var address_array = []; //this will be a list of households in json

                //alert('in getData - 225  - address_data.street_name = ' + address_data.street_name)

                // for each street object found in the database...
                $.each(obj, function (i, v) {
                    //var voterAge = obj[i]...... consider logic for voter ages?
                    var voter_array = [];
                    houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                    var specific_address_data = {
                        'city': obj[i].fields.city,
                        'street_name': obj[i].fields.street_name,
                        'street_number': obj[i].fields.street_number,
                        'unit': obj[i].fields.unit,
                        'rvoters': obj[i].fields.rvoters,
                        'uvoters': obj[i].fields.uvoters,
                        'mvoters': obj[i].fields.mvoters,
                        'dvoters': obj[i].fields.dvoters,
                    };
                    //maybe do another promise here?
                    //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

                }); // end loop for each address 

                console.log('in getData 250 - length of address_array = ' + address_array.length);
                address_data_json['household'] = address_array; //set the array of homes processed above

                //CONSIDER: if debug for this type of stuff??? then shut that off for production :)
                //alert('in getData 275 - about to traverse 333');
                //traverse(address_data, alert);  // ok for debugging but just alerts each node, not each value...


                //alert("in getData - 330 - address_data street and city: \n " + houseHolds + " \n \n on :  \n" + address_data.street_name + " " + address_data.city + " ");

                resolve (address_data_json);
            }, // end sucess
            failure: function (json) {
                alert('in getData 400 - got an error homie');
                reject(Error(statusText));
            } // end failure

        }); //end ajax

        }); //end promise

    promise.then(
        // put another promise here with ajax call to get voters using address_data_json and resolving parsedAddress
        // will have to remove the line setting parseAddress to address_data_json;
        //promise.then( the stuff that follows between this?  where voters will be included??)
        function(address_data_json) {


            console.log('in getData 500 - Got data! Promise fulfilled.');


            var lastmapAddress = " ";

            for (var i = 0; i < address_data_json.household.length; i++) { //loop through the array and log the voters
                    var mapAddress = address_data_json.household[i].street_number + " " + 
                        address_data_json.household[i].street_name + " " + 
                        address_data_json.household[i].city + " " + " RI";

                    if (lastmapAddress !=  mapAddress) { // only mark if the address is different
                        test_address = test_address + "\n" + mapAddress;
                        console.log('mapAddress = ' + mapAddress);

                        var title = "R - " + address_data_json.household[i].rvoters + " U - " + address_data_json.household[i].uvoters +
                                    " M - " + address_data_json.household[i].mvoters + " D - " + address_data_json.household[i].dvoters;

                        setMapMarkers(mapAddress, title);

                        lastMarkerAddress = mapAddress;
                    }; // end if


            }; // end for loop
            //console.log(test_address); 
            //showDataOnList(address_data_json); // commented this out but... good to add to see addresses plotted just below the map
            // alert(address_data_json); //alerted object
            //var parsedAddress = jQuery.parseJSON(address_data_json); // don't need to parse - already json!

            var showingStreetList = "<br> <br>" + "Showing a list of households in the town of " + address_data.city + " </br>  </br> " ;
            console.log('in getData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);

            myWindow.document.getElementById('testpara').innerHTML = showingStreetList;

            myWindow.$('#homes').dataTable( {
                bJQueryUI: true,
                //"bSort" : false, // this broke sorting street numbers within street ?? (not sure i believe this)
                sPaginationType: "full_numbers",
                "aaData": address_data_json.household,  // array of objects in the household json object array 
                //"aaData": array_of_addresses,  // array of objects
                retrieve: true,
                paging: true,
                "aoColumns": [
                    { "mData": "street_name" },
                    { "mData": "street_number" }, // <-- which values to use inside object
                    { "mData": "unit" },
                    { "mData": "rvoters" },
                    { "mData": "uvoters" },
                    { "mData": "mvoters" },
                    { "mData": "dvoters" }
                ]
                } ); // end dataTables

        //end promise.then( the stuff above goes between the parens above )
        }, 
          function(error) {
            console.log('Promise rejected.');
            console.log(error.message);
          }
          ); //end promise.then

    }; //end getData??



$(document).ready(function() {
    parentWindow = $(this.document); //not sure how to use this??
    // parentWindow.console.log('logging the parent window :) '); // this doesnt work

    $("#tableid").dataTable({
        bJQueryUI: true,
        sPaginationType: "full_numbers",
        //"fnDrawCallback": function () {
        //    alert('DataTables has redrawn the table'); # or do something else when the table is loaded...?
        //}

    });


});



$('.voterrowclass').on('click', function () {

    var cityName = $(this).attr('data-city');
    //alert('city name = ' + cityName);

    //cool site: http://www.blooberry.com/indexdot/html/topics/windowopen.htm
    // also see: http://stackoverflow.com/questions/19338139/listen-for-event-on-new-window
    // and http://stackoverflow.com/questions/20822711/jquery-window-open-in-ajax-success-being-blocked
    // another reference about openers http://www.javascriptkit.com/javatutors/remote2.shtml
    // reference child of dom http://stackoverflow.com/questions/1258563/how-can-i-access-the-dom-tree-of-child-window
    // another site with parent/ child logic http://www.coderanch.com/t/538106/HTML-CSS-JavaScript/Check-popup-window-open-parent
    //make this a promise?
    rowId = $(this).attr('data-rowid');
    //alert(rowId);

    address_data = {
        city: $(this).attr('data-city'),
    };
    // do an ajax query here for all streets at the address?  then set the address data array?

    console.log(' address_data.city = '+ address_data.city);


    var url = 'http://127.0.0.1:8000/elections/selectedcity/';
    var windowName = 'VotersPopUp';
    var windowSize = "scrollbars=yes, menubar=yes";
    //var windowSize = "width=1020,height=640,scrollbars=yes"; // leaving width and height off :)
    
    if (myWindow && !myWindow.closed) {
        myWindow.close();
    };
    //myWindow = window.open(url, windowName, "menubar=yes", false);
    myWindow = window.open(url, windowName, windowSize, false);
    myWindow.addEventListener("load", function(evt) {
        evt.preventDefault(); // not sure what this does ?
        myWindow.document.getElementById('baseWindowOpenHeading').innerHTML="City View";
        myWindow.document.getElementById('para').innerHTML=" ";

        // do we need this??    
        if (myWindow.Promise) {
            myWindow.console.log('Promise found in new window');
            var address_data_json = getData(address_data, $(this)); // maybe make this the promise statement?????
        } // end if
        else {
            console.log('Promise not available');
        } // end else
        }); // end function and load event listener // note - moved this from after window open..  


});
