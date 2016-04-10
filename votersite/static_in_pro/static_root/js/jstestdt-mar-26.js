// some global variables 
var parentWindow; // used to capture the parent window 
var mapWindow = false;
var cityqc = "city",
    houseqc = "housedistricts",
    senateqc = "senatedistricts";
var debugJflag = true;
var selected_voter_row = null;
var selected_voter_data = null;
var eCtr = 0;
var oCtr = 999999999;
var prettyTable, prettytable = null;

function showMessage(message) {
    //parsedAddress is kind of a dumb name - would be beter to call it passedAddressesJSON
    //also - wouldn't it be great if this function was more generic?
    // from https://jsperf.com/jquery-append-vs-html-list-performance/235
    // maybe do an ajax call to get the voter names???
    var frag = document.createDocumentFragment();
    var len = message.length;
    for (var i = 0, el; i < len; i++) {
      el = document.createElement('div');
      el.textContent = ' ' + 
          message[i];
      frag.appendChild(el);
    }
    document.getElementById('post_response').appendChild(frag); 

}; // end function showMessage



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

// AJAX for posting
function tag_voter() {
    console.log("in tag_voter trying to post!"); // sanity check
    console.log($('#post-text').val());

    if (debugJflag === true) {
        var url = 'http://127.0.0.1:8000/elections/tag_voter/';
        console.log(url);
    } 
    else {
        var url = 'http://catonalake.pythonanywhere.com/elections/tag_voter/';
        console.log(url);
        }

    var notes_desc = $('#post-text').val(),
        cid =  $('#post-ct-id').val(),
        cuser = $('#post-campaign-username').val(),
        vid = selected_voter_data[selected_voter_row].voter_id,
        //        vid = 28000764792, // replace later with the value from the row selected
        st = 'R'; // default to review
    console.log('voter_id being passed = ', vid);

    //var now = new Date(); // any reason why this didn't work??
    //now.format("MM/dd/yyyy hh:mm TT");

    var csrftoken = getCookie('csrftoken');
    //console.log('csrftoken = ', csrftoken);

    $.ajax({
        url : url, // the endpoint
        type : "POST", // http method
        dataType: "json",
        data : {'csrfmiddlewaretoken': csrftoken, 
                'notes_desc' : notes_desc,
                'voter_id': vid,
                'campaign_username': cuser,
                'ct_id': cid,
                'status': st,
                }, // data sent with the post request
        // handle a successful response
        success : function(json) {
            $('#post-text').val(''); // remove the value from the input
            //var message = ['Voter tag successful for voterid', voter_id, 'notes ', notes_desc];
            var message = [json.success, 'voter id: '+json.voter_id,   'notes: '+json.notes_desc,  'user: '+json.campaign_username];
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
            showMessage(message);
            //$('.formandresponse').hide;
            //$('.formandresponse').addClass('hidden');
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#placeholder2').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            //var message = ['Error processing voter tag', voter_id, 'notes ', notes_desc];
            var message = [json.failed, 'voter id: '+json.voter_id,   'notes: '+json.notes_desc,  'user: '+json.campaign_username];
            showMessage(message);
        }
    });


}; // end tag_voter



/* Formatting function for child row details - modify as you need */
function format_form ( voter_data ) {
    var d = voter_data; // cag20160406 added to see if we can resolve d undefined errors

    //alert("d.first_name = " + d.first_name);
    // `d` is the original data object for the row

    // cag20160328 - todo - read about a mozilla firefox hack
    // - to fix bootstrap issues https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content/17863685#17863685
    // 
    //return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+

    //var django_form = d.dform;
    // var child_html = django_form; ??
    var child_html = '<table class="table table-condensed info">'+
        '<tr>'+
            '<td>Voter: </td>'+
            '<td>'+ d.first_name+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Precinct: </td>'+
            '<td>'+ d.precinct+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Lawn sign:</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Mail Ballot:</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Donation:</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Follow Up:</td>'+
            '<td> Text box to enter follow up information? etc..?</td>'+
        '</tr>'+
    '</table>';

    // note may have to do a read to get some data first?? 
    //then, if no follow ups exist present this blank form?


    //var child_form = '<form id="tagForm" method="POST" action="/tag_voter/">' +
    // cag20160406 removing action for now....
    var child_form = '<table class="table table-condensed info selected">'+
        '<tr>'+
            '<td>Voter: </td>'+
            '<td>'+ d.name_and_age+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Precinct: </td>'+
            '<td>'+ d.precinct+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Senate: </td>'+
            '<td>'+ d.state_senate_district+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>House: </td>'+
            '<td>'+ d.state_rep_district+'</td>'+
        '</tr>'+
    '</table>';


    var form_1 = '<form id="tagFormchild" method="POST" action="">' +
                            '<input type="text" placeholder="Enter Notes" />'+ 
                            '<input type="submit" value="Tag Voter" />'+
                            '<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">'+
                          '</form>';
                      // cag20160328 todo - check out
                      //   - http://stackoverflow.com/questions/7604519/django-csrf-with-ajax
                      //   - http://stackoverflow.com/questions/21797731/dynamic-value-of-forms-in-one-template
                      //   -  http://stackoverflow.com/questions/501719/dynamically-adding-a-form-to-a-django-formset-with-ajax

    var form_2 = '<form method="POST" action="" id="tagFormchild">'+ '{{ csrf_token }}' +
                    '{{form|crispy}}'+
                    '<input type="submit" value="Tag Voter" />'+
                '</form>';



    return child_form;
    //return child_form+form_1;
    //return child_html;

}



function showPrettyDataOnList(parsedAddress) {
    // put a clear data button to start over

    // cag20160321 - updated to show voter list
    prettyTable = $('#voters').DataTable({
        responsive: true,
        responsive: {
            details: {
                type: 'column'
            }
        },
        bJQueryUI: true,
        //        buttons: ['copy', 'excel', 'pdf'],
        buttons: [
            {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [ ':visible' , 12]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [ ':visible' , 12]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [ ':visible' , 12] // export only visible items - and the precinct col
                }
            },
//            'colvis'  // this allows user to select which columns to view... // N/A as responsive = true and classes in html
        ],
        dom: 'Blfrtip',
        sPaginationType: "full_numbers",
        "deferRender": true,
        "aaData": parsedAddress.voter,  // array of objects in the household json object array 
        //"aaData": array_of_addresses,  // array of objects
          "columnDefs": [
//            { "visible": false, "targets": [0, 2, 4, 5, 7, 8, 11, 12, 13] },
            //{ "visible": false, "targets": [0, 6, 9] },
            { 'bSortable': false, 'targets': [0, 1, 6, 9, 10 ] },
            //{ 'iDataSort': 2, 'targets': [3] },
            { "targets": [3], "orderData": [0, 1, 2] }
          ],
        retrieve: true,
        paging: true,
        "aoColumns": [
            { "mData": "city"},             //0  hide
            { "mData": "street_name"},      //1  
            { "mData": "odd_even" },        //2  hide
            { "mData": "number_and_unit" }, //3 
            { "mData": "street_number" },   //4  hide
            { "mData": "unit" },            //5  hide
            { "mData": "name_and_age" },    //6
            { "mData": "first_name" },      //7  hide
            { "mData": "last_name" },       //8  hide
            { "mData": "current_party" },   //9  
            { "mData": "poll_pro" },        //10
            { "mData": "age" },             //11  hide
            { "mData": "precinct" },        //12  hide
            { "mData": "voter_id" },        //13  hide
            { "mData": "state_senate_district" },        //14  hide
            { "mData": "state_rep_district" },        //15  hide
        ]
    }); // end DataTables

    // to hide the first column: 
    //prettyTable.column( 0 ).visible( false )

    // cag20160327 - think about grouping data in the table
    // - see http://jquery-datatables-row-grouping.googlecode.com/svn/trunk/index.html
    // on some action prettyTable.sort()
    // cag20160327 - think about the drop downs under tables using this:
    // - http://www.datatables.net/examples/api/multi_filter_select.html

    //if ( $("#homes").hasClass("hidden")){ // this worked but changing a bit
    // if we've expanded the child rows.... do stuff
    if ( $("#voters").is(":hidden")){ 
        // think about using http://jqueryui.com/effect/
        // console.log('found and removing hidden class');
        // show the voters
        // show the buttons to add more streets and clear the teable
        $('#voters').removeClass('hidden');
        prettyTable
            .rows()
            .nodes()
            .to$()      // Convert to a jQuery object
            .addClass( 'voterdetails' );

        $('.showingvoters').removeClass('hidden'); // show the buttons on the page

        $('#tableid').toggle(1000); // transition the datatables up
        $('#tableid_length').toggle(1000); // transition the datatables up
        $('#tableid_filter').toggle(1000); // transition the datatables up
        $('#tableid_paginate').toggle(1000); // transition the datatables up
        $( "#tableid_info" ).toggle(1000);
        }
    else {
        // console.log('not hidden - adding more rows');
        prettyTable
            .rows.add(parsedAddress.voter)
            .draw()
            .nodes()
            .to$()
            .addClass('voterdetails'); // cag
        $('#tableid').toggle(1000); // transition the datatables up
        $('#tableid_length').toggle(1000); // transition the datatables up
        $('#tableid_filter').toggle(1000); // transition the datatables up
        $('#tableid_paginate').toggle(1000); // transition the datatables up
        $( "#tableid_info" ).toggle(1000);
        $('#displaylistbutton').toggle(1000); // should show this now... 
        }


    // cag20160328 - this was working but going to see if we can do this differently
    //prettyTable
    //    .rows()
    //    .nodes()
    //    .to$()
    //    .on('click', function() {
    //        alert('going to pop a window up to select something and save...');
    //        console.log('some information in a cell??');
    //    }); // end voterdetails click


    prettytable = $('#voters').dataTable(); // needed to perform certain functions...

    // cag20160408 - moving to document ready..... 



    // combine name and age
    // combine street number and unit
    prettyTable.rows().every( function() {
        var d = this.data();
        d.name_and_age = d.first_name + " " + d.last_name + " (" + d.age + ")";
        // cag20160406 added to reduce size of columns
        if (d.unit != '') {
            d.number_and_unit = d.street_number + " / " + d.unit; 
        } else {
            d.number_and_unit = d.street_number;
        }
        this.invalidate(); 
        })
        .draw(); // end rows processing

    // check for the boolean/ tinyint value 
    // representing a client how has voted in all of the last three elections
    // noted in column 8
    var voter_poll_pro = prettyTable
                .column(10)
                .data();
    $.each(voter_poll_pro, function (i, v) {
        // Replace with poll pro
        //console.log(' processing each voter poll pro i =  '+i+' and v = ' + v);
        if (v === 1) {
            //alert('v is one');
            //prettyTable.fnUpdate("polling pro", );
            prettytable.fnUpdate( 'Polling Pro', i, 10);
        } else {            
            prettytable.fnUpdate( ' ', i, 10);
        }
    });

    //voter_poll_pro.splice(,1,"polling pro");

  
//    $('#tagForm').submit(function(){
//       var action = $(this).attr('action');
//       var that = $(this);
//       $.ajax({
//           url: action,
//           type: 'POST',
//           data: that.serialize()
//           ,success: function(data){
//               console.log('Success!');
//           }
//       });
//       return false;
//   });



    $('#tagForm').on('submit', function(event){
        console.log("form submitted!")  // sanity check
        event.preventDefault();
        // cag20160407 - todo: get the item that was selected
        // use jquery to identify which items are selected?
        tag_voter();
        }); // end tagForm submit event and function


    // testing the child row of the form... 
    $('#tagFormchild').on('submit', function(event){
        console.log("form submitted!")  // sanity check
        event.preventDefault();
        // cag20160407 - todo: get the item that was selected
        // use jquery to identify which items are selected?
        tag_voter();
        }); // end tagForm submit event and function


}; // end showPrettyDataOnList function

function getData(address_data, rowId, urlparm) {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred(); // think about introducing this..
    console.log('Called getData!');

    //console.log('in getData 100 - set csrftoken = ', csrftoken);
    var map_address_data_json = {}; //use this to create a json request with an array of homes   
    var voter_address_data_json = {}; //use this to create a json request with an array of homes   
    // cag20160403 commenting out test
    if (debugJflag === true) {
        var url = 'http://127.0.0.1:8000/elections/' + urlparm;

    } 
    else {
        var url = 'http://catonalake.pythonanywhere.com/elections/' + urlparm;
        }

    //        url: 'http://127.0.0.1:8000/elections/homesonstreet/', for city
    //        update for district stuff...  
    //eventuallly change this so we only pull in the homes that don't have a lat and lng
    // ajax call to get homes to plot on the map 
    $.ajax({
        url: url,
        type: 'GET',
        async: true,
        data: address_data,
        dataType: 'json',
        success: function (json) {
            var houseHolds = '';
            var obj = jQuery.parseJSON(json);
            //alert(json);
            var address_array = []; //this will be a list of households in json
            //alert('in getData - 225  - address_data.street_name = ' + address_data.street_name)
            var mappromises = [];
            $.each(obj, function (i, v) {
                //var voterAge = obj[i]...... consider logic for voter ages?
                var d1 = new $.Deferred();
                var voter_array = [];
                houseHolds =  obj[i].fields.street_number + " " + obj[i].pk;
                // for debug 
                //console.log('houseHolds street number and vstat is  = ' + houseHolds);
                var specific_address_data = {
                    'vstat_id': obj[i].pk, // the pk is vstat_id
                    'city': obj[i].fields.city, // change this to postal city when we move to fullvs
                    'street_name': obj[i].fields.street_name,
                    'street_number': obj[i].fields.street_number,
                    'state_rep_district': obj[i].fields.state_rep_district,
                    'state_senate_district': obj[i].fields.state_senate_district,
                    'precinct': obj[i].fields.precinct,
                    //cag20160325 added rep district, senate district
                    //    precinct, other details?? - but dont display unless ... 
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
                        //console.log(' in deferredmap.done - how should we post lat and lng = '+ 
                        //    latlng.lat+ " "+ latlng.lng +
                        //    " for house  " + specific_address_data.street_number +  
                        //    " "+specific_address_data.street_name
                        //    + " " + specific_address_data.vstat_id);
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
            map_address_data_json['household'] = address_array; //set the array of homes processed above
            var test_address = 'in getData 260 - homes on street ';
            for (var i = 0; i < map_address_data_json.household.length; i++) { //loop through the array and log the voters
                    test_address = test_address + "\n" + 
                        map_address_data_json.household[i].vstat_id + " " +
                        //map_address_data_json.household[i].street_number + " " + 
                        //cag20160326 - removed above given strategy for fullvs is course grained at the street level
                        // but this breaks the mapping process....  what to do.....??? 
                        map_address_data_json.household[i].street_name + " " +
                        map_address_data_json.household[i].city + " " +
                        //map_address_data_json.household[i].unit + " " +
                        map_address_data_json.household[i].rvoters + " " +
                        map_address_data_json.household[i].uvoters + " " +
                        map_address_data_json.household[i].mvoters + " " +
                        map_address_data_json.household[i].dvoters + " lat" +
                        map_address_data_json.household[i].lat + " lng" +
                        map_address_data_json.household[i].lng;
                  }; // end for loop
            //console.log(test_address);  // cag20160326 for debug only

        }, // end success
        failure: function (json) {
            alert('Error in getData 400 - failed promise ');
            reject(Error(statusText));
            } // end failure
    }); //end ajax

    if (debugJflag === true) { 
        var url = 'http://127.0.0.1:8000/elections/homesindistrictwithnames/';
    }
    else {
        var url = 'http://catonalake.pythonanywhere.com/elections/homesindistrictwithnames/';
    }
    var promise = new Promise(function(resolve, reject) {

        //cag20160407 todo: see if we can move the map voters stuff here...

        $.ajax({
            // cag20160403 commented out test
            url: url,
            type: 'GET',
            async: true,
            data: address_data,
            dataType: 'json',
            success: function (json) {
                //alert('in getNamesWithDistrictData - 200 - ', json);
                //alert(address_data); - this shows up as an object
                var houseHolds = '';
                var obj = jQuery.parseJSON(json);
                //traverse(obj, alert);  // ok for debugging but just alerts each node, not each value...

                var address_array = []; //this will be a list of households in json

                //alert('in getNamesWithDistrictData - 225  - address_data.street_name = ' + address_data.street_name)
                var mappromises = [];
                // for each voter object found in the database...
                $.each(obj, function (i, v) {
                    //var voterAge = obj[i]...... consider logic for voter ages?
                    var d1 = new $.Deferred();
                    var voter_array = [];
                    houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                    //cag20160321 todo - this assumes the list is sorted which it is not
                    //cag20160325 - added order by in view
                    // - process the sorted list (sorted by street name and unit)  then assign the odd_even stuff
                    if (obj[i].fields.street_number % 2 === 0) {
                        //console.log('found an even street number ' + obj[i].fields.street_number);
                        var odd_even = (eCtr+=1);
                    } else {var odd_even = (oCtr-=1);};

                    var poll_pro = (obj[i].fields.swg2014 & obj[i].fields.swp2014 &  obj[i].fields.pe2012); 
                    //console.log('poll pro is '+ poll_pro);

                    var specific_address_data = {
                        'voter_id': obj[i].pk,
                        'vstat_id': obj[i].fields.vstat_id,
                        'city': obj[i].fields.city, // change this to postal city when we move to fullvs
                        'street_name': obj[i].fields.street_name,
                        'street_number': obj[i].fields.street_number,
                        'unit': obj[i].fields.unit,
                        'first_name': obj[i].fields.first_name,
                        'last_name': obj[i].fields.last_name,
                        'current_party': obj[i].fields.current_party,
                        'odd_even': odd_even,
                        'poll_pro': poll_pro,
                        'age': obj[i].fields.age,
                        'precinct':  obj[i].fields.precinct,
                        'state_senate_district':  obj[i].fields.state_senate_district,
                        'state_rep_district':  obj[i].fields.state_rep_district,
                        'name_and_age': "",
                        'number_and_unit': ""
                    };
                    //maybe do another promise here?  a deferred for this??
                    //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                    // for debugging //console.log('poll pro is '+ specific_address_data.poll_pro);
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

                }); // end loop for each voter 

                console.log('in getdata name ajax call - length of address_array = ' + address_array.length);
                voter_address_data_json['voter'] = address_array; //set the array of voters processed above

                if (debugJflag) {
                    var test_address = 'voters found on selected street ';
                    for (var i = 0; i < voter_address_data_json.voter.length; i++) { //loop through the array and log the voters
                            test_address = test_address + "\n" + 
                                voter_address_data_json.voter[i].vstat_id + " " +
                                voter_address_data_json.voter[i].street_number + " " +
                                voter_address_data_json.voter[i].street_name + " " +
                                voter_address_data_json.voter[i].city + " " +
                                voter_address_data_json.voter[i].unit + " " +
                                voter_address_data_json.voter[i].first_name + " " +
                                voter_address_data_json.voter[i].last_name+ " party = " +
                                voter_address_data_json.voter[i].current_party + "  age = " +
                                voter_address_data_json.voter[i].age + " " +
                                voter_address_data_json.voter[i].precinct + " " +
                                voter_address_data_json.voter[i].poll_pro;  // cag20160327 added
                    }; // end for loop
                    console.log(test_address); 
                }

                //alert("in getdata in promise ");
                resolve (voter_address_data_json);

            }, // end success
            failure: function (json) {
                alert('in getdata - getting names ajax call failed ');
                reject(Error(statusText));
            } // end failure

        }); //end ajax
        }); //end promise

    promise.then(
        function(voter_address_data_json) {
            console.log('in getData 500 - Got data! Promise fulfilled.');

            // showDataOnList(voter_address_data_json); // UL on page - commented  out 
            showPrettyDataOnList(voter_address_data_json); // adding to populate datatable

            var showingStreetList = "<br> <br>" + "Showing a list of households on " + address_data.street_name + " in the town of " + address_data.city + " </br>  </br> " ;
            // change this paragraph to present the other critera...  like house or senate district 
            console.log('in getData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);

            document.getElementById('testpara').innerHTML = showingStreetList;

            // good reference for datatables: http://live.datatables.net/irudow/48/edit#preview
            // checkbox on first column: http://www.kvcodes.com/2014/12/add-checkbox-first-column-jquery-datatable/

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
}; //end getData function

$(document).ready(function() {
    parentWindow = $(this.document); //not sure how to use this??

    // parentWindow.console.log('logging the parent window :) '); // this doesnt work

    // this is in electablevstatsdatatable2.html
    var mainTable = $("#tableid").DataTable({
        responsive: true,
        bJQueryUI: true,
        // select: true,  // cag20160406 - do we want to use this?
// no export for this table.. 
//        buttons: ['copy', 'excel', 'pdf'],
//        dom: 'Bfrtip',
        sPaginationType: "full_numbers",
        "deferRender": true,
        "aoColumnDefs": [
            //{ 'bSortable': false, 'aTargets': [0 , 1] } // removed since i took out the city search text box
            ]
    });





    //new $.fn.dataTable.Buttons( mainTable, {
    //    buttons: [
    //        'copy', 'excel', 'pdf'
    //    ]
    //} );




    //var citytable = $('#tableid').DataTable();

    //$("#citysearch").on('keyup', function() {
    //    citytable.columns(0).search($(this).val()).draw();
    //});    




    //excellent jsfiddle for this: http://jsfiddle.net/xdhgn55q/
    // another jsfiddle for column widthe: http://jsfiddle.net/Lijo/JN8Pm/10/
    //var table = $('#detailContentPlaceholder_grdTransactions'),
    //    trs = table.find('tr'),
    //    headTr = table.find('.second'),
    //    empHeader = $($(headTr).children('th')[3]);


}); 




// this is set in the html for electablevstatsdatatabel2 
//  - so user can add more streets
$('#displaylistbutton').on('click', function () {
    $('#displaylistbutton').slideUp("slow"); // hide the button

    $('#tableid').slideDown("slow"); // transition the datatables up
    $('#tableid_length').slideDown("slow"); // transition the datatables up
    $('#tableid_filter').slideDown("slow"); // transition the datatables up
    $('#tableid_paginate').slideDown("slow"); // transition the datatables up
    $( "#tableid_info" ).slideDown("slow"); 
}); // end cleartable click event


$('#cleartable').on('click', function () {
    $('#tableid > tr').remove(); // remove the data from displaying on the table
    // cag20160325 todo - 
    // - clear voters table
    // - remove the info class from the rows on the tableid
    var clearvoters = $('#voters').DataTable();
    var rows = clearvoters
               .rows()
               .remove()
               .draw()
    $('.voterrowclass').removeClass('info selected'); // cag20160325 so we reset rows that are no longer shwowing on our list
    $('.formandresponse').hide; // remove the form since we won't have any data on the table
    $('.formandresponse').addClass('hidden'); // remove the form since we won't have any data on the table
}); // end displaylistbutton click event




// cag20160325 - this is being called from 
$('.voterrowclass').on('click', function () {

    console.log('in voterrowclass on click');
    if ($(this).hasClass('selected')) {
        alert('Scroll down to see voters on selected street.');
    } else {

        $(this).addClass('selected'); // cag20160321 so we know what rows are shwowing on our list

        // get the variables in the data fields in the html
        var cityName = $(this).attr('data-city');
        var streetName = $(this).attr('data-street-name');
        var requestController = $(this).attr('data-request-controller');
        var vstat_id = $(this).attr('data-vstat-id');
        var rowId = $(this).attr('data-rowid');
        //alert(rowId);
        var repDistrict = $(this).attr('data-state-rep-district');
        var senateDistrict = $(this).attr('data-state-senate-district');
        var precinct = $(this).attr('data-precinct');
        var congressionalDistrict = $(this).attr('data-congressional-district');


        //alert('vstat_id = ' + vstat_id);
        //alert('requestController - ' + requestController);

        // set controller values
        var controllerValues = {'city': getData, 'housedistricts': getData, 'senatedistricts': getData};
        //var controllerValues = {'city': getData, 'housedistricts': getDistrictData, 'senatedistricts': getDistrictData};
        var controllerUrls = {'city': 'homesonstreet', 'housedistricts': 'homesonstreet', 'senatedistricts': 'homesonstreet'};

        address_data = {
            city: cityName,
            street_name: streetName,
            state_rep_district: repDistrict,
            state_senate_district: senateDistrict,
            congressional_district: congressionalDistrict,
            precinct: precinct,
            request_controller: requestController,
            vstat_id: vstat_id // added cat20160325
        };

        var address_data_json = controllerValues[requestController](address_data, $(this), controllerUrls[requestController]); 
        // cag20160325 - changed to always call getdata now that we have all the right information...???
    }; // end else
}); // end voterrowclass on click


// cag20160408 moved from showprettydata 
$('#voters tbody').on('click', 'tr', function() {
//$('.voterdetails').on('click', function() {

    var this_tr = prettyTable.row(this).index(); // get the row index
    var this_row = prettyTable.row(this_tr); // get the row that was clicked

    if ( this_row.child.isShown() ) {
        // This row is already open - close it
        this_row.child.hide();
        prettyTable
            .row(this_tr)
            .nodes()
            .to$()      // Convert to a jQuery object
            .removeClass( 'shown selected highlight' );

        $('.formandresponse').hide; 
        $('.formandresponse').addClass('hidden');
        selected_voter_row = selected_voter_data = null; // no selected voters now!
        }
        else { // the item selected was not already showing the child so...
            if (selected_voter_row !== null) { // hide any row that was shown
                var prev_tr = selected_voter_row; // get the row index
                var prev_row = prettyTable.row(prev_tr); // get the row that was clicked
                prev_row.child.hide();
                prettyTable
                    .row(prev_tr)
                    .nodes()
                    .to$()      // Convert to a jQuery object
                    .removeClass( 'shown selected highlight' );
                selected_voter_row = ''; // clear the selected voters
            } // end if another voter was selected
            selected_voter_row = this_tr; // save the tr for the selected voters

            if ( $(".formandresponse").is(":hidden")){ 
                $('.formandresponse').removeClass('hidden');
            }

            selected_voter_data = this_row.nodes().data(); // get the data for the row
                // Open this row for the newly selected voter
            this_row
                .child( format_form( selected_voter_data[selected_voter_row] ) )
                .show();
            prettyTable
                .row(selected_voter_row)
                .nodes()
                .to$()      // Convert to a jQuery object
                .addClass( 'shown selected highlight' );

            //row.nodes().to$.addClass('shown'); // this didn't quite work
        } // end else for new child to show
    } );  // end on click of tbody for voters table

