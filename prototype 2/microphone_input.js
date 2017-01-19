
// Audio buffer size
var BUFF_SIZE = 2**12;

// Number of FFTs that are saved for heatmap
var nCols = 55;


// Create Frequency labels
var notesN = 88 // number of labels to make
	noteNames = []
	noteNamesExample = ["A", "", "B", "C", "", "D", "", "E", "F", "", "G", ""]
	noteFreqs = [27.5] // A0 = 27.5Hz
	interval = Math.pow(2,1/12) // A half step is 12th root of 2 increase in frequency
	octaveLength = noteNamesExample.length
	octaveN = 0;
for (var i = 0; i < notesN; i++){
	// Add frequency i 
	freqi = noteFreqs[noteFreqs.length-1]*interval;
	noteFreqs.push(freqi);
	
	// Add name i
	nami = noteNamesExample[i % octaveLength];
	if (nami == "C"){
		octaveN += 1;
	};
	if (nami != ""){
		nami = nami + octaveN;
	};
	noteNames.push(nami)
};

// ----------  PLOTTING FUNCTIONS -----------
// INITIALIZE RAW SIGNAL PLOT
function init_raw_plot(maxX) {
	var width = 600
		height = 170
		margin = {top: 10, left: 50, bottom: 60, right: 30};
	
	var svg = d3.select('body').append('svg')
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

// INITIALIZE FFT PLOT
function init_FFT_plot(Xlim) {
	var width = 600
		height = 500
		margin = {top: 10, left: 50, bottom: 60, right: 30};
	
	var svg = d3.select('body').append('svg')
			.attr('width',width)
			.attr('height',height)
			.attr('id','FFT_svg')
			.append('g')
				.attr('id', 'FFT_canvas')
				.attr('width', width - margin.left - margin.right)
				.attr('height',height - margin.top - margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
	var xScale = d3.scale.log().domain(Xlim).range([0, width - margin.left - margin.right])
		yScale = d3.scale.linear().domain([1, 300]).range([height - margin.top - margin.bottom, 0]);

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
		.text("frequency (note)");
	
	// Add y axis with label
	svg.append("g")
	  .attr("id","y-axis")
	  .call(yAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("amplitude");
		
	return {"svg":svg,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale, "height":height, "margin":margin}
}


// INITIALIZE FFT heatmap PLOT
function init_FFT_heat_plot(xMax, yMax) {
	var width = 600
		height = 500
		margin = {top: 10, left: 50, bottom: 40, right: 30};
	

	var svg = d3.select('body').append("canvas")
			.attr('width',width)
			.attr('height',height)
			.attr('id','FFT_heat_canvas')
			.append('g')
				.attr('id', 'FFT_heat_canvas')
				.attr('width', width - margin.left - margin.right)
				.attr('height',height - margin.top - margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
	var xScale = d3.scale.linear().domain([0,xMax]).range([0, width - margin.left - margin.right])
		yScale = d3.scale.log().domain([0,yMax]).range([height - margin.top - margin.bottom, 0]);

	// Axis properties
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.ticks(3)
		.scale(yScale)
		.tickValues(noteFreqs)
		.tickFormat(function(d,i){if (i % 12 == 3){ return noteNames[i]}})
		.orient("left");
		
	var color = d3.scale.linear()
		.domain([0, 256])
		.range(["#0a0", "#eb4"]);

	// Add x axis with label
	svg.append("g")
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
		.text("time (slice)");
	
	// Add y axis with label
	svg.append("g")
	  .attr("id","y-axis")
	  .call(yAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("frequency");
		
	return {"svg":svg,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale, "height":height, "margin":margin}
}

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
	//console.log(label);
	//console.log(given_typed_array);
}

// Plot the FFT
function plot_FFT(freq_bins, freq_values){
	console.log(svg2)
	var  area = d3.svg.area()
		.x(function(d, i) {
			return svg2.xScale(freq_bins[i])
		})
		.y0(svg2.height-svg2.margin.bottom-svg2.margin.top)
		.y1(function(d, i) {
			//console.log(freq_values[i])
			vali = freq_values[i]-50
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
		  //console.log("number of freq bins: " + freq_bins.length);
		  //console.log("number of freq vals: " + freq_values.length);
}

function plot_heatmap(freq_matrix){
	var context = svg3.node().getContext("2d"),
	image = context.createImageData(dx, dy);
	
    context.putImageData(image, 0, 0);
}

// ------------ AUDIO START ---------------
var webaudio_tooling_obj = function () {
	
	// The audio object
    var audioContext = new AudioContext();
	
	sRate = audioContext.sampleRate;
	
	// Calculate time line (x-axis RAW) and calculate frequency bin values (x-axis FFT)
	var time = 	[];
	var freqbins = [];
	var nBins = BUFF_SIZE/4;
	for  (var i = 1; i <= BUFF_SIZE; i++) {
	   time.push(i/sRate*1000);
	}
	for  (var i = 1; i <= nBins; i++) {
	   freqbins.push(Math.round(i * sRate/BUFF_SIZE));
	}
	
	// Create SVGs for plots
	svg1 = init_raw_plot(time[time.length-1]);
	svg2 = init_FFT_plot([freqbins[0],freqbins[freqbins.length-1]]);
	svg3 = init_FFT_heat_plot(nCols, nBins);
	
    // Print some stuff
	console.log("number of notes in octave: " + octaveLength);
	//console.log(noteFreqs);
	//console.log(noteNames);
	console.log("interval = " + interval)
	console.log(freqbins)
	console.log("buffer size   = " + BUFF_SIZE);
	console.log("buffer length = " + Math.round(time[time.length-1]) + " ms");
	console.log("sample rate   = " + sRate + " Hz")
    
	var audioInput = null,
    microphone_stream = null,
    gain_node = null,
    script_processor_node = null,
    script_processor_analysis_node = null,
    analyser_node = null;

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


    //function process_microphone_buffer(event) {
    //   var i, N, inp, microphone_output_buffer;
    //    microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
    //}
	
		
    function start_microphone(stream){
	// Original audio is only available in this function.
        gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );

        microphone_stream = audioContext.createMediaStreamSource(stream);
        //microphone_stream.connect(gain_node); 

        //script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        //script_processor_node.onaudioprocess = process_microphone_buffer;

        //microphone_stream.connect(script_processor_node);

        // --- enable volume control for output speakers

        document.getElementById('volume').addEventListener('change', function() {

            var curr_volume = this.value;
            gain_node.gain.value = curr_volume;

            console.log("curr_volume ", curr_volume);
        });

        // --- setup FFT
        script_processor_analysis_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_analysis_node.connect(gain_node);

        analyser_node = audioContext.createAnalyser();
        analyser_node.smoothingTimeConstant = 0;
        analyser_node.fftSize = BUFF_SIZE;

        microphone_stream.connect(analyser_node);

        analyser_node.connect(script_processor_analysis_node);

        var buffer_length = analyser_node.frequencyBinCount;

		var nBins = buffer_length/2
		var freq_matrix = new Array(nCols);
		for (var i = 0; i<nCols; i++){
			freq_matrix[i] = new Uint8Array(nBins);
		}
			
		//console.log(freq_matrix)
		//console.log(freq_matrix.length)
		
        var array_freq = new Uint8Array(nBins);
        var array_time_signal = new Uint8Array(BUFF_SIZE);
        script_processor_analysis_node.onaudioprocess =  function() {
			if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

				// get the average for the first channel
				analyser_node.getByteFrequencyData(array_freq);
				analyser_node.getByteTimeDomainData(array_time_signal);
				
				freq_matrix.shift(); // Remove oldest freq_bins_column
				freq_matrix.push(array_freq); // Add new freq data
				console.log(freq_matrix)
			
				// draw the plots	
				//plot_line(array_freq, 1,'frequency');
				plot_line(time, array_time_signal); // Plot the raw input
				plot_FFT(freqbins,array_freq); // Plot the FFT results
				plot_heatmap(freq_matrix)
			}
		};
    }

}(); //  webaudio_tooling_obj = function()
