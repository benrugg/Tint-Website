$(document).ready(function() {
	
	// set the initial canvas width to the same number that we're going to use for the
	// number of LEDs
	var numLEDs = 160;
	
	
	// set the IP address of the Arduino
	var arduinoIP = "192.168.1.82";
	
	
	// set debug mode (to not actually send colors to the arduino)
	var isDebugging = true;
	
	
	// set other initial variables
	var numDragEvents = 0;
	
	
	
	
	
	
	
	
	
	// ---------------------------- event listeners ---------------------------
	
	// listen to the send colors button to send our colors
	$(document).on("click", "#sendColors", sendColors);
	
	
	// listen to add new color pickers
	$(document).on("click", "#colorBox", addNewColorPicker);
	
	
	
	
	
	
	
	
	
	
	// ---------------------------- initial execution ---------------------------
	
	// set the colors we want to start with
	colorArray = ["#8046df", "#16bdb3", "#FFCC66", "#FF0000", "#FF00FF"];
	
	
	// create a color picker from color value we want to start with
	for (var i = 0; i < colorArray.length; i++) {
		
		createColorPicker(colorArray[i], i / (colorArray.length - 1));
	}
	
	
	// process the initial colors
	processColors();
		
	
	
	
	
	
	
	
	
	
	// ------------------------------ color pickers -----------------------------
	
	function createColorPicker(colorValue, percentage) {
		
		// create a new color picker
		$input = $("<input type='hidden' class='color-picker' value='" + colorValue + "' />");
		
		$input.appendTo("body");
		
		$input.miniColors({
			change: processColors,
			mouseup: sendColors
		});
		
		
		// position the color picker "trigger"
		$trigger = $input.next();
		$trigger.css({
			position: "absolute",
			top: "0px",
			left: (percentage * 100) + "%"
		});
		
		
		// style the trigger with the background color it's supposed to have (to fix a bug where the
		// trigger doesn't actually get the background color set on the right element to begin with)
		$trigger.css({
			backgroundColor: colorValue
		});
		
		
		// allow the trigger to be draggable
		$trigger.drags({vertical: false, onDrag: handleTriggerDrag, onRelease: handleTriggerDragRelease});
		
		
		// add the trigger to the input as a data property
		$input.data("trigger", $trigger);
	}
	
	
	function addNewColorPicker(event) {
		
		// get the location that was clicked
		var fullWidth = $("#colorBox").width();
		var percentage = event.offsetX / fullWidth;
		
		
		// get the color at that location
		var colorValue = getColorAtLocation(percentage * numLEDs);
		
		
		// add the new color picker
		createColorPicker("#" + colorValue, percentage);
		
		
		// re-process the colors
		processColors();
	}
	
	
	function handleTriggerDrag() {
		
		// keep track of how many drag events we've had
		numDragEvents++;
		
		
		// when we get to the point where we've dragged a little bit, then disable
		// all the inputs, so when we release the the mouse, we won't show the color picker
		if (numDragEvents == 3) $("input.color-picker").prop("disabled", true);
		
		
		// if we've dragged the trigger down far enough, get rid of it
		// xxxxxx
		
		
		// process the new colors
		processColors();
	}
	
	
	function handleTriggerDragRelease() {
		
		// if we actually dragged something, send the colors now
		if (numDragEvents > 0) sendColors();
		
		
		// reset the drag event counter
		numDragEvents = 0;
		
		
		// reenable the inputs (in case they were disabled during the drag)
		setTimeout(function() { $("input.color-picker").prop("disabled", false); }, 30);
	}
	
	
		
	
	
	
	
	
	
	
	
	// ---------------------------- color processing ---------------------------
	
	function processColors() {
		
		// create a gradient color css string from the color pickers
		var colorString = "";
		var fullWidth = $("#colorBox").width();
		
		$("input.color-picker").each(function() {
			
			$input = $(this);
			$trigger = $input.data("trigger");
			
			var percentage = Math.round((parseInt($trigger.css("left")) / fullWidth) * 100);
			
			colorString += $(this).val() + " " + percentage + "%, ";
		});
		
		colorString = colorString.replace(/, $/, "");
		
		/* old:
		// get the color string from the input field
		var colorString = $("#gradientString").val();
		*/
		
				
		// parse the gradient string to get each color stop on the gradient
		var colorArray = parseGradientString(colorString);
		
		
		// draw the gradient on the canvas
		drawGradient($("#colorBox"), colorArray);
		
		
		/* old:
		// get the values from the gradient
		var colorValues = getValuesFromGradient();
		
		
		// use the color values to create boxes on the screen to test our math
		testColorValues(colorValues);
		*/
	}
	
	
	
	function parseGradientString(gradientString) {
		
		var colorArray = [];
		var initialColorArray = gradientString.split(",");
		
		
		for (var i = 0; i < initialColorArray.length; i++) {
			
			// start with the raw color string (which should have a hex color and optionally a percentage)
			var rawString = initialColorArray[i];
			
			
			// get the hex color
			var colorMatches = rawString.match(/#[a-f0-9]+/i);
			var colorString = (colorMatches) ? colorMatches[0] : "#000000";
			
			
			// get the percentage
			var percentageMatches = rawString.match(/([0-9]+)%/);
			var percentage = (percentageMatches) ? percentageMatches[1] / 100 : i * (1 / (initialColorArray.length - 1));
			
			
			// store the color and percentage
			colorArray.push({color: colorString, percent: percentage});
		}
		
		
		// return the parsed array
		return colorArray;
	}
	
	
	
	function drawGradient($canvas, colorArray) {
		
		// get the canvas context and create a linear gradient
		var context = $canvas[0].getContext("2d");
		var gradient = context.createLinearGradient(0, 0, numLEDs, 0);
		
		
		// add the colors from our array
		for (var i = 0; i < colorArray.length; i++) {
			
			gradient.addColorStop(colorArray[i].percent, colorArray[i].color);
		}
		
		
		// draw a rectangle covering the whole canvas
		context.fillStyle = gradient;
		context.fillRect(0, 0, numLEDs, $canvas.height());
	}
	
	
	
	function getValuesFromGradient() {
		
		// get the canvas context and get a row of pixels
		var $canvas = $("#colorBox");
		var context = $canvas[0].getContext("2d");
		var imageData = context.getImageData(0, 0, numLEDs, 1);
		var pixelData = imageData.data;
		
		
		// loop through the pixels to get a list of colors (in hex)
		var colorArray = [];
		
		for (var i = 0; i < pixelData.length; i += 4) {
			
			colorArray.push(rgbToHex(pixelData[i], pixelData[i + 1], pixelData[i + 2]));
		}
		
		
		// return the color array
		return colorArray;
	}
	
	
	function getColorAtLocation(location) {
		
		// limit the location (just to avoid errors)
		location = Math.round(location);
		if (location >= numLEDs) location = numLEDs - 1;
		
		
		// get the canvas context and get a row of pixels
		var $canvas = $("#colorBox");
		var context = $canvas[0].getContext("2d");
		var imageData = context.getImageData(0, 0, numLEDs, 1);
		var pixelData = imageData.data;
		
		
		// return the color value at the location
		return rgbToHex(pixelData[location * 4], pixelData[(location * 4) + 1], pixelData[(location * 4) + 2]);
	}
	
	
	/* old:
	
	function testColorValues(colorValues) {
		
		// clear the previous test color container
		$("#testColorContainer").empty();
		
		
		// with each color value, add a box that shows its color
		for (var i = 0; i < colorValues.length; i++) {
			
			// create the test color box
			$("#testColorContainer").append($("<div>").css("backgroundColor", "#" + colorValues[i]));
		}
		
		
		// output the color list in the textarea
		$("#outputColors").val(colorValues.join());
	}
	
	*/
	
	
	
	function rgbToHex(r, g, b) {
		
		var rgbValue = (b | (g << 8) | (r << 16));
		return String("000000" + rgbValue.toString(16)).slice(-6);
	}
	
	
	
	
	
	
	
	
	
	
	// ------------------------ send colors to arduino -----------------------
	
	function sendColors() {
		
		// get the colors from the canvas gradient
		var colorValues = getValuesFromGradient();
		
		
		// turn the color array into a string
		var colorString = colorValues.join();
		
		
		/* old:
		var colorString = $("#outputColors").val();
		*/
		
		
		// if we're debugging, just output the colors
		if (isDebugging) {
			
			console.log(colorString);
			
			
		// otherwise, send the colors to the arduino via ajax
		} else {
			
			$.ajax({
				url: "http://" + arduinoIP + "/?" + colorString + "."
			}).done(function(response) {
				
				console.log("colors sent. response: ");
				console.log(response);
				
			}).fail(function(response) {
				
				console.log("error. ajax failure when sending colors. response: ");
				console.log(response);
			});
		}
	}
});