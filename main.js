$(document).ready(function(){



    /**************************************************************************************/
    // INITIALIZATION 
    /**************************************************************************************/

    /*
    *      APPEND WEAPON TYPES <select> OPTIONS WITH JSON OBJECTS
    */

    $.getJSON("config/WeaponTypes.json", function(data){
      $.each(data, function(index, element) {
        $('#wType').append($('<option>', { 
          value: index,
          text : element.name 
        }));
      });
    });


    /*
    *      APPEND WEAPON SKINS <select> OPTIONS WITH JSON OBJECTS
    *      ACCORDING TO THE SELECTED WEAPON TYPE
    */

    function reloadSkins() {
        $('#wId').empty(); // REMOVE ALL IDS FROM <select> OPTIONS

        $.getJSON("config/WeaponSkins.json", function(data){
        let selected = $( "#wType" ).val();
        $.each(data, function(index, element) {
          if(index == selected)
          {
            $.each(element.Skins, function(sIndex, sElement) {
              $('#wId').append($('<option>', { 
                value: sIndex,
                text : sIndex 
              }));
            });
          }
        });
      });
        console.log("skins reloaded");
    }reloadSkins(); //CALL THE FUNCTION ONCE TO AVOID LETTING THE <select> OPTIONS EMPTY WHEN PAGE LOADED

    



    /**************************************************************************************/
    // EVENTS
    /**************************************************************************************/

    /*
    *      SELECTED WEAPON TYPE CHANGED
    *      SO WE RESET THE SKIN <select> OPTIONS WITH
    *      SUITABLE SKINS
    */

    $( "#wType" ).change(function() { 
      reloadSkins();
    });
});