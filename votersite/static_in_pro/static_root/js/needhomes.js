// this function takes a city and street and returns all the homes and units on the street 
// called from jstestdt.js
// address_data is a json object created using the city and street information presented on the page 
// 
function NeedHouseholds(address_data, row_object) {

    console.log('Called NeedHouseholds!');

    var csrftoken = getCookie('csrftoken');
    console.log('set csrftoken = ', csrftoken);

    //console.log(address_data);

    $.ajax({
        url: 'http://127.0.0.1:8000/elections/homesonstreet/',
        type: 'GET',
        async: true,
        data: address_data,
        dataType: 'json',
        success: function (json) {
            //alert('successful');
            alert('in needhouseholds - 320 - ', json);
            //alert(address_data); - this shows up as an object
            var houseHolds = '';
            var obj = jQuery.parseJSON(json);
            var address_array = []; //this will be a list of households in json

            //alert('in needhouseholds - 325 - address_data.street_name = ' + address_data.street_name)

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
                //specific_address_data['voters'] = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters
                voter_array = NeedVoters(specific_address_data, row_object); // 20160227cag return array of voters - note that it could be undefined if there are no voters
                // above may return undefined - be sure the calling program tests for that

                // below code is not working - undefined array???
                //for (var ctr = 0; ctr < voter_array.length; ctr++) {
                //    console.log(' after Needvoters - voter_array['+ ctr+'] = ' + voter_array[ctr]);
                //};

                if (voter_array === undefined) {
                    console.log("in needhomes.js -  no voters found at address " + specific_address_data.street_number + " " + specific_address_data.street_name +
                        " " + specific_address_data.city + " " + specific_address_data.unit);
                    //specific_address_data['voter'] = [{ 'first_name': 'no voter at address', 'last_name': 'no voter at address', 'current_party': 'no voter at address'}];
                }
                else {
                    specific_address_data['voter'] = voter_array.voter;
                    address_array.push(specific_address_data); // add the address to the array of addresses only if there are voters there
                };


                //alert('in needhomes about to alert address_data');
                //alert(address_data); //displays an object - need to loop through at the end
            }); // end loop for each address 

            if (address_data != undefined) {
                address_data['household'] = address_array; //set the array of homes processed above
                for (var i = 0; i < address_data.household.length; i++) { //loop through the array and log the voters
                    var test_voter = 'in needhomes.js - voter names at address ' +
                        address_data.household[i].street_number + " " +
                        address_data.household[i].street_name + " " +
                        address_data.household[i].city + " " +
                        address_data.household[i].unit;
                    for (var j = 0; j < address_data.household[i].voter.length; j++) { // length here isn't working... 
                        test_voter = test_voter + "\n " +
                            address_data.household[i].voter[j].first_name +
                            " " + address_data.household[i].voter[j].last_name +
                            " " + address_data.household[i].voter[j].current_party;
                    }
                };
                console.log(test_voter); // why is this undefined for 99 aldrich rd ??
            };
            //address_data.household['voter'] = voter_array; this is wrong


            //CONSIDER: if debug for this type of stuff??? then shut that off for production :)
            //alert('in needhouseholds - about to traverse 333');
            //traverse(address_data, alert);  // ok for debugging but just alerts each node, not each value...


            alert("in needhouseholds - 330 - Households: \n " + houseHolds + " \n \n on :  \n" + address_data.street_name + " " + address_data.city + " ");
            //CONSIDER - loop through address_data here?

            //alert('about to alert obj[0].fields.first_name ');
            //alert(obj[0].fields.first_name);

            return address_data;
        },
        failure: function (json) {
            alert('got an error homie');
        }

    });

}
