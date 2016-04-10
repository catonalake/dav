
$(document).ready(function () {


    var address_data = {
        city: 'GLOCESTER',
        street_name: 'ALDRICH RD',
    };
    var aoData = {
        city: 'GLOCESTER',
        street_name: 'ALDRICH RD',
    };

    $('#ajaxtableid').dataTable({
        "bServerSide": true,
        "sAjaxSource": $(this).data('data-url'),
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
        //"fnServerData": function ( sSource, address_data, fnCallback, oSettings ) {
                oSettings.jqXHR = $.ajax({
                "dataType": 'json', 
                "type": "GET", 
                "url": 'http://127.0.0.1:8000/elections/homesonstreet/',
                //"url": sSource,
                "data": aoData,
                //"data": address_data,
                "success": fnCallback
            } );
        },
        "bProcessing": true,
        sPaginationType: "full_numbers",
        bJQueryUI: true
    });
    // replacing below with above 
    //$("#ajaxtableid").dataTable({
    //    bJQueryUI: true,
    //    sPaginationType: "full_numbers",
    //    //"fnDrawCallback": function () {
    //    //    alert('DataTables has redrawn the table'); # or do something else when the table is loaded...?
    //    //}
    //});


});



//$('.voterrowclass').on('click', function () {

//    var cityName = $(this).attr('data-city');
//    var streetName = $(this).attr('data-street_name');

//    rowId = $(this).attr('data-rowid');
//    //alert(rowId);

//    address_data = {
//        city: $(this).attr('data-city'),
//        street_name: $(this).attr('data-street_name'),
//    };

//    NeedHouseholds(address_data, $(this));

//});
