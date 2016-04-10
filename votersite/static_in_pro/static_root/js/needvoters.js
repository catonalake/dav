

function NeedVoters(specific_address_data, row_object) {

    console.log('Called NeedVoters! in needvoters.js');

    var csrftoken = getCookie('csrftoken');
    console.log('set csrftoken = ', csrftoken);


    $.ajax({
        url: 'http://127.0.0.1:8000/elections/votersataddress/',
        type: 'GET',
        async: true,
        data: specific_address_data,
        dataType: 'json',
        success: function (json) {
            //alert('successful');
            //alert(json);
            //alert(specific_address_data); - this shows up as an object
            var nameVar = '';
            var voter_obj = jQuery.parseJSON(json);
            var voter_array = [];
            //specific_address_data['voter'] = []; //set up for the list of voters we will push onto the result

            //alert('about to alert adddress_data.street_name')
            //alert(specific_address_data.street_name)

            // each voter_obj contains voters found for the specific address
            $.each(voter_obj, function (i, v) {
                nameVar = nameVar + "\n " + voter_obj[i].fields.first_name + " " + voter_obj[i].fields.last_name + " " + voter_obj[i].fields.current_party;
                var voter_at_specific_address_data = {
                    'first_name': voter_obj[i].fields.first_name,
                    'last_name': voter_obj[i].fields.last_name,
                    'current_party': voter_obj[i].fields.current_party
                };
                voter_array.push(voter_at_specific_address_data);
            });

            if (voter_array != undefined) {
                specific_address_data['voter'] = voter_array; 
            };

            // figure out how to loop through a list that is in a json object
            //http://stackoverflow.com/questions/800593/loop-through-json-object-list

            var test_voter = 'in needvoters.js - voter names at address ' +
                specific_address_data.street_number + " " +
                specific_address_data.street_name + " " +
                specific_address_data.city + " " +
                specific_address_data.unit;

            //console.log('in needvoters - specific_address_data.voter.length = ' + specific_address_data.voter.length); // can't do this since there may not be a voter at the address

            if ("voter" in specific_address_data) {
                for (var i = 0; i < specific_address_data.voter.length; i++) {
                    test_voter = test_voter + "\n " + specific_address_data.voter[i].first_name +
                        " " + specific_address_data.voter[i].last_name +
                        " " + specific_address_data.voter[i].current_party;
                };
            }
            else {
                test_voter = test_voter + "DO NOT EXIST";
            };

            console.log(test_voter);
            //alert(test_voter);
            for (var ctr = 0; ctr < voter_array.length; ctr++) {
                console.log(' in needvoters - voter_array[' + ctr + '] = ' + voter_array[ctr].first_name + ' ' + voter_array[ctr].last_name + ' ' + voter_array[ctr].current_party);
            };

            //return voter_array; // 20160227cag return array and set in needhomes

            var voter_json = {};
            voter_json['voter'] = voter_array;
            return voter_json; // 20160227cag return array and set in needhomes

            //row_object('#voternames').html(json.first_name);
            //$('#voternames').html('some text to display'); // this worked when i had this item on the first column, but how do i get it to display on the correct cell?
            // just to compare from jstest...  $("#jqtesting").show(5000).html("JQuery installed successfully!");

            //row_object.removeClass('info');  // may want to tweak how the classes work to avoid confusion...   this was removing the info class too soon....

        },
        failure: function (json) {
            alert('got an error homie');
        }

    });

}

