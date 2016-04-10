// some global variables? 
var myWindow = false; // used for the pop up with homes

// view https://editor.datatables.net/examples/advanced/deepObjects.html
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
              parsedAddress.household[i].unit + " " ;
              // for loop to go through parsedAddress.household[i].voter array ? 
              // instead could this be populated with  datatables??
              // ....or....  put a promise here to look up the voter information for the specific address
              // and promise.then( would include the appendchild below?? )
          frag.appendChild(el);
        }
        document.getElementById('list').appendChild(frag);
        // take above code and put into
};

function getData() {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred();
    console.log('Called getData!');

    var csrftoken = getCookie('csrftoken');
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
            //alert('successful');
            //alert('in getData - 200 - ', json);
            //alert(address_data); - this shows up as an object
            var houseHolds = '';
            var obj = jQuery.parseJSON(json);
            var address_array = []; //this will be a list of households in json

            //alert('in getData - 225  - address_data.street_name = ' + address_data.street_name)

            // for each address object found in the database...
            $.each(obj, function (i, v) {
                //var voterAge = obj[i]...... consider logic for voter ages?
                var voter_array = [];
                houseHolds = houseHolds + "\n " + obj[i].fields.street_number + " " + obj[i].fields.unit;

                var specific_address_data = {
                    'city': obj[i].fields.city,
                    'street_name': obj[i].fields.street_name,
                    'street_number': obj[i].fields.street_number,
                    'unit': obj[i].fields.unit
                };
                //maybe do another promise here?
                //voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there

            }); // end loop for each address 

            console.log('in getData 250 - length of address_array = ' + address_array.length);
            address_data_json['household'] = address_array; //set the array of homes processed above
            var test_address = 'in getData 260 - homes on street ';
            for (var i = 0; i < address_data_json.household.length; i++) { //loop through the array and log the voters
                    test_address = test_address + "\n" + 
                    address_data_json.household[i].street_number + " " +
                    address_data_json.household[i].street_name + " " +
                    address_data_json.household[i].city + " " +
                    address_data_json.household[i].unit;
            }; // end for loop
            console.log(test_address); 

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


            //openWindowWithData(address_data_json);  //todo: delete the function above too

            // what is this???
            //newWindow.onload = function(){
            //   alert(' did a window open? ');
            //   console.log('can we put stuff in this dom??');
            //   // do something 
            //}

            console.log('in getData 500 - Got data! Promise fulfilled.');
            console.log('in getData 510 - think about putting the get voter data call here?');
            // alert(address_data_json); //alerted object
            //var parsedAddress = jQuery.parseJSON(address_data_json); // don't need to parse - already json!

            var showingStreetList = "<br> <br>" + "Showing a list of households on " + address_data.street_name + " in the town of " + address_data.city + " </br>  </br> " ;
            console.log('in getData 515 - showingStreetList = ' + showingStreetList);
            //alert(" showingStreetList = " + showingStreetList);
            myWindow.document.getElementById('testpara').innerHTML = showingStreetList;

 
            //showDataOnList(address_data_json); // eventually comment this out
            //Delete the datable object first
            //var myTable;
            //if(myTable != null) myTable.fnDestroy();
            //Remove all the DOM elements
            
            //$('#homes').empty();
            //what is the difference between             $('#homes').dataTable
            // and             $('#homes').DataTable
            //????

            console.log('in my new window???  :)  ');
            //$myWindow.getElementById('#homes2').dataTable( {
            myWindow.$('#homes').dataTable( {
                bJQueryUI: true,
                sPaginationType: "full_numbers",
                "aaData": address_data_json.household,  // array of objects in the household json object array 
                //"aaData": array_of_addresses,  // array of objects
                retrieve: true,
                paging: true,
                columns: [ // these didn't really work but leaving for now and changed th in html
                        { title: "Street Number" },
                        { title: "Street" },
                        { title: "City" },
                        { title: "Unit" }
                                    ],
                "aoColumns": [
                    { "mData": "street_number" }, // <-- which values to use inside object
                    { "mData": "street_name" },
                    { "mData": "city" },
                    { "mData": "unit" }
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
    var streetName = $(this).attr('data-street_name');

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
        street_name: $(this).attr('data-street_name'),
    };


    var url = 'http://127.0.0.1:8000/elections/selectedstreet/';
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
        myWindow.document.getElementById('baseWindowOpenHeading').innerHTML="Street View";
        myWindow.document.getElementById('para').innerHTML=" ";
    
    if (myWindow.Promise) {
        myWindow.console.log('Promise found in new window');
        var address_data_json = getData(address_data, $(this)); // maybe make this the promise statement?????
    } else {
        console.log('Promise not available');
    }
    }); // moved this from after window open..  

    //if (window.Promise) {
    //    console.log('Promise found in main window');
    //    var address_data_json = getData(address_data, $(this)); // maybe make this the promise statement?????
    //} else {
    //    console.log('Promise not available');
    //}

    // maybe get this working to put information on the datatable?   
    console.log('in jstestdt on click after var address_data_json is set to getData');


});
