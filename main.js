$(document).ready(function(){

    var WeaponName;
    var DefaultWeaps = new Array(); 

    
    /**************************************************************************************/
    // INITIALIZATION 
    /**************************************************************************************/

    function init()
    {
      let aLength = 0;

      var load = new Promise((resolve, reject) => {
        $.getJSON("config/WeaponSkins.json", function(sdata){
        let done = false;
        $.each(sdata, function(index, element) {
            $.each(element.Skins, function(sIndex, sElement) {
              if(!done){
                const weap = {
                  type : index,
                  name : sIndex
                };
                DefaultWeaps.push(weap);
                done = true;
              }
            });
            if(aLength === Object.keys(sdata).length - 1) resolve();
            ++aLength;
            done = false;
          });
        });
      });

      load.then(() => { reloadSkins();});
    }



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

    function reloadPreview(){ 
      
      if(typeof WeaponName === 'undefined' || WeaponName === 'rload'){ 
        DefaultWeaps.forEach(function(_weapon){ 
          if(_weapon.type === $( "#wType" ).val()) WeaponName = _weapon.name;
        });
      }

      let extension = ".png";
      let weapName = WeaponName.replace(/['"]+/g, '').replaceAll('-', '');
      let srcPath = "Images/" + $("#wType option:selected").text() + "/" + weapName.replaceAll(' ', '').trim() + "/0" + extension;

      console.log(srcPath);

      $("#rPreview").attr("src",srcPath);
    }

    function reloadSkins() {

      $('#wId').empty(); // REMOVE ALL IDS FROM <select> OPTIONS
      var load = new Promise((resolve, reject) => {
          $.getJSON("config/WeaponSkins.json", function(data){
          let selected = $( "#wType" ).val();
          $.each(data, function(index, element) {
            if(index == selected)
            {
              let i = 0;
              $.each(element.Skins, function(sIndex, sElement) {
                  $('#wId').append($('<option>', { 
                    value: sIndex,
                    text : sIndex 
                  }));    
                ++i;
              });
            }
          });
        });
        resolve();
      }); 
      
      load.then(() => { reloadPreview(); });
      
    }init();

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
      WeaponName = 'rload';
    });

    /*
    *      SELECTED WEAPON SKIN CHANGED
    *      SO WE CHANGE THE PREVIEW IMAGE
    */

    $( "#wId" ).change(function() { 
      WeaponName = $("#wId").val();
      reloadPreview();
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