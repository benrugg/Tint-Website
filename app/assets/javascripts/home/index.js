//= require jquery.miniColors
//= require quick-drags

$(document).ready(function() {
	
	// set the number of LEDs that will be used in the strip
	var numLEDs = 160;
	
	
	// set the number of LEDs on the left and right that we will consider a "buffer"
	// because they're outside of the viewable area
	var numBufferLEDs = 20;
	
	
	// set the IP address of the Arduino
	// var arduinoIP = "192.168.1.82"; // reserved IP at Ben's house
	var arduinoIP = "192.168.1.46"; // reserved IP at Clover
	
	
	// set debug mode (to not actually send colors to the arduino)
	var isDebugging = false;
	
	
	// set other initial variables
	var numDragEvents = 0;
	var keyColorIndexes = [];
	
	
	// set the number of usable LEDs (excluding the buffer LEDs). (This number should be
	// what is hardcoded for the width and height of the canvas tag in the markup, and
	// this is what will be used for all the gradient math)
	var numUsableLEDs = numLEDs - (numBufferLEDs * 2);
	
	
	
	
	
	
	
	
	// ---------------------------- event listeners ---------------------------
	
	// listen to the send colors button to send our colors
	$(document).on("click", "#sendColors", sendColors);
	
	
	// listen to add new color pickers
	$(document).on("click", "#colorBox", addNewColorPicker);
	
	
	
	
	
	
	
	
	
	
	// ---------------------------- initial execution ---------------------------
	
	// set the colors we want to start with
	//colorArray = ["#8046df", "#16bdb3", "#FFCC66", "#FF0000", "#FF00FF"];
	colorArray = ["#8046df", "#16bdb3"];
	
	
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
		var colorValue = getColorAtLocation(percentage * numUsableLEDs);
		
		
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
		
				
		// parse the gradient string to get each color stop on the gradient
		var colorArray = parseGradientString(colorString);
		
		
		// draw the gradient on the canvas
		drawGradient($("#colorBox"), colorArray);
		
		
		// store the specific color indexes that we'll consider "key" values
		// (these correspond to the color picker percentages)
		storeKeyColorIndexes(colorArray);
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
		var gradient = context.createLinearGradient(0, 0, numUsableLEDs, 0);
		
		
		// add the colors from our array
		for (var i = 0; i < colorArray.length; i++) {
			
			gradient.addColorStop(colorArray[i].percent, colorArray[i].color);
		}
		
		
		// draw a rectangle covering the whole canvas
		context.fillStyle = gradient;
		context.fillRect(0, 0, numUsableLEDs, $canvas.height());
	}
	
	
	
	function getValuesFromGradient() {
		
		// get the canvas context and get a row of pixels
		var $canvas = $("#colorBox");
		var context = $canvas[0].getContext("2d");
		var imageData = context.getImageData(0, 0, numUsableLEDs, 1);
		var pixelData = imageData.data;
		
		
		// loop through the pixels to get a list of colors (in hex)
		var colorArray = [];
		
		for (var i = 0; i < pixelData.length; i += 4) {
			
			// get the hex value of this pixel
			var hexString = rgbToHex(pixelData[i], pixelData[i + 1], pixelData[i + 2]);
			
			
			// if this color is a key color, add an asterisk to it
			if (keyColorIndexes.indexOf(i / 4) != -1) hexString += "*";
			
			
			// add this value to the array
			colorArray.push(hexString);
		}
		
		
		// take the first color and insert it at the beginning for our buffer
		var firstColor = colorArray[0];
		if (firstColor.indexOf("*") != -1) firstColor = firstColor.substr(0, 6);
		
		for (i = 0; i < numBufferLEDs; i++) colorArray.unshift(firstColor);
		
		
		// take the last color and insert it at the beginning for our buffer
		var lastColor = colorArray[colorArray.length - 1];
		if (lastColor.indexOf("*") != -1) lastColor = lastColor.substr(0, 6);
		
		for (i = 0; i < numBufferLEDs; i++) colorArray.push(lastColor);
		
		
		
		// return the color array
		return colorArray;
	}
	
	
	function getColorAtLocation(location) {
		
		// limit the location (just to avoid errors)
		location = Math.round(location);
		if (location >= numUsableLEDs) location = numUsableLEDs - 1;
		
		
		// get the canvas context and get a row of pixels
		var $canvas = $("#colorBox");
		var context = $canvas[0].getContext("2d");
		var imageData = context.getImageData(0, 0, numUsableLEDs, 1);
		var pixelData = imageData.data;
		
		
		// return the color value at the location
		return rgbToHex(pixelData[location * 4], pixelData[(location * 4) + 1], pixelData[(location * 4) + 2]);
	}
	
	
	function storeKeyColorIndexes(colorArray) {
		
		// reset the key color indexes
		keyColorIndexes = [];
		
		
		// for each color value in the array, use its percentage to determine the index of
		// key colors
		for (var i = 0; i < colorArray.length; i++) {
			
			keyColorIndexes.push(Math.round(colorArray[i].percent * (numUsableLEDs - 1)));
		}
	}
	
	
	function rgbToHex(r, g, b) {
		
		var rgbValue = (b | (g << 8) | (r << 16));
		return String("000000" + rgbValue.toString(16)).slice(-6);
	}
	
	
	
	
	
	
	
	
	
	
	// ------------------------ send colors to arduino -----------------------
	
	function sendColors() {
		
		// get the colors from the canvas gradient
		var colorValues = getValuesFromGradient();
		
		
		// reverse the color array (because the LED strips are mounted facing away from the viewer)
		colorValues.reverse();
		
		
		// turn the color array into a string
		var colorString = colorValues.join();
		
		
		// if we're debugging, just output the colors
		if (isDebugging) {
			
			console.log(colorString);
			
			
		// otherwise, send the colors to the arduino via ajax
		} else {
			
			$.ajax({
				url: "http://" + arduinoIP + "/c/?" + colorString + "."
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