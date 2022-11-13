<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
	<title>Item Box Viewer</title>
	<style type="text/css">
		.btn-toolbar {
		  margin: auto;
		  display: flex;
		  flex-direction: row;
		  justify-content: center;
		}

		table, th, td {
		  border: 1px solid black;
		  margin-left: auto;
  		margin-right: auto;
		}
		.trow {
  		display: table-row;
		}

		.tcell {
		  display: table-cell;
		  line-height: 50px;
		}

		.tcell:hover{
			background: rgba(0, 0, 255, 0.2);
		}

		.cellimg {
			width: 50px;
			height: 50px;
		}
	</style>

</head>
<body>

<input type="file" id="file" />
<button id="save-file">Load Save</button>

<hr>
	<span id="username"></span>
<hr>
<div id="selecteditem">
	
</div>
<hr>

<table id="itemboxgrid">

</table>

<div class="center-block">

	<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
	  <div class="btn-group mr-5" role="group" aria-label="First group">
	    <button type="button" class="btn btn-secondary">Previous Page</button>
	  </div>
	  <div class="btn-group mr-5" role="group" aria-label="Second group">
	    <button type="button" class="btn btn-secondary">Next Page</button>
	  </div>
	</div>
</div>


</body>
</html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="main.js"></script>