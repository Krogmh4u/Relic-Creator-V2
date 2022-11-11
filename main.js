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

    function getRelicColor()
    {
      switch($('input[name="rColor"]:checked').val())
      {
        case 'red' : return 0; break;
        case 'yellow' : return 1; break;
        case 'green' : return 2; break;
        case 'blue' : return 3; break;
        case 'purple' : return 4; break;
        default : return 0; break;
      }
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
      let srcPath = "Images/" + $("#wType option:selected").text() + "/" + weapName.replaceAll(' ', '').trim() + "/" + getRelicColor() + extension;

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
      
      load.then(() => { reloadPreview(); statsSliderChanged()});
      
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
    *      WEAPON COLOR CHANGED
    *      UPDATE PREVIEW
    */

    $('input[type=radio][name=rColor]').change(function() {
      WeaponName = $("#wId").val();
      reloadPreview();
    });

    /*
    *      STATS SLIDER CHANGED
    */

    function getStatsSliderHexValue(){
      let radPattern = 0;
      $("#rawAffDef").val() === "21" ? radPattern = "91" : radPattern = $("#rawAffDef").val();
      radPattern = parseInt(radPattern, 10).toString(16).toUpperCase();
      if(radPattern.length == 1)
        radPattern = '0' + radPattern;

      return radPattern;
    }

    function statsSliderChanged()
    {
      let done = false;
      var table = new Promise((resolve, reject) => {
        $.getJSON("config/BladeMasterTable.json", function(data){
          $.each(data, function(index, element) {
            if(done){
              resolve();
              return false;
            }
            if(index === $("#wType").val())
            {
              $.each(element, function(offset, obj) {
                if(offset === getStatsSliderHexValue()){
                  $("#attack").text(obj.Attack);
                  $("#affinity").text(obj.Affinity + "%");
                  $("#defense").text(obj.Defense);
                  $("#raw").text(obj.Raw);
                  if(typeof obj.Msg !== 'undefined')
                    $("#statsillegal").html(obj.Msg);
                  else $("#statsillegal").text("");
                  done = true;
                };
              });
            }
          });
        });
      });
    }statsSliderChanged();

    $("#rawAffDef").change( function () {
      statsSliderChanged();
    });


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
          var fileBuffer = new Uint8Array(28);
          
          let wId = weaponID + getRelicColor();

          fileBuffer[0x00] = weaponType;
          fileBuffer[0x02] = wId;
          fileBuffer[0x0D] = parseInt(getStatsSliderHexValue(), 16);
          
          console.log(fileBuffer);

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