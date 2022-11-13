var ItemBox = [];


function showItemAttributes(index){

	console.log("triggered");
	let rawHtml = "Item Name : <b>" + ItemBox[index].name + "</b> <br>";
	rawHtml += "Item type : <b>" + ItemBox[index].type + "</b><br>";
	rawHtml += "Item description : <b>" + ItemBox[index].description + "</b><br>";
	rawHtml += "Item rarity : <b>" + ItemBox[index].rarity + "</b><br>";

	$("#selecteditem").html(rawHtml);
}

$(document).ready(function(){



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

	function generateGrid(){
		let index = 0;
		let rawHtml;

		for(let i = 0; i < 10; ++i){
			rawHtml='';
			rawHtml+= '<tr class="trow">';
			for(let j = 0; j < 10; ++j)
			{
				rawHtml+='<td class="tcell" id="item' + index + '">';
				rawHtml+='<img src="icons/'+ ItemBox[index].icon + '" class="cellimg" onclick="showItemAttributes(' + index +')">';

				++index;

				rawHtml+='</td>';
			}
			rawHtml+='</tr>';
			$("#itemboxgrid").append(rawHtml);
		}

		
		
	}



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
			var fileBuffer = new Uint8Array(0x13DF8);

    		for (var i = 0; i < rawLog.length; i++) fileBuffer[i] = rawLog.charCodeAt(i);

    		let username;
    		var uNameBuffer = new Uint8Array(12);
    		for(var i = 0; i < 24; i+=2){
    			uNameBuffer[i/2] = fileBuffer[i];
    		}

    		username = Utf8ArrayToStr(uNameBuffer);

    		$("#username").html("Loaded user : <b style='color: blue;'>" + username + '</b>');


    		var ItemIds = new Uint16Array(0x0AEE);
    		var ItemAmounts = new Uint16Array(0xAEE);

    		let index = 0;
    		for(var offset = 0x15E; offset < 0x173A; offset+=4){

    			let id0 = fileBuffer[offset];
    			let id1 = fileBuffer[offset + 1];

    			let amount0 = fileBuffer[offset + 2];
    			let amount1 = fileBuffer[offset + 3];

    			ItemIds[index] = (id1 << 8) + id0;
    			ItemAmounts[index] = ((amount1 << 8) + amount0);
    			++index;
    		}

    		let currentPos = 0; 
    		let itemIndex = 0;
    		fetch("ItemTable.json")
			  .then(response => response.json())
			  .then(function(ItemTable){

			  	for(let i = 0; i < ItemIds.length; ++i){
			  		let fromTable = ItemTable[ItemIds[i].toString()];
			  		let item = 
			  		{
			  			"name" : fromTable.name,
			  			"id" : ItemIds[i],
			  			"amount" : ItemAmounts[i],
			  			"rarity" : fromTable.rarity,
			  			"description" : fromTable.description,
			  			"type" : fromTable.type,
			  			"icon": fromTable.icon
			  		}
			  		ItemBox.push(item);
			  	}
			  		
			  	generateGrid();
				
			});

			  
    		

		};
		reader.onerror = function(e) {
			console.log("error occured");
		};
	});

});
