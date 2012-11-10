$(document).ready(function() {
	
	// set the initial canvas width to the same number that we're going to use for the
	// number of LEDs
	var numLEDs = 160;
	
	
	// set the IP address of the Arduino
	var arduinoIP = "192.168.1.82";
	
	
	
	
	
	
	
	
	// ---------------------------- event listeners ---------------------------
	
	// listen to any change in the text field and attempt to process its value
	$(document).on("keyup change", "#gradientString", processColors);
	
	
	// listen to the send colors button to send our colors
	$(document).on("click", "#sendColors", sendColors);
	
	
	
	
	
	
	
	
	
	
	// ---------------------------- initial execution ---------------------------
	
	// kick things off by processing the colors
	processColors();
	
	
	
	
	
	
	
	
	
	
	// ---------------------------- color processing ---------------------------
	
	function processColors() {
		
		// get the color string from the input field
		var colorString = $("#gradientString").val();
		
				
		// parse the gradient string to get each color stop on the gradient
		var colorArray = parseGradientString(colorString);
		
		
		// draw the gradient on the canvas
		drawGradient($("#colorBox"), colorArray);
		
		
		// get the values from the gradient
		var colorValues = getValuesFromGradient($("#colorBox"));
		
		
		// use the color values to create boxes on the screen to test our math
		testColorValues(colorValues);
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
	
	
	
	function getValuesFromGradient($canvas) {
		
		// get the canvas context and get a row of pixels
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
	
	
	
	function rgbToHex(r, g, b) {
		
		var rgbValue = (b | (g << 8) | (r << 16));
		return String("000000" + rgbValue.toString(16)).slice(-6);
	}
	
	
	
	
	
	
	
	
	
	
	// ------------------------ send colors to arduino -----------------------
	
	function sendColors() {
		
		// send the colors to the arduino via ajax
		$.ajax({
			url: "http://" + arduinoIP + "/?" + $("#outputColors").val() + "."
		}).done(function(response) {
			
			console.log("colors sent. response: ");
			console.log(response);
			
		}).fail(function(response) {
			
			console.log("error. ajax failure when sending colors. response: ");
			console.log(response);
		});
	}
});