var a = 'Hello World!';

function b() {
    console.log('Called b!');

}

function changeButton() {
    document.getElementById("firsth1").innerHTML = "Heading changed";
    document.getElementById("mybutton").innerHTML = "button changed";
    console.log('Called changeButton!');
}

function jqtest() {
    console.log('yay!! ....  Called jqtest!');
    document.getElementById("jqtesting").innerHTML = "changed the content";
}

$(document).ready(
   function () {

       $tableHeadingInContext = $('#electable #voterheading');
       $tableRowInContext = $('#electable #voterrowid');
       $tableRowInContext.on('click', function () {

           var rvotersInt = parseInt($(this).attr('data-rvoters'),10) || 0;
           var uvotersInt = parseInt($(this).attr('data-uvoters'),10) || 0;

           //console.log('rvoters ', rvotersInt);
           //console.log('uvoters ', uvotersInt);


           // use this to print pages!!  how easy is this? 
           //print('total r and u voters ' + totalRandUVoters);

           var totalRandUVoters = rvotersInt + uvotersInt;
           console.log('total r and u voters ' + totalRandUVoters);

           var sts = "Total Republican and Unaffiliated Voters: ";

           sts = sts + " " + $(this).attr('data-street_name') + " " +
               $(this).attr('data-city') + " " + totalRandUVoters;
           alert(sts);

       });


       $tableHeadingInContext.on('click', function () {
           sts = "You are doing a Great JOB!!!"
           stattoshow = sts;
           alert(stattoshow);
       });

       $tableRowInContext.on('mouseover', function () {
           $(this).addClass('success');
       });

       $tableRowInContext.on('mouseleave', function () {
           $(this).removeClass('success');
       });


       $("#jqtesting").hide(5000).show(1000);
       $("#jqtesting").show(5000).html("JQuery installed successfully!");

   }
 
 );
