$(document).ready(function(){

    var WeaponName;
    var DefaultWeaps = new Array(); 
    var ElementCategory;
    var ElementValueID;
    
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

      load.then(() => {
        reloadSkins();

        var loadElements = new Promise((resolve, reject) => {
          let i = 0;
          $.getJSON("config/ElementTable.json", function(eTable){
            $.each(eTable.elements, function(index, element) {
              $('#wElement').append($('<option>', { 
                value: element.id,
                text : index 
              }));
              if(element.id === 9) resolve();
            });
          });
        });

        var loadRarities = new Promise((resolve, reject) => {
          let i = 0;
          $.getJSON("config/Rarity.json", function(rObject){
            $.each(rObject, function(index, element) {
              $('#wRarity').append($('<option>', { 
                value: element.id,
                text : index 
              }));

              if(element.id === Object.keys(rObject).length - 1) resolve();
            });
          });
        });

      });
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
      eValueSliderChanged();
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

    /*
    *      ELEMENT CHANGED CHANGED
    *      AS WE DONT HAVE THE SAME AMOUNT OF PATTERNS FOR ELEMENT AND STATUS
    *      WE'LL CAREFULLY REASSIGN THE MAXIMUM LIMIT OF ELEMENT VALUE SLIDER
    */

    $("#elementValue").prop( "disabled", true );

    function elementChanged()
    {
      eValueSliderChanged();
      if(parseInt($(wElement).val(), 10) === 0)
      {
        ElementCategory = "none";
        $("#elementValue").prop( "disabled", true );
        return;
      }
      $("#elementValue").prop( "disabled", false );
      var check = new Promise((resolve, reject) => {
        $.getJSON("config/ElementTable.json", function(eTable){
          $.each(eTable.elements, function(index, element) {
            if(element.id.toString() === $("#wElement").val()){
              if(element.category === 'element')
              {
                $("#elementValue").attr("max", "27");
                ElementCategory = "element";
              }
              else if(element.category === 'status')
              {
                ElementCategory = "status";
                $("#elementValue").attr("max", "19");
              } 
              resolve();
            }
          });
        });
      });
    }

    $("#wElement").change( function () {
      elementChanged();
    });

    /*
    *      ELEMENT VALUE CHANGED CHANGED
    *      LAUNCH THE FUNCTION TO WHEN WEAPON TYPE CHANGED
    *      BECAUSE ELEMENT/STATUS CHANGE ACCORDING TO 
    *      ELEMENT/STATUS "size" OF WEAPON (["high", "medium", "large"])
    */

    function getElementOffsetByIndex(cat){
      let value = parseInt($("#elementValue").val(), 10);

      if(value > 0x19 && ElementCategory === 'element'){
        if(cat === 'H'){
          switch(value)
          {
            case 0x1A: value= 0x1C; break;
            case 0x1B: value= 0x58; break;
          }
        }
        else if(cat === 'M'){
          switch(value)
          {
            case 0x1A: value= 0x1C; break;
            case 0x1B: value= 0x69; break;
          }
        }
        else if(cat === 'L'){
          switch(value)
          {
            case 0x1A: value= 0x1C; break;
            case 0x1B: value= 0x85; break;
          }
        }
        
      }else if(value > 0x11 && ElementCategory === 'status'){
        if(cat === 'H'){
          switch(value)
          {
            case 0x12: value= 0x12; break;
            case 0x13: value= 0x32; break;
          }
        }
        else if(cat === 'M'){
          switch(value)
          {
            case 0x12: value= 0x14; break;
            case 0x13: value= 0x43; break;
          }
        }
        else if(cat === 'L'){
          switch(value)
          {
            case 0x12: value= 0x14; break;
            case 0x13: value= 0x5F; break;
          }
        }
      }

      return ('0' + (value & 0xFF).toString(16)).slice(-2).toUpperCase();
      
    }

    function eValueSliderChanged()
    {
      if(parseInt($(wElement).val(), 10) === 0 || typeof $(wElement).val() === 'undefined' || isNaN(parseInt($(wElement).val(), 10)))
      {
        
        $( "#eValue" ).text("---");
        $( "#eLatent" ).text("---");
        return;
      }
      var tbl;
      var currWeapElCat;

      var getCategory = new Promise((resolve, reject) => {
        $.getJSON("config/WeaponTypes.json", function(data){
          $.each(data, function(index, element) {
            if(element.name === $('#wType option:selected').text()){
              currWeapElCat = Object.values(element)[2];
              resolve();
            }
          });
        });
      });
      
      getCategory.then(() => { 
        var table = new Promise((resolve, reject) => {
          $.getJSON("config/ElementTable.json", function(eTable){
            ElementCategory === 'element' ? tbl = eTable.table.Element : tbl = eTable.table.Status;
            $.each(tbl, function(index, element) {
              if(index === currWeapElCat)
              {
                $.each(element, function(key, e) {
                  if(key === getElementOffsetByIndex(currWeapElCat))
                  {
                    ElementValueID = getElementOffsetByIndex(currWeapElCat);
                    $( "#eValue" ).text(e.value);
                    if(e.latent === false){
                      $( "#eLatent" ).text("No");
                      $( "#eLatent" ).attr("style", "color: green;");
                    }else{
                      $( "#eLatent" ).text("Yes");
                      $( "#eLatent" ).attr("style", "color: red;");
                    }
                  }
                });
                resolve();
              }
            });
          });
        });
      });
      
    }eValueSliderChanged();

    $("#elementValue").change( function () {
      eValueSliderChanged();
    });


    $("#btn").click(function() { 
      var weaponType = 0;
      var weaponID = 0;
      var weaponElementType = 0;
      var weaponElementValue = 0;
      var weaponRarity = parseInt($( "#wRarity" ).val(), 10);

      weaponElementType = parseInt($( "#wElement" ).val(), 10);
      weaponElementType === 0 ? weaponElementValue = "00" : weaponElementValue = ElementValueID;

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
          fileBuffer[0x04] = parseInt(weaponElementValue, 16); 
          fileBuffer[0x05] = weaponElementType;
          fileBuffer[0x11] = weaponRarity;

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