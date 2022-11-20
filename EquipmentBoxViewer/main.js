var EquipmentBox = [];
var fileBuffer;
$(document).ready(function(){
	var CurrentPage = 0;

	$("#page").text((CurrentPage + 1).toString());

	function Utf8ArrayToStr(array) {
	    var out, i, len, c;
	    var char2, char3;

	    out = "";
	    len = array.length;
	    i = 0;
	    while(i < len) {
		    c = array[i++];
		    if(c !== 0){
		    	switch(c >> 4)
			    { 
			      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			        out += String.fromCharCode(c);
			        break;
			      case 12: case 13:
			        char2 = array[i++];
			        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			        break;
			      case 14:
			        char2 = array[i++];
			        char3 = array[i++];
			        out += String.fromCharCode(((c & 0x0F) << 12) |
			                       ((char2 & 0x3F) << 6) |
			                       ((char3 & 0x3F) << 0));
			        break;
			    }
		    }
	    }

	    return out;
	}

	function GetStrType(type)
	{
		switch(type){
		case "07": return "GS"; break;
		case "08": return "SNS"; break;
		case "09": return "H"; break;
		case "0A": return "L"; break;
		case "0B": return "LBG"; break;		
		case "0C": return "HBG"; break;
		case "0D": return "LS"; break;
		case "0E": return "SA"; break;
		case "0F": return "GL"; break;
		case "10": return "BOW"; break;
		case "11": return "DB"; break;
		case "12": return "HH"; break;
		case "13": return "IG"; break;
		case "14": return "CB"; break;
		default: return "N/A"; break;
		}
	}

	function generateEmptyGrid(){
		let rawHtml;
		for(let i = 0; i < 10; ++i){
			rawHtml+= '<tr class="trow">';
			for(let j = 0; j < 10; ++j)
			{
				rawHtml+='<td class="tcell" id="0">';
				rawHtml+='<img src="../itemviewer/icons/Empty-Slot.png" class="cellimg" onclick="showItemAttributes(0)">';
				rawHtml+='</td>';
			}
			rawHtml+='</tr>';
			
		}

		$("#eqpboxgrid").html(rawHtml);
	}generateEmptyGrid();


	$("#save-file").click(function(){
		if(document.querySelector("#file").value == '') {
			console.log('No file selected');
			return;
		}

		var file = $('#file').get(0).files[0];
		var reader = new FileReader;
		reader.readAsBinaryString(file);

		reader.onload = function(e) {
			var rawLog = reader.result;
			if(rawLog.length !== 0x13DF8) return;
			fileBuffer = new Uint8Array(0x13DF8);

    		for (var i = 0; i < rawLog.length; i++) fileBuffer[i] = rawLog.charCodeAt(i);

    		let username;
    		var uNameBuffer = new Uint8Array(12);
    		for(var i = 0; i < 24; i+=2){
    			uNameBuffer[i/2] = fileBuffer[i];
    		}

    		username = Utf8ArrayToStr(uNameBuffer);

    		$("#username").html("Loaded user : <b style='color: blue;'>" + username + '</b>');

    		var eqps = [];

    		for(let pos = 0x0173E; pos < 0x0BB32; pos += 0x1C){
    			var CurrentEqp = 
    			{
    				"EquipmentType" : fileBuffer[pos],
    				"EquipmentID" : (fileBuffer[pos + 0x03] << 8) + fileBuffer[pos + 0x02],
    				"BufferOffset" : pos
    			};
    			eqps.push(CurrentEqp);
    		};

    		fetch("../config/WeaponsTable.json").then(response => response.json()).then(function(WeaponsTable){
			fetch("../config/WeaponSkins.json").then(response => response.json()).then(function(RelicSkins){
			fetch("../config/ArmorTable.json").then(response => response.json()).then(function(ArmorIds){
			fetch("../config/TalismanTable.json").then(response => response.json()).then(function(TalIds){
			for(eqp of eqps)
		  	{
		  		var EqpObj;

		  		if(eqp.EquipmentID === 0 || eqp.EquipmentType === 0){
		  			EquipmentBox.push({"name" : "Empty", "rarity" : 0, "icon" : "icons/empty.png"});
		  		}
		  		else if(eqp.EquipmentType >= 0x01 && eqp.EquipmentType <= 0x05) { // armor
		  			let strType;
		  			eqp.EquipmentType > 0xF ? strType = eqp.EquipmentType.toString(16).toUpperCase() : strType = '0' + eqp.EquipmentType.toString(16).toUpperCase();
		  			let TEquipment = ArmorIds[strType][eqp.EquipmentID.toString()];
		  			if(typeof TEquipment !== 'undefined')
		  			{
		  				let iconPath = "icons/armors/icons_" + TEquipment.subtype.toLowerCase() + "/" + TEquipment.rarity.toString() + ".png";
		  				EquipmentBox.push({"name" : TEquipment.name, "rarity" : TEquipment.rarity, "icon" : iconPath});
		  			}else EquipmentBox.push({"name" : "Empty", "rarity" : 0, "icon" : "icons/empty.png"});
		  		}
		  		else if(eqp.EquipmentType >= 0x07 && eqp.EquipmentType <= 0x14) { // weapon
		  			let strType;
		  			eqp.EquipmentType > 0xF ? strType = eqp.EquipmentType.toString(16).toUpperCase() : strType = '0' + eqp.EquipmentType.toString(16).toUpperCase();
		  			let TEquipment = WeaponsTable[strType][eqp.EquipmentID.toString()];

		  			if(typeof TEquipment !== 'undefined')  // if not relic
		  			{
		  				let iconPath = "icons/" + GetStrType(strType).toLowerCase() + "/" + TEquipment.rarity.toString() + ".png";
		  				EquipmentBox.push({"name" : TEquipment.name, "rarity" : TEquipment.rarity, "icon" : iconPath});
		  			}
		  			else
		  			{
		  				var sTable = RelicSkins[GetStrType(strType.toUpperCase())].Skins;
		  				Object.keys(sTable).forEach(function(key) {
		  					Object.keys(sTable[key].IDs).forEach(function(sIDtbl) {
		  						if(eqp.EquipmentID === sTable[key].IDs[sIDtbl]){
		  							let iconPath = "icons/" + GetStrType(strType).toLowerCase() + "/" + fileBuffer[eqp.BufferOffset + 0x11] + 1 + ".png";
		  						    EquipmentBox.push({"name" : key, "rarity" : fileBuffer[eqp.BufferOffset + 0x11] + 1, "icon" : iconPath});
		  						}
		  					});
						  
						});

		  			}
		  			
		  		}else if(eqp.EquipmentType === 6) // talisman
		  		{
		  			let talisman = TalIds[eqp.EquipmentID.toString()];
		  			if(typeof talisman !== 'undefined'){
		  				let iconPath = "icons/talismans/" + talisman.rarity.toString() + ".png";
		  				EquipmentBox.push({"name" : talisman.name, "rarity" : talisman.rarity, "icon" : iconPath});
		  			}else EquipmentBox.push({"name" : "Empty", "rarity" : 0, "icon" : "icons/empty.png"});
		  		}
		  	}});});});}); // lol
    	};

	});

});