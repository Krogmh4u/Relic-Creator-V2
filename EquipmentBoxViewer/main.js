$(document).ready(function(){
	var CurrentPage = 0;

	$("#page").text((CurrentPage + 1).toString());

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
});