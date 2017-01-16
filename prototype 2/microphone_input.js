
var BUFF_SIZE = 2**13;


// INITIALIZE RAW SIGNAL PLOT
function init_raw_plot(maxX) {
	var width = 500
		height = 170
		margin = {top: 10, left: 50, bottom: 60, right: 30};
	
	var svg1 = d3.select('body').append('svg')
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
	svg1.append("g")
	  .attr("id","x-axis")
	  .attr("transform", "translate(0," + ((height-margin.bottom)-margin.top) + ")")
	  .call(xAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("y", 25)
		.attr("dy", ".71em")
		.attr("x", width-margin.right)
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("time (ms)");
	
	// Add y axis with label
	svg1.append("g")
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
		
	return {"svg":svg1,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale}
}

// INITIALIZE FFT PLOT
function init_FFT_plot(maxX) {
	var width = 500
		height = 500
		margin = {top: 10, left: 50, bottom: 60, right: 30};
	
	var svg2 = d3.select('body').append('svg')
			.attr('width',width)
			.attr('height',height)
			.attr('id','FFT_svg')
			.append('g')
				.attr('id', 'FFT_canvas')
				.attr('width', width - margin.left - margin.right)
				.attr('height',height - margin.top - margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
	var xScale = d3.scale.linear().domain([0, maxX]).range([0, width - margin.left - margin.right])
		yScale = d3.scale.linear().domain([0, 256]).range([height - margin.top - margin.bottom, 0]);

	// Axis properties
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.ticks(3)
		.scale(yScale)
		.orient("left");
		
	// Add x axis with label
	svg2.append("g")
	  .attr("id","x-axis")
	  .attr("transform", "translate(0," + ((height-margin.bottom)-margin.top) + ")")
	  .call(xAxis)
	.append("text")
		//.attr("transform", "translate(0, " + -height + ")")
		.attr("y", 25)
		.attr("dy", ".71em")
		.attr("x", width-margin.right)
		.style("text-anchor", "end")
		.style("font-size", "15px")
		.text("frequency (bin?)");
	
	// Add y axis with label
	svg2.append("g")
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
		
	return {"svg":svg2,"xAxis":xAxis,"yAxis":yAxis,"xScale":xScale,"yScale":yScale}
}

//obj.key ====== obj['key']

// AUDIO START
var webaudio_tooling_obj = function () {
	
	// The audio object
    var audioContext = new AudioContext();
	
	sRate = audioContext.sampleRate;
	
	// Calculate time line (x-axis RAW) and calculate frequency bin values (x-axis FFT)
	var time = 	[];
	var freqbins = [];
	for  (var i = 1; i <= BUFF_SIZE; i++) {
	   time.push(i/sRate*1000);
	}
	for  (var i = 1; i <= BUFF_SIZE/2; i++) {
	   freqbins.push(i * sRate/BUFF_SIZE);
	}
	// Create SVGs for plots
	svg1 = init_raw_plot(time[time.length-1]);
	svg2 = init_FFT_plot(freqbins[freqbins.length-1]);

    // Print some stuff
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
	
	function plot_FFT(freq_bins, freq_values){
		var  line = d3.svg.line()
			.x(function(d, i) {
				return svg2.xScale(freq_bins[i])
			})
			.y(function(d, i) {
				//console.log(freq_values[i])
				return svg2.yScale(freq_values[i])
			})
			svg2.svg.select("#FFT_line").remove()
			svg2.svg.append("path")
			  .data([freq_bins, freq_values])
			  .attr("class", "line")
			  .attr("id", "FFT_line")
			  .attr("d", line);
			  console.log("number of freq bins: " + freq_bins.length);
			  console.log("number of freq vals: " + freq_values.length);
	}

    function process_microphone_buffer(event) {
        var i, N, inp, microphone_output_buffer;
        microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
    }
	
		
    function start_microphone(stream){
	// Original audio is only available in this function.
        gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );

        microphone_stream = audioContext.createMediaStreamSource(stream);
        microphone_stream.connect(gain_node); 

        script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_node.onaudioprocess = process_microphone_buffer;

        microphone_stream.connect(script_processor_node);

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

        var array_freq_domain = new Uint8Array(buffer_length);
        var array_time_domain = new Uint8Array(BUFF_SIZE);

        script_processor_analysis_node.onaudioprocess =  function() {
			// get the average for the first channel
			analyser_node.getByteFrequencyData(array_freq_domain);
			analyser_node.getByteTimeDomainData(array_time_domain);

			// draw the spectrogram
			if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
				//plot_line(array_freq_domain, 1,'frequency');
				plot_line(time, array_time_domain); // Plot the raw input
				plot_FFT(freqbins,array_freq_domain); // Plot the FFT results
			}
		};
    }

}(); //  webaudio_tooling_obj = function()
