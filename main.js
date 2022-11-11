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


    /*
    *      SUBMIT BUTTON CLICKED
    *      GENERATING THE RELIC
    */

    $("#btn").click(function() { 
      var weaponType = 0;
      var weaponID = 0;

      var selectedType = $("#wType").val();

      var type = new Promise((resolve, reject) => {
        $.getJSON("config/WeaponTypes.json", function(data){
          $.each(data, function(index, element) {
            if(index === selectedType){
              weaponType = element.ID;
              resolve();
            }
          });
        });
      });

      type.then(() => {
        var skin = new Promise((resolve, reject) => {
          $.getJSON("config/WeaponSkins.json", function(data){
            $.each(data, function(index, element) {
              if(index === selectedType)
              {
                $.each(element, function(sIndex, sElement) {
                  $.each(sElement, function(skinIndex, skinElement) {
                    if(skinIndex === $("#wId").val()){
                      weaponID = skinElement.IDs.red;
                      resolve();
                    }
                  });
                });
              }
            });
          });
        });

        skin.then(() => {
          var fileBuffer = new Int8Array(28);
          fileBuffer[0] = weaponType;
          fileBuffer[2] = weaponID;

          var saveFileBuffer = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              return function (data, name) {
                  var blob = new Blob(data, {type: "octet/stream"}),
                      url = window.URL.createObjectURL(blob);
                  a.href = url;
                  a.download = name;
                  a.click();
                  window.URL.revokeObjectURL(url);
              };
          }());

          saveFileBuffer([fileBuffer], 'example.eqp');
        });
      });
      
    });
});