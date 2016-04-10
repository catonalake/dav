// some global variables? 
var myWindow = false; // used for the pop up with homes
var districtWindow = false; // WAS used for the pop up with homes for districts but reusing logic 
var parentWindow; // used to capture the parent window 
var mapWindow = false;

// view https://editor.datatables.net/examples/advanced/deepObjects.html
// currently this function is commented out..
function showDataOnList(parsedAddress) {
        //parsedAddress is kind of a dumb name - would be beter to call it passedAddressesJSON
        //also - wouldn't it be great if this function was more generic?
    // from https://jsperf.com/jquery-append-vs-html-list-performance/235
    // maybe do an ajax call to get the voter names???
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
            // supplement this data with voter names
            // age
            // allow to click and post information - tag for 

              // for loop to go through parsedAddress.household[i].voter array ? 
              // instead could this be populated with  datatables??
              // ....or....  put a promise here to look up the voter information for the specific address
              // and promise.then( would include the appendchild below?? )
          frag.appendChild(el);
        }
        document.getElementById('list').appendChild(frag); // this worked - can we use a datatable instead??
    // take above code and sort - make sure we know what is even vs. odd too...
    // put a clear data button to start over
    // keep the datatable above as visible
    // how do we put the most recent streets on the top?
}; // end function showDataOnList



function showPrettyDataOnList(parsedAddress) {
        //parsedAddress is kind of a dumb name - would be beter to call it passedAddressesJSON
        //also - wouldn't it be great if this function was more generic?
    // from https://jsperf.com/jquery-append-vs-html-list-performance/235
    // maybe do an ajax call to get the voter names???
    // put a clear data button to start over
    // keep the datatable above as visible
    // how do we put the most recent streets on the top?


    var prettyTable = $('#homes').DataTable({
                bJQueryUI: true,
                sPaginationType: "full_numbers",
                "aaData": parsedAddress.household,  // array of objects in the household json object array 
                //"aaData": array_of_addresses,  // array of objects
                retrieve: true,
                paging: true,
                "aoColumnDefs": [
                { 'sClass': 'addressclass', 'aTargets': [0,1,2] },
                //{ "visible": false, "targets": [1, 2] }           
                ],
                  "columnDefs": [
                  ],

                "aoColumns": [
                    { "mData": "street_number" }, // <-- which values to use inside object
                    { "mData": "street_name"},
                    { "mData": "city"}, // remove this
                    { "mData": "unit" },
                    { "mData": "rvoters" },
                    { "mData": "uvoters" },
                    { "mData": "mvoters" },
                    { "mData": "dvoters" }
                ]
                } ); // end dataTables

    //if ( $("#homes").hasClass("hidden")){ 
    if ( $("#homes").is(":hidden")){ 
        // think about using http://jqueryui.com/effect/
        console.log('found and removing hidden class');
        //$('#homes').removeClass("hidden");
        //$('#displaylistbutton').removeClass("hidden");
        $('#homes').removeClass('hidden');
        $('#displaylistbutton').removeClass('hidden');

        $('#tableid').toggle(1000); // transition the datatables up
        $('#tableid_length').toggle(1000); // transition the datatables up
        $('#tableid_filter').toggle(1000); // transition the datatables up
        $('#tableid_paginate').toggle(1000); // transition the datatables up
        $( "#tableid_info" ).toggle(1000);
        }
    else {
        console.log('not hidden - adding more rows');
        prettyTable.rows.add(parsedAddress.household).draw();
        $('#tableid').toggle(1000); // transition the datatables up
        $('#tableid_length').toggle(1000); // transition the datatables up
        $('#tableid_filter').toggle(1000); // transition the datatables up
        $('#tableid_paginate').toggle(1000); // transition the datatables up
        $( "#tableid_info" ).toggle(1000);
        }


}; // end function showPrettyDataOnList


function getData(address_data, rowId) {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred(); // think about introducing this..
    console.log('Called getData!');

    var csrftoken = getCookie('csrftoken'); // will need this to post stuff ...??
    console.log('in getData 100 - set csrftoken = ', csrftoken);
    var address_data_json = {}; //use this to create a json request with an array of homes  

    var promise = new Promise(function(resolve, reject) {
            $.ajax({
            url: 'http://127.0.0.1:8000/elections/homesonstreet/',
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
                var mappromises = [];
                // for each address object found in the database...
                $.each(obj, function (i, v) {
                    //var voterAge = obj[i]...... consider logic for voter ages?
                    var d1 = new $.Deferred();
                    var voter_array = [];
                    houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                    var specific_address_data = {
                        'city': obj[i].fields.city, // change this to postal city when we move to fullvs
                        'street_name': obj[i].fields.street_name,
                        'street_number': obj[i].fields.street_number,
                        //'unit': obj[i].fields.unit,
                        'rvoters': obj[i].fields.rvoters,
                        'uvoters': obj[i].fields.uvoters,
                        'mvoters': obj[i].fields.mvoters,
                        'dvoters': obj[i].fields.dvoters,
                    };
                    //maybe do another promise here?
                    //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

                    mapAddress = specific_address_data.street_number + " " + 
                        specific_address_data.street_name + " " + 
                        specific_address_data.city + " " + " RI";

                    var titleaddr = specific_address_data.street_number + " " + 
                        specific_address_data.street_name;
                    var title = '';
                    if (specific_address_data.rvoters != 0 ){
                        title = title + " R: " + specific_address_data.rvoters;
                    };
                    if (specific_address_data.uvoters != 0 ){
                        title = title + " U: " + specific_address_data.uvoters;
                    };
                    if (specific_address_data.mvoters != 0 ){
                        title = title + " M: " + specific_address_data.mvoters;
                    };
                    if (specific_address_data.dvoters != 0 ){
                        title = title + " D: " + specific_address_data.dvoters;
                    };
                    //var title = "R- " + specific_address_data.rvoters + " | U - " + specific_address_data.uvoters +
                    //" M - " + specific_address_data.mvoters + " D - " + specific_address_data.dvoters;

                    //console.log('about to call setAddressMarkers');
                    //console.log('about to call setMapMarkers');
                    setMapMarkers(mapAddress, title, titleaddr, d1);
                    mappromises.push(d1);
                    // check this out for deferred http://stackoverflow.com/questions/11833851/jquery-deferred-with-an-array-of-functions
                    $.when(d1).done(
                        function (latlng) {
                            //alert('latlng is '+latlng.lat +' '+ latlng.lng);
                            console.log(' in deferredmap.done - how should we post lat and lng = '+ 
                                latlng.lat+ " "+ latlng.lng +
                                " for house  " + specific_address_data.street_number +  
                                " "+specific_address_data.street_name);
                            // should we update the mysql table (e.g. fullvs? with this lat lng data??
                            //specific_address_data['lng'] = latlng.lng;
                        }//end this function
                        ); // end $.when done


                }); // end loop for each address 

                // these are set in msetMapMarkers function
                $.when.apply(undefined, mappromises).promise(function() {
                    console.log('plotted addresses          ' + plotted);
                    console.log('plot limits                ' + plotlimit);
                    console.log('plotted errors             ' + ploterror);
                    console.log('length of address array is '+address_array.length);
                });// end function and when promise around this stuff!!

                console.log('in getData 250 - length of address_array = ' + address_array.length);
                address_data_json['household'] = address_array; //set the array of homes processed above
                var test_address = 'in getData 260 - homes on street ';
                for (var i = 0; i < address_data_json.household.length; i++) { //loop through the array and log the voters
                        test_address = test_address + "\n" + 
                            address_data_json.household[i].street_number + " " +
                            address_data_json.household[i].street_name + " " +
                            address_data_json.household[i].city + " " +
                            //address_data_json.household[i].unit + " " +
                            address_data_json.household[i].rvoters + " " +
                            address_data_json.household[i].uvoters + " " +
                            address_data_json.household[i].mvoters + " " +
                            address_data_json.household[i].dvoters + " lat" +
                            address_data_json.household[i].lat + " lng" +
                            address_data_json.household[i].lng;
                }; // end for loop
                console.log(test_address); 

                //CONSIDER: if debug for this type of stuff??? then shut that off for production :)
                //alert('in getData 275 - about to traverse 333');
                //traverse(address_data, alert);  // ok for debugging but just alerts each node, not each value...


                //alert("in getData - 330 - address_data street and city: \n " + houseHolds + " \n \n on :  \n" + address_data.street_name + " " + address_data.city + " ");

                // need to get the voters first, then we can resolve the address
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
            console.log('in getData 510 - think about putting the map voter data call here?');
            // showDataOnList(address_data_json); // commented this out 
            showPrettyDataOnList(address_data_json); // adding to populate datatable

            // alert(address_data_json); //alerted object
            //var parsedAddress = jQuery.parseJSON(address_data_json); // don't need to parse - already json!

            var showingStreetList = "<br> <br>" + "Showing a list of households on " + address_data.street_name + " in the town of " + address_data.city + " </br>  </br> " ;
            // change this paragraph to present the other critera...  like house or senate district 
            console.log('in getData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);

            //cag20160321 commented out next line since we won't show new page
            //myWindow.document.getElementById('testpara').innerHTML = showingStreetList;
            document.getElementById('testpara').innerHTML = showingStreetList;

            // good reference for datatables: http://live.datatables.net/irudow/48/edit#preview
            // checkbox on first column: http://www.kvcodes.com/2014/12/add-checkbox-first-column-jquery-datatable/

            console.log('before commented out code for datatable on the new window - since we are not oepning new window');

            //myWindow.$('#homes').DataTable({
            //    bJQueryUI: true,
            //    sPaginationType: "full_numbers",
            //    "aaData": address_data_json.household,  // array of objects in the household json object array 
            //    //"aaData": array_of_addresses,  // array of objects
            //    retrieve: true,
            //    paging: true,
            //    "aoColumnDefs": [
            //    { 'sClass': 'addressclass', 'aTargets': [0,1,2] },
            //    { "visible": false, "targets": [1, 2] }           
            //    ],
            //      "columnDefs": [
            //      ],
            //    "aoColumns": [
            //       { "mData": "street_number" }, // <-- which values to use inside object
            //        { "mData": "street_name"},
            //        { "mData": "city"}, // remove this
            //        { "mData": "unit" },
            //        { "mData": "rvoters" },
            //        { "mData": "uvoters" },
            //        { "mData": "mvoters" },
            //        { "mData": "dvoters" }
            //    ]
            //    } ); // end dataTables

            var homestable = $('#homes').DataTable(); // cag20160321 not sure what we do with this??
            // understand the difference between dataTable and DataTable: 
            // https://datatables.net/manual/api
            // https://datatables.net/reference/api/  (this is excellent resource)



        //end promise.then( the stuff above goes between the parens above )
        }, 
          function(error) {
            console.log('Promise rejected.');
            console.log(error.message);
          }
          ); //end promise.then

    }; //end getData

function getDistrictData(address_data, rowId) {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred();
    console.log('Called getDistrictData!');

    //$.each(address_data, function (i, v) {
    //    console.log('i:v = ' + i + " " + v);
    //};


    var csrftoken = getCookie('csrftoken');
    var address_data_json = {}; //use this to create a json request with an array of homes  

    var promise = new Promise(function(resolve, reject) {
            $.ajax({
            url: 'http://127.0.0.1:8000/elections/homesindistrict/',
            type: 'GET',
            async: true,
            data: address_data,
            dataType: 'json',
            success: function (json) {
                //alert('in getDistrictData - 200 - ', json);
                //alert(address_data); - this shows up as an object
                var houseHolds = '';
                var obj = jQuery.parseJSON(json);
                var address_array = []; //this will be a list of households in json

                //alert('in getDistrictData - 225  - address_data.street_name = ' + address_data.street_name)
                var mappromises = [];
                // for each address object found in the database...
                $.each(obj, function (i, v) {
                    //var voterAge = obj[i]...... consider logic for voter ages?
                    var d1 = new $.Deferred();
                    var voter_array = [];
                    houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                    var specific_address_data = {
                        'city': obj[i].fields.city, // change this to postal city when we move to fullvs
                        'street_name': obj[i].fields.street_name,
                        'street_number': obj[i].fields.street_number,
                        'unit': obj[i].fields.unit,
                        'rvoters': obj[i].fields.rvoters,
                        'uvoters': obj[i].fields.uvoters,
                        'mvoters': obj[i].fields.mvoters,
                        'dvoters': obj[i].fields.dvoters,
                    };
                    //maybe do another promise here?  a deferred for this??
                    //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

                    mapAddress = specific_address_data.street_number + " " + 
                        specific_address_data.street_name + " " + 
                        specific_address_data.city + " " + " RI";
                    var titleaddr = specific_address_data.street_number + " " + 
                        specific_address_data.street_name;
                    var title = '';
                    if (specific_address_data.rvoters != 0 ){
                        title = title + " R: " + specific_address_data.rvoters;
                    };
                    if (specific_address_data.uvoters != 0 ){
                        title = title + " U: " + specific_address_data.uvoters;
                    };
                    if (specific_address_data.mvoters != 0 ){
                        title = title + " M: " + specific_address_data.mvoters;
                    };
                    if (specific_address_data.dvoters != 0 ){
                        title = title + " D: " + specific_address_data.dvoters;
                    };

                    //console.log('about to call setMapMarkers');
                    setMapMarkers(mapAddress, title, titleaddr, d1);
                    mappromises.push(d1);
                    // check this out for deferred http://stackoverflow.com/questions/11833851/jquery-deferred-with-an-array-of-functions
                    $.when(d1).done(
                        function (latlng) {
                            //alert('latlng is '+latlng.lat +' '+ latlng.lng);
                            console.log(' in deferredmap.done lat and lng = '+ 
                                latlng.lat+ " "+ latlng.lng +
                                " for house  " + specific_address_data.street_number +  
                                " "+specific_address_data.street_name +
                                " " +specific_address_data.unit );
                            //specific_address_data['lng'] = latlng.lng; // would be nice if we could store these

                        }//end this function
                        ); // end $.when done
                }); // end loop for each address 

                // these are set in msetMapMarkers function
                $.when.apply(undefined, mappromises).promise(function() {
                    console.log('plotted addresses          ' + plotted);
                    console.log('plot limits                ' + plotlimit);
                    console.log('plotted errors             ' + ploterror);
                    console.log('length of address array is '+address_array.length);
                });// end function and when promise around this stuff!!  but this doesn't seem to be working

                console.log('in getDistrictData 250 - length of address_array = ' + address_array.length);
                address_data_json['household'] = address_array; //set the array of homes processed above
                var test_address = 'in getDistrictData 260 - homes on street ';
                console.log(test_address); 
                for (var i = 0; i < address_data_json.household.length; i++) { //loop through the array and log the voters
                        test_address = address_data_json.household[i].street_number + " " +
                            address_data_json.household[i].street_name + " " +
                            address_data_json.household[i].city + " RI";
                }; // end for loop
                console.log(test_address); 

                //CONSIDER: if debug for this type of stuff??? then shut that off for production :)
                //alert('in getDistrictData 275 - about to traverse 333');
                //traverse(address_data, alert);  // ok for debugging but just alerts each node, not each value...


                //alert("in getDistrictData - 330 - address_data street and city: \n " + houseHolds + " \n \n on :  \n" + address_data.street_name + " " + address_data.city + " ");

                resolve (address_data_json);

            }, // end sucess
            failure: function (json) {
                alert('in getDistrictData 400 - got an error homie');
                reject(Error(statusText));
            } // end failure

        }); //end ajax

        }); //end promise

    promise.then(
        // put another promise here with ajax call to get voters using address_data_json and resolving parsedAddress
        // will have to remove the line setting parseAddress to address_data_json;
        //promise.then( the stuff that follows between this?  where voters will be included??)
        function(address_data_json) {
            console.log('in getDistrictData 500 - Got data! Promise fulfilled.');
            console.log('in getDistrictData 510 - think about putting the map voter data call here?');
            showDataOnList(address_data_json); // commented this out 

            // alert(address_data_json); //alerted object
            //var parsedAddress = jQuery.parseJSON(address_data_json); // don't need to parse - already json!

            if (address_data.query_controller === 'housedistricts') {
                var showingStreetList = "<br> <br>" + "Showing a list of households on " + address_data.street_name + " in the town of " + address_data.city + 
                                        " in RI State Rep Disctrict "  + 
                                        address_data.state_rep_district + " </br>  </br> " ;
            } else {
                if (address_data.query_controller === 'senatedistricts') {
                    var showingStreetList = "<br> <br>" + "Showing a list of households on " + address_data.street_name + " in the town of " + address_data.city + 
                                        " in RI State Senate Disctrict "  + 
                                        address_data.state_senate_district + " </br>  </br> " ;
            };

            };
            console.log('in getDistrictData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);

            myWindow.document.getElementById('testpara').innerHTML = showingStreetList;

            // good reference for datatables: http://live.datatables.net/irudow/48/edit#preview
            // checkbox on first column: http://www.kvcodes.com/2014/12/add-checkbox-first-column-jquery-datatable/

            myWindow.$('#homes').DataTable({
                bJQueryUI: true,
                sPaginationType: "full_numbers",
                "aaData": address_data_json.household,  // array of objects in the household json object array 
                //"aaData": array_of_addresses,  // array of objects
                retrieve: true,
                paging: true,
                "aoColumns": [
                    { "mData": "street_number" }, // <-- which values to use inside object
                    { "mData": "street_name"},
                    { "mData": "city"}, // remove this
                    { "mData": "unit" },
                    { "mData": "rvoters" },
                    { "mData": "uvoters" },
                    { "mData": "mvoters" },
                    { "mData": "dvoters" }
                ]
                } ); // end DataTables


        //end promise.then( the stuff above goes between the parens above )
        }, 
          function(error) {
            console.log('Promise rejected.');
            console.log(error.message);
          }
          ); //end promise.then

    }; //end getDistrictData


// this is the function that needs to be updated with address
// var odds = 9999999
// evens = 0
//  
// if add number / 2 = 0 then colno = evens+=1 else colno = odds -= 1
// the sort by colno
// 
function getNamesWithDistrictData(address_data, rowId) {
    // cag20160313 cagtodo - create a new html (maybe copy selectedstreet.html) 
    // make sure the new #voters id is set to use the information - 
    // also - think about deferred.... 
    //create the jQuery Deferred object that will be used
    //var deferredObj = $.Deferred();
    console.log('Called getNamesWithDistrictData!');

    var csrftoken = getCookie('csrftoken');
    var address_data_json = {}; //use this to create a json request with an array of homes  
    //alert('about to call json with address_data city = ' + address_data.city + ' street_name = ' + address_data.street_name);

    var promise = new Promise(function(resolve, reject) {
            $.ajax({
            url: 'http://127.0.0.1:8000/elections/homesindistrictwithnames/',
            type: 'GET',
            async: true,
            data: address_data,
            dataType: 'json',
            success: function (json) {
                //alert('in getNamesWithDistrictData - 200 - ', json);
                //alert(address_data); - this shows up as an object
                var houseHolds = '';
                var obj = jQuery.parseJSON(json);
                var address_array = []; //this will be a list of households in json

                //alert('in getNamesWithDistrictData - 225  - address_data.street_name = ' + address_data.street_name)
                var mappromises = [];
                // for each voter object found in the database...
                $.each(obj, function (i, v) {
                    //var voterAge = obj[i]...... consider logic for voter ages?
                    var d1 = new $.Deferred();
                    var voter_array = [];
                    houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                    var specific_address_data = {
                        'city': obj[i].fields.city, // change this to postal city when we move to fullvs
                        'street_name': obj[i].fields.street_name,
                        'street_number': obj[i].fields.street_number,
                        'unit': obj[i].fields.unit,
                        'first_name': obj[i].fields.first_name,
                        'last_name': obj[i].fields.last_name,
                        'current_party': obj[i].fields.current_party,
                    };
                    //maybe do another promise here?  a deferred for this??
                    //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

                }); // end loop for each voter 

                console.log('in getNamesWithDistrictData 250 - length of address_array = ' + address_array.length);
                address_data_json['voter'] = address_array; //set the array of voters processed above
                var test_address = 'in getNamesWithDistrictData 260 - voters found on selected street ';
                for (var i = 0; i < address_data_json.voter.length; i++) { //loop through the array and log the voters
                        test_address = test_address + "\n" + 
                            address_data_json.voter[i].street_number + " " +
                            address_data_json.voter[i].street_name + " " +
                            address_data_json.voter[i].city + " " +
                            address_data_json.voter[i].unit + " " +
                            address_data_json.voter[i].first_name + " " +
                            address_data_json.voter[i].last_name+ " " +
                            address_data_json.voter[i].current_party;
                }; // end for loop
                console.log(test_address); 

                //CONSIDER: if debug for this type of stuff??? then shut that off for production :)
                //alert('in getNamesWithDistrictData 275 - about to traverse 333');
                //traverse(address_data, alert);  // ok for debugging but just alerts each node, not each value...


                //alert("in getNamesWithDistrictData - 330 - address_data street and city: \n " + houseHolds + " \n \n on :  \n" + address_data.street_name + " " + address_data.city + " ");

                resolve (address_data_json);

            }, // end sucess
            failure: function (json) {
                alert('in getNamesWithDistrictData 400 - got an error homie');
                reject(Error(statusText));
            } // end failure

        }); //end ajax

        }); //end promise

    promise.then(
        // put another promise here with ajax call to get voters using address_data_json and resolving parsedAddress
        // will have to remove the line setting parseAddress to address_data_json;
        //promise.then( the stuff that follows between this?  where voters will be included??)
        function(address_data_json) {
            console.log('in getNamesWithDistrictData 500 - Got data! Promise fulfilled.');
            console.log('in getNamesWithDistrictData 510 - think about putting the map voter data call here?');
            showDataOnList(address_data_json); // commented this out 

            // alert(address_data_json); //alerted object
            //var parsedAddress = jQuery.parseJSON(address_data_json); // don't need to parse - already json!


            var showingStreetList = "<br> <br>" + "Showing a list of voters at homes found on " + address_data.street_name + " in the town of " + address_data.city;

            console.log('in getNamesWithDistrictData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);

            myWindow.document.getElementById('testpara').innerHTML = showingStreetList;

            // good reference for datatables: http://live.datatables.net/irudow/48/edit#preview
            // checkbox on first column: http://www.kvcodes.com/2014/12/add-checkbox-first-column-jquery-datatable/

            myWindow.$('#voters').DataTable({
                bJQueryUI: true,
                sPaginationType: "full_numbers",
                "aaData": address_data_json.voter,  // array of objects in the household json object array 
                //"aaData": array_of_addresses,  // array of objects
                  "columnDefs": [
                    { "visible": false, "targets": [1, 3] }
                  ],
                retrieve: true,
                paging: true,
                "aoColumns": [
                    { "mData": "street_number" }, // <-- which values to use inside object
                    { "mData": "street_name"},
                    { "mData": "unit" },
                    { "mData": "city"}, // remove this - tried to  hide with columndefs cag20160318
                    { "mData": "first_name" },
                    { "mData": "last_name" },
                    { "mData": "current_party" }
                ]
                } ); // end DataTables


        //end promise.then( the stuff above goes between the parens above )
        }, 
          function(error) {
            console.log('Promise rejected.');
            console.log(error.message);
          }
          ); //end promise.then

    }; //end getNamesWithDistrictData #cag20160314  note party_code vs current_party here...  :)

//maybe this isn't working because of the myWindow variables??
//$(document).on('pageinit', '#pageone', function(){       
//    alert('Pageinit');
//
//        $("#mobiletableid").DataTable({
//        bJQueryUI: true,
//        sPaginationType: "full_numbers",
//        "aoColumnDefs": [
//            { }
//            ]
//    });
//
//
//});

$(document).ready(function() {
    parentWindow = $(this.document); //not sure how to use this??

    // parentWindow.console.log('logging the parent window :) '); // this doesnt work

    // this is in electablevstatsdatatable2.html
    $("#tableid").DataTable({
        bJQueryUI: true,
        sPaginationType: "full_numbers",
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [0, 1] }
            ]
        //"fnDrawCallback": function () {
        //    alert('DataTables has redrawn the table'); # or do something else when the table is loaded...?
        //}

    });

    $("#mobiletableid").DataTable({
        bJQueryUI: true,
        sPaginationType: "full_numbers",
        "aoColumnDefs": [
            { }
            ]
        //"fnDrawCallback": function () {
        //    alert('DataTables has redrawn the table'); # or do something else when the table is loaded...?
        //}

    });


    // this is in districtstats.html
    $("#districttableid").DataTable({
        bJQueryUI: true,
        sPaginationType: "full_numbers",
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [0, 1] }
            ]
            // this didn't help at all { 'width': '20px', 'aTargets': [0] }

        //"fnDrawCallback": function () {
        //    alert('DataTables has redrawn the table'); # or do something else when the table is loaded...?
        //}

    });

    // cag20160313 cagtodo - put a new table reference here for the new html created with row classes of streetstatsclass

    // understand the difference between dataTable and DataTable

    var districttable = $('#districttableid').DataTable();

    $("#col0").on('keyup', function() {
        districttable.columns(0).search($(this).val()).draw();
    });    

    $("#col1").on('keyup', function() {
        districttable.columns(1).search($(this).val()).draw();
    });    

    var citytable = $('#tableid').DataTable();

    $("#citysearch").on('keyup', function() {
        citytable.columns(0).search($(this).val()).draw();
    });    
    //excellent jsfiddle for this: http://jsfiddle.net/xdhgn55q/




}); // cag20160313 cag think about moving the functions below inside document ready???? - tried that and it broke the on click stuff after entering data in the textbox


// this is set in the html for electablevstatsdatatabel2 so user can map out the addresses on the selected street
// not the best name for the class actually


$('#displaylistbutton').on('click', function () {
    $('#displaylistbutton').slideUp("slow"); // hide the button

    $('#tableid').slideDown("slow"); // transition the datatables up
    $('#tableid_length').slideDown("slow"); // transition the datatables up
    $('#tableid_filter').slideDown("slow"); // transition the datatables up
    $('#tableid_paginate').slideDown("slow"); // transition the datatables up
    $( "#tableid_info" ).slideDown("slow"); 
});


$('.voterrowclass').on('click', function () {

    console.log('in voterrowclass on click');
    $(this).addClass('info'); // cag20160321 so we know what rows are shwowing on our list

    var cityName = $(this).attr('data-city');
    var streetName = $(this).attr('data-street-name');
    var requestController = $(this).attr('data-request-controller');
    var controllerValues = {'city': getData, 'housedistricts': getDistrictData, 'senatedistricts': getDistrictData};

    var rowId = $(this).attr('data-rowid');
    //alert(rowId);
    var repDistrict = $(this).attr('data-rep-district');
    var senateDistrict = $(this).attr('data-senate-district');
    var myWindow; //added cag20160321

    address_data = {
        city: cityName,
        street_name: streetName,
        state_rep_district: repDistrict,
        state_senate_district: senateDistrict,
        query_controller: requestController
    };

    var address_data_json = controllerValues[requestController](address_data, $(this), myWindow); 


}); // end voterrowclass on click

// this is set dynamically using columndefs for the selectedstreet html but doesn't seem to quite work...
$('.addressclass').on('click', function () {
    alert('Clicked address');

   // added to help get data and know which row we are looking at....
   $(this).addClass('info');

   var cityName = $(this).attr('data-city');
   var streetName = $(this).attr('data-street_name');
   var streetNumber = $(this).attr('data-street-number');
   var unitNumber = $(this).attr('data-unit');

   var sts = "     Voter Address: " + "\n " + streetNumber + " " + streetName + " " + unitNumber + ", " + cityName;

   //alert(sts);

   rowId = $(this).attr('data-rowid');
   //alert(rowId);

   //$('#' + rowId).addClass('warning'); // this isn't working?
   //$('#' + rowId + ' .namesandaddress').html(sts); // this isn't working?

   address_data = {
       city: cityName,
       street_number: streetNumber,
       street_name: streetName,
       unit: unitNumber
   };

   NeedVoters(address_data, $(this));

}); // address class on click



// this will be a class set on the rows for the new html
// cag20160313 cag todo - create new html like districtstats.html 
//- create a new view and url
// make sure the rows specify this class 
// so we can test the getNamesWithDistrictData function populating the districtwithnames html
$('.streetstatsclass').on('click', function () {

    console.log('in streetstatsclass on click');

    var cityName = $(this).attr('data-city');
    var streetName = $(this).attr('data-street-name');
    var requestController = $(this).attr('data-request-controller');
    var controllerValues = {'city': getData, 'housedistricts': getDistrictData, 'senatedistricts': getDistrictData};
    var vstat_id = $(this).attr('data-rowid');


    var rowId = $(this).attr('data-rowid');
    //alert(rowId);
    var repDistrict = $(this).attr('data-rep-district');
    var senateDistrict = $(this).attr('data-senate-district');

    address_data = {
        vstat_id: vstat_id,
        city: cityName,
        street_name: streetName,
        state_rep_district: repDistrict,
        state_senate_district: senateDistrict,
        query_controller: requestController
    };


    var url = 'http://127.0.0.1:8000/elections/districtwithnames/';
    var windowName = 'VotersPopUp';
    var windowSize = "scrollbars=yes, menubar=yes";
    //var windowSize = "width=1020,height=640,scrollbars=yes"; // leaving width and height off :)
    
    if (myWindow && !myWindow.closed) {
        myWindow.close();
    };
    //myWindow = window.open(url, windowName, "menubar=yes", false);
    myWindow = window.open(url, windowName, windowSize, false);
    myWindow.addEventListener("load", function(evt) {
        evt.preventDefault();
        myWindow.document.getElementById('baseWindowOpenHeading').innerHTML="Voters At Address View";
        myWindow.document.getElementById('para').innerHTML=" ";
        // do we need this??    
        if (myWindow.Promise) {
            myWindow.console.log('Promise found in new window');
            // see cag20160313 - cag think about above about adding a data-request-control
           var address_data_json = getNamesWithDistrictData(address_data, $(this), myWindow); 
        } else {
        console.log('Promise not available');
        };
    }); // end event listener function 


}); // end streetstatsclass on click



$('.mstreetclass').on('click', function () {

    console.log('in mstreetclass on click');

    var cityName = $(this).attr('data-city');
    var streetName = $(this).attr('data-street-name');
    var requestController = $(this).attr('data-request-controller');
    var controllerValues = {'city': getData, 'housedistricts': getDistrictData, 'senatedistricts': getDistrictData};
    var vstat_id = $(this).attr('data-rowid');
    var rowId = $(this).attr('data-rowid');
    //alert(rowId);
    var repDistrict = $(this).attr('data-rep-district');
    var senateDistrict = $(this).attr('data-senate-district');

    address_data = {
        vstat_id: vstat_id,
        city: cityName,
        street_name: streetName,
        state_rep_district: repDistrict,
        state_senate_district: senateDistrict,
        query_controller: requestController
    };

    console.log('vstat_id = ' + address_data.vstat_id + ' city ' + address_data.city +
        ' street = ' + address_data.street_name + ' rep district ' + address_data.state_rep_district
        + ' senate ' + address_data.state_senate_district + ' query_controller ' + address_data.query_controller )


    // instead of URL - go to page 2?
    $.mobile.changePage( "#streetlist", { transition: "slideup", changeHash: true });
    var myWindow; // just making this defined
    var address_data_json = getNamesWithDistrictData(address_data, $(this), myWindow); 

    //    myWindow.document.getElementById('pageh1').innerHTML="Walking List for " + address_data.street_name;
    //    myWindow.document.getElementById('para').innerHTML=" ";


    //var url = 'http://127.0.0.1:8000/elections/mvnames/';
    //var windowName = 'VotersPopUp';
    //var windowSize = "scrollbars=yes";
    //var windowSize = "width=1020,height=640,scrollbars=yes"; // leaving width and height off :)
    
    //if (myWindow && !myWindow.closed) {
    //    myWindow.close();
    //};
    //myWindow = window.open(url, windowName, "menubar=yes", false);
    //myWindow = window.open(url, windowName, windowSize, false);
    //myWindow.addEventListener("load", function(evt) {
    //    evt.preventDefault();
    //    myWindow.document.getElementById('pageh1').innerHTML="Walking List for " + address_data.street_name;
    //    myWindow.document.getElementById('para').innerHTML=" ";
        // do we need this??    
    //    if (myWindow.Promise) {
    //        myWindow.console.log('Promise found in new window');
            // see cag20160313 - cag think about above about adding a data-request-control
    //       var address_data_json = getNamesWithDistrictData(address_data, $(this), myWindow); 
    //    } else {
    //    console.log('Promise not available');
    //    };
    //}); // end event listener function 


}); // end mstreetclass - copied from streetstatsclass on click and needs to be DRY!!