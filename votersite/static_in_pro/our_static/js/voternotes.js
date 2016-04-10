// some global variables 
var parentWindow; // used to capture the parent window 
var debugJflag = true;

function showMessage(message) {

    var begin_ul = '<ul class="list-group">'
    var end_ul = '</ul>'
    var begin_li = '<li class="list-group-item list-group-item-success">'
    var end_li = '</li>'
    var message_len = message.length;
    var html_to_insert = begin_ul;
    for (var i = 0, el; i < message_len; i++) {
        html_to_insert = html_to_insert + begin_li + 
          message[i] + end_li;
    }
    html_to_insert = html_to_insert + end_ul; 
    return html_to_insert;

}; // end function showMessage

function displayVoterData(note_data) {
    //create the jQuery Deferred object that will be used
    // not sure we are going to use deferred?
    //var deferredObj = $.Deferred(); // think about introducing this..
    //console.log('Called getVoterData!');
    //console.log('next steps - look up voter id '+ note_data.voter_id + " and allow update of voter note "+note_data.vn_id);

}; //end getVoterData function

$(document).ready(function() {
    parentWindow = $(this.document); //not sure how to use this??

    // parentWindow.console.log('logging the parent window :) '); // this doesnt work

    // this is in electablevstatsdatatable2.html
    var mainTable = $("#notetableid").DataTable({
        "order": [[ 0, "desc" ]],
        responsive: true,
        bJQueryUI: true,
        select: true,  // how to use this?
        sPaginationType: "full_numbers",
        "deferRender": true,
        "aoColumnDefs": [
            //{ 'bSortable': false, 'aTargets': [0 , 1] } // removed since i took out the city search text box
            ]
    });
}); 

// cag20160325 - this is being called from 
$('.noterowclass').on('click', function () {

    //console.log('in noterowclass on click');

    // get the variables in the data fields in the html
    var voter_id = '' + $(this).attr('data-voter-id'); // to look up the voter on fulldav
    var rowId = $(this).attr('data-rowid'); // this is the vn_id for an item to be updated
    //console.log('voter id from the table row = ', voter_id);
    //console.log('the voter note clicked = ', rowId);

    var voter_note_data = {
        'voter_id': voter_id,
        'vn_id': rowId,
    };

    displayVoterData(voter_note_data); 

    if (debugJflag === true) {
        var url = 'http://127.0.0.1:8000/elections/detailjson';

    } 
    else {
        var url = 'http://catonalake.pythonanywhere.com/elections/detailjson';
        }

    $.ajax({
        url: url,
        type: 'GET',
        async: true,
        data: voter_note_data,
        dataType: 'json',
        success: function (json) {
            //alert(json.first_name + " " +json.last_name);
            var voterToShow =  [json.first_name + " " +json.last_name,
                                json.street_number+" "+ json.unit +" "+json.street_name + " " + json.city 
            ];

            //console.log(json); // log the returned json to the console
            //console.log("success"); // another sanity check
            //$('#post_context').val(showMessage(message));
            //document.getElementById('post_context').appendChild(showMessage(message)); 
            document.getElementById('testpara').innerHTML = showMessage(voterToShow);
        }, // end success
        failure: function (xhr,errmsg,err) {
            //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            } // end failure
    }); //end ajax


}); // end voterrowclass on click




