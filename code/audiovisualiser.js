/*
Leander de Kraker
2017-january
This File contains the code to run the AUDIO VISUALIZER.
It uses the getUserMedia and webAudio API, and D3.

beta version 6
*/

// Audio buffer size
var BUFF_SIZE = 2**12;

// Number of FFTs that are saved for heatmap
var nCols = 20;

// Frequency Compression for heatmap
var CompressTo = 400; // New array will be x pixels high, and log transformed data axis

// Smoothing switch
var smoothing = 0;

// Pause: on (1) or off (0)
var pause = 0;

// Standard FFT view
var FFTview = "linear",
	freqBins = [],
	octaveIndexes = [];

// Add function for smoothing
function smoothingToggle(){
	if (smoothing == 0){
		smoothing = 1;
	} else {
		smoothing = 0;
	}
}

// Pause/ play Button functionality
function pauseChoice(){
	if (pause == 0){
		pause = 1;
	} else {
		pause = 0;
	}
}

// FFT view buttons function
function FFTchoice(){
	if (FFTview  == "linear"){
		FFTview  = "stacked";
		d3.selectAll(".FFT_svg").remove();	
		svg2 = init_FFT_plot_stacked(freqLims, freqBins, octaveIndexes)		
	} else {
		FFTview  = "linear";
		d3.selectAll(".FFT_svg").remove();
		svg2 = init_FFT_plot_linear(freqLims, freqBins)
	}
};

// Add info text to the info DIV
function show_info(info){
	var place = document.getElementById('infoDIV');
	if (info == "GEN"){
		var infoText = document.getElementById('General_info').innerHTML;
	} else if (info == "FFT"){
		var infoText = document.getElementById('FFT_info').innerHTML;
	} else if (info == "RAW"){
		var infoText = document.getElementById('raw_info').innerHTML;
	} else if (info == "HEAT"){
		var  infoText = document.getElementById('HEAT_info').innerHTML;
	}
	place.innerHTML = infoText;
}

// Create Frequency note labels
var notesN = 88 // number of labels to make
	noteNames = []
	noteNamesExample = ["A", "", "B", "C", "", "D", "", "E", "F", "", "G", ""]
	noteFreqs = [27.5] // A0 = 27.5Hz
	interval = Math.pow(2, 1/12) // A half step is 12th root of 2 increase in frequency
	octaveN = 0;
for (var i = 0; i < notesN; i++){
	// Add frequency i 
	freqi = noteFreqs[noteFreqs.length-1]*interval;
	noteFreqs.push(freqi);
	
	// Add name i
	nami = noteNamesExample[i % noteNamesExample.length];
	if (nami == "C"){
		octaveN += 1;
		nami = nami + octaveN;	
	};
	noteNames.push(nami)
};

// Function that calculates logarithmic spacing between elements from 0 to log(max) in n steps
function Lin2LogSpace(max, n){
	var start = Math.log(1), // First frequency
		stop = Math.log(max), // Stop at last frequency
		step = (stop-start)/n,
		freqIndexes = [start];
	for (i = 1; i<n; i++){
		freqIndexes.push(freqIndexes[i-1] + step);
		freqIndexes[i-1] = Math.round(Math.exp(freqIndexes[i-1]));
	}
	freqIndexes[i-1] = Math.round(Math.exp(freqIndexes[i-1]));
	return freqIndexes
}
	

// ----------  PLOTTING FUNCTIONS -----------
// INITIALIZE RAW SIGNAL PLOT
function init_raw_plot(maxX) {
	var width = 600
		height = 150
		margin = {top: 10, left: 50, bottom: 50, right: 30};
	
	var svg = d3.select('#raw_plot').append('svg')
			.attr('width',width)
			.attr('height',height)
			.attr('id','raw_line_svg')
			.append('g')
				.attr('id', 'raw_line_canvas')
				.attr('width', width - margin.left - margin.right)
				.attr('height',height - margin.top - margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xScale = d3.scale.linear().domain([0, maxX]).range([0, width - margin.left - margin.right])
		yScale = d3.scale.linear().domain([-256/2, 256/2]).range([height - margin.top - margin.bottom, 0]);

	// Axis properties
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.ticks(3)
		.scale(yScale)
		.orient("left");
		
	// Add x axis with label
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("id","x-axis")
	  .attr("transform", "translate(0," + ((height-margin.bottom)-margin.top) + ")")
	  .call(xAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("y", 25)
		.attr("dy", ".71em")
		.attr("x", width-margin.right*2)
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("time (ms)");
	
	// Add y axis with label
	svg.append("g")
	  .attr("class", "y axis")
	  .attr("id","y-axis")
	  .call(yAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("input");
		
	return {"svg":svg,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale, "height":height, "margin":margin}
}

// INITIALIZE FFT plot linear view
function init_FFT_plot_linear(Xlim, freqBins) {
	var width = 600
		height = 450
		margin = {top: 10, left: 50, bottom: 40, right: 30};
	
	var svg = d3.select('#FFT_plot').append('svg')
	  .attr('width',width)
	  .attr('height',height)
	  .attr('class', 'FFT_svg')
	  .attr('id','FFT_svg')
	  .append('g')
		.attr('id', 'FFT_canvas')
		.attr('width', width - margin.left - margin.right)
		.attr('height',height - margin.top - margin.bottom)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xScale = d3.scale.log().domain(Xlim).range([0, width - margin.left - margin.right]);
	var	yScale = d3.scale.linear().domain([1, 200]).range([height - margin.top - margin.bottom, 0]);

	// Axis properties
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.tickValues(noteFreqs)
		.tickFormat(function(d,i){if (i % 12 == 3){ return noteNames[i]}})
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.ticks(3)
		.scale(yScale)
		.orient("left");
		
	// Add x axis with label
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("id","x-axis")
	  .attr("transform", "translate(0," + ((height-margin.bottom)-margin.top) + ")")
	  .call(xAxis)
	.append("text")
		.attr("y", 25)
		.attr("dy", ".71em")
		.attr("x", width-margin.right*2)
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("frequency (note)");
	
	// Add y axis with label
	svg.append("g")
	  .attr("class", "y axis")
	  .attr("id","y-axis")
	  .call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("amplitude");

return {"svg":svg,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale, "height":height, "margin":margin}
}

// INITIALIZE FFT plot stacked view
function init_FFT_plot_stacked(Xlim, freqBins, octaveIndexes){
	var width = 600
		height = 450
		margin = {top: 10, left: 50, bottom: 40, right: 30};
	
	var xScale = [];
		numOct = octaveIndexes.length-2;
		height = (height/numOct) - margin.top;
	
	var yScale = d3.scale.linear().domain([1, 300]).range([height-margin.top, 0]);
	
	var noteFreqsi = [];
	var noteNamesi = [];
	
	for (i=numOct; i>0; i--){
		var Xlim = [freqBins[octaveIndexes[i]], freqBins[octaveIndexes[i+1]]];
		xScale[i] = d3.scale.log().domain(Xlim).range([0, width - margin.left - margin.right]);
		
		
		// Save the note labels which occur on this axis
		for (var j=0; j<noteFreqs.length; j++){
			if (noteFreqs[j]>= Xlim[0] && noteFreqs[j]<= Xlim[1])
			{
				noteFreqsi.push(noteFreqs[j]);
				noteNamesi.push(noteNames[j]);
			}
		}
		
		svg = d3.select('#FFT_plot').append('svg')
		.attr('width',width)
		.attr('height',height)
		.attr('class', 'FFT_svg')
		.attr('id','FFT_svg' + i)
		.append('g')
			.attr('id', 'FFT_canvas' + i)
			.attr('width', width - margin.left - margin.right)
			.attr('height',height - margin.top - margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// Axis properties
		var xAxis = d3.svg.axis()
			.scale(xScale[i])
			.tickValues(noteFreqsi)
			.tickFormat(function(d,i){ return noteNamesi[i]})
			.orient("bottom");
		var yAxis = d3.svg.axis()
			.ticks(0)
			.scale(yScale)
			.orient("left");
			
		// Add x axis with label
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("id","x-axis")
		  .attr("transform", "translate(0," + (height-30) + ")")
		  .call(xAxis)
		  
		svg.append("g")
		  .attr("class", "y axis")
		  .attr("transform", "translate(0," + (-10) + ")")
		  .attr("id","y-axis")
		  .call(yAxis)
	}
	
	return {"svg":svg,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale, "height":height, "margin":margin}
}

// INITIALIZE FFT heatmap PLOT
function init_FFT_heat_plot(xMax, yLim) {
	var width = 600,
		height = 450;
		margin = {top: 10, left: 50, bottom: 60, right: 30};
	
	xLim = [-(xMax*BUFF_SIZE/4)/10000, 0];
	
	var x = d3.scale.linear().domain(xLim).range([0, width-margin.left-margin.right]);
	var y = d3.scale.log().domain(yLim).range([height-margin.bottom-margin.top, 0]);
	
	// Canvas element which will contain the heatmap
	var canvas = d3.select("#heatmap_canvas").append("canvas")
		.attr("class", "canvas")
		.attr("width", xMax)
		.attr("height", CompressTo) // The number of pixels of the heatmap
		.style("width",  (width-margin.left-margin.right) + "px")
		.style("height", height-margin.bottom-margin.top + "px")
		.style("zindex", "1");
	  
	// SVG which contains the axis and labels
	var svg = d3.select("#heatmap_axis").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id","FFT_heatmap");
	
	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  .ticks(10);

	var yAxis = d3.svg.axis()
	  .scale(y)
	  .tickValues(noteFreqs)
	  .tickFormat(function(d,i){if (i % 12 == 3){ return noteNames[i]}})
	  .orient("left");
	
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(" + margin.left + "," + (height-margin.bottom) + ")")
	  .call(xAxis)
	.append("text")		.attr("y", 25)
		.attr("dy", ".71em")
		.attr("x", width-margin.right*2)
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("time (sec)");
	  
	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(" + margin.left +"," + margin.top + ")")
	  .call(yAxis)
	  .append("text")		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("frequency (note)");
	
	// The colormap of the heatmap
	var color = d3.scale.linear()
		.domain([0, 100, 150, 200, 225, 255])
		//.range(["#000", "#600", "#910", "#B40", "#DA2", "#FF4"]) // Hot
		//.range(["#FFF", "#CCF", "#BBF", "#99D", "#85B", "#905"]); // White blue
		.range(["#000", "#016", "#029", "#06B", "#4AD", "#CFF"]) // Black blue

	return {"svg":svg, "xAxis":xAxis, "canvas":canvas, "color":color}
}


// Change number of columns on the heatmap
function redraw_FFT_heat_plot(xMax){
	svg3.svg.remove();
	svg3.canvas.remove();
	svg3 = init_FFT_heat_plot(nCols, freqLims);
}


// --------- PLOT UPDATING/ DRAWING FUNCTIONS ---------------
// Plot the raw input
function plot_line(time, given_typed_array){
	var line = d3.svg.line()
		.x(function(d, i) {
			return svg1.xScale(time[i])
		})
		.y(function(d, i) {
			return svg1.yScale(given_typed_array[i]-(256/2))
		})
		svg1.svg.select("#raw_line").remove()
		svg1.svg.append("path")
		  .data([time, given_typed_array])
		  .attr("class", "line")
		  .attr("id", "raw_line")
		  .attr("d", line);
}

// Plot the FFT freq data
function plot_FFT_linear(freq_bins, freq_values){
	// Plot FFT plot data for linear view
	var  area = d3.svg.area()
	.x(function(d, i) {
		return svg2.xScale(freq_bins[i])
	})
	.y0(svg2.height-svg2.margin.bottom-svg2.margin.top)
	.y1(function(d, i) {
		//console.log(freq_values[i])
		vali = freq_values[i]-80
		if (vali < 0){
			return(svg2.height-svg2.margin.bottom-svg2.margin.top)}
		else{
			return svg2.yScale(vali)
		}
	})
	svg2.svg.select("#FFT_line").remove()
	svg2.svg.append("path")
	  .data([freq_bins, freq_values])
	  .attr("class", "area")
	  .attr("id", "FFT_line")
	  .attr("d", area);
}

function plot_FFT_stacked(freq_bins, freq_values, octaveIndexes){
	// stacked FFT view selected
	for (i=0; i < octaveIndexes.length-1; i++){
		freq_binsi = freq_bins.slice(octaveIndexes[i], octaveIndexes[i+1]+1);
		valuesi = freq_values.slice(octaveIndexes[i], octaveIndexes[i+1]+1);
		var area = d3.svg.area()
		.x(function(d, j){
			return svg2.xScale[i](freq_binsi[j])
		})
		.y0(svg2.height-svg2.margin.top)
		.y1(function(d, j){
			vali = valuesi[j]-80
			if (vali < 0){
				return(svg2.height-svg2.margin.top)}
				
			else{
				return svg2.yScale(vali)
			}
		})
		
		d3.select("#FFT_line"+i).remove()
		d3.select("#FFT_svg"+i).append("path")
		  .attr("transform","translate(" + svg2.margin.left + "," + (-svg2.margin.top) + ")")
		  .data([freq_binsi, valuesi])
		  .attr("class", "area")
		  .attr("id", "FFT_line"+i)
		  .attr("d", area);
	}
}


// Create the image heatmap and show it
function plot_heatmap(freq_matrix, xMax, yMax){
	context = svg3.canvas.node().getContext("2d"),
	image = context.createImageData(xMax, yMax);
	for (var y = 0, p = 0; y < yMax; y++) {
		for (var x = 0; x < xMax; x++) {
			var c = d3.rgb(svg3.color(freq_matrix[x][y]));
			image.data[p++] = c.r;
			image.data[p++] = c.g;
			image.data[p++] = c.b;
			image.data[p++] = 256;
		}
	}
	context.putImageData(image,0,0);
}


// ------------ AUDIO START ---------------
var webaudio_tooling_obj = function () {
	
	// The audio object
    var audioContext = new AudioContext();
	
	sRate = audioContext.sampleRate;
	
	// Calculate time line (x-axis RAW) and calculate frequency bin values (x-axis FFT)
	var time = 	[];
	var binCount = (BUFF_SIZE/4);
	for  (var i = 0; i < BUFF_SIZE; i++) {
	   time.push(i/sRate*1000);
	}
	freqBins.push(1*sRate/BUFF_SIZE);
	for  (var i = 1; i < binCount; i++) {
	   freqBins.push(Math.round(i * sRate/BUFF_SIZE));
	}
	freqLims = [freqBins[0],freqBins[freqBins.length-1]];
	
	// Create indexes of which elements to take to create a log transformed
	//	and compressed image of the frequency spectrum
	freqIndexes = Lin2LogSpace(binCount, CompressTo);
	
	// Calculate which element indexes are the transitions to new octaves
	var search = 3; // Search for C's which begin at the 3th notename index
	for (var i = 0; i < binCount; i++){
		if (freqBins[i] >= noteFreqs[search]){
			octaveIndexes.push(i-1);
			search += 12; // Search for next octave
		}
	}
	
	// Create SVGs for plots
	svg1 = init_raw_plot(time[time.length-1]);
	svg2 = init_FFT_plot_linear(freqLims, freqBins);
	svg3 = init_FFT_heat_plot(nCols, freqLims);

	// Set the user media version for different browsers
    if (!navigator.getUserMedia){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
	};

	// Execute the getusermedia API
    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, 
            function(stream) {
                start_microphone(stream);
            },
            function(e) {
                alert('Error capturing audio.');
            }
            );
    } else { alert('getUserMedia not supported in this browser.'); }

	// Original audio is only available in this function.
    function start_microphone(stream){
	
        var gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );

        var microphone_stream = audioContext.createMediaStreamSource(stream);

		// Enable increase and decrease of number of bins of FFT heatmap
        document.getElementById('historyLength').addEventListener('change', function(){
			if (this.value > nCols){ // Add extra columns to the matrix
				var extra = this.value - nCols,
					filler = new Uint8Array(nBins);
				for (var i = 0; i<extra; i++){
					freq_matrix.unshift(filler);
				}
			}
			else{ // Delete columns of the matrix
				var toDelete = nCols - this.value;
				for (var i = 0; i<toDelete; i++){
					freq_matrix.shift();
				}
			}
			nCols = this.value
			redraw_FFT_heat_plot(nCols, svg3)
			plot_heatmap(freq_matrix, nCols, nBins);
		});

        // --- setup FFT
        var script_processor_analysis_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_analysis_node.connect(gain_node);
		
        var analyser_node = audioContext.createAnalyser();
        analyser_node.smoothingTimeConstant = 0;
        analyser_node.fftSize = BUFF_SIZE;

        microphone_stream.connect(analyser_node);

		// Initialize freq matrix for FFT heatmap
		var nBins = analyser_node.frequencyBinCount/2;
		var freq_matrix = new Array(nCols);
		for (var i = 0; i<nCols; i++){
			freq_matrix[i] = new Uint8Array(nBins);
		}
		
        var array_freq = new Uint8Array(nBins);
		var smoothing_array = new  Uint8Array(nBins);
        var array_time_signal = new Uint8Array(BUFF_SIZE);
		
		script_processor_analysis_node.onaudioprocess =  function() {
			if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
				if (pause == 0){
					// With no smoothing: update array_freq with the newest Frequency data
					// With smoothing: Use smoothing array to update array_freq with an average of the two
					if (smoothing == 0){
						analyser_node.getByteFrequencyData(array_freq);
					} else {
						analyser_node.getByteFrequencyData(smoothing_array);
						for (var i = 0; i<smoothing_array.length; i++){
							array_freq[i] = ((array_freq[i] + smoothing_array[i])/ 2);
						}
					}
					
					// The latest buffer data
					analyser_node.getByteTimeDomainData(array_time_signal);
					
					// Add FFT results to frequency matrix
					image_slice = [];
					for (i = 0; i < CompressTo; i++) {
					  image_slice.unshift(array_freq[freqIndexes[i]]);
					}
					freq_matrix.shift(); // Remove oldest freq_bins_column
					freq_matrix.push(image_slice); // Add new freq data

					// draw the plots	
					plot_line(time, array_time_signal);
					plot_heatmap(freq_matrix, nCols, nBins);
				}
				// FFT plot should get updated even when paused so you can switch views while paused.
				if (FFTview == "stacked"){
					plot_FFT_stacked(freqBins, array_freq, octaveIndexes);
				} else {
					plot_FFT_linear(freqBins, array_freq);
				}
			}
		};
    }
}();
