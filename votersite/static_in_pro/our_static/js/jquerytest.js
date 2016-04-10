

$(document).ready(
   function () {


       $('.voterrowclass').on('click', function () {
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

           $('#' + rowId).addClass('warning'); // this isn't working?
           $('#' + rowId + ' .namesandaddress').html(sts); // this isn't working?

           address_data = {
               city: cityName,
               street_number: streetNumber,
               street_name: streetName,
               unit: unitNumber
           };

           NeedVoters(address_data, $(this));

       });

       $('.voterheadingclass').on('click', function () {
           sts = "Click any address below to view the voters at the address - Keep up the great work!!!"
           stattoshow = sts;
           alert(stattoshow);
       });

       $('.voterrowclass').on('mouseover', function () {
           $(this).addClass('success');
       });

       $('.voterrowclass').on('mouseleave', function () {
           $(this).removeClass('success');
       });

   }

 );
