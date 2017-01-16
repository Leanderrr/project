
var BUFF_SIZE = 2**10;

// Calculate time line (x-axis)
var time = 	[];
var srate = 44.1; // sample rate in kHz
for  (var i = 1; i <= BUFF_SIZE; i++) {
   time.push(i/srate);
}

var width = 500
	height = 170
	margin = {top: 10, left: 50, bottom: 60, right: 50};
	
var svg = d3.select('body').append('svg')
		.attr('width',width)
		.attr('height',height)
		.append('g')
			.attr('id', 'raw_line_canvas')
			.attr('width', width - margin.left - margin.right)
			.attr('height',height - margin.top - margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var xScale = d3.scale.linear().domain([0, time[time.length-1]]).range([0, width])
	yScale = d3.scale.linear().domain([-256/2, 256/2]).range([height - margin.top - margin.bottom, 0]);

// Axis properties
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
var yAxis = d3.svg.axis()
	.ticks(3)
    .scale(yScale)
    .orient("left");
	
// Add axis line plot
svg.append("g")
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



var webaudio_tooling_obj = function () {
	
	// The audio object
    var audioContext = new AudioContext();

    // Print some stuff
	console.log("buffer size = " + BUFF_SIZE);
	console.log("buffer length = " + Math.round(time[time.length-1]) + " ms");
	
    var audioInput = null,
    microphone_stream = null,
    gain_node = null,
    script_processor_node = null,
    script_processor_analysis_node = null,
    analyser_node = null;

    if (!navigator.getUserMedia){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
	};

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

    // ---
	
    function plot_line(time, given_typed_array){
		var line = d3.svg.line()
			.x(function(d, i) {
				return xScale(time[i])
			})
			.y(function(d, i) {
				//console.log(y(given_typed_array[i]));
				return yScale(given_typed_array[i]-(256/2))
			})
			console.log(line)
			svg.select("#raw_line").remove()
			svg.append("path")
			  .data([time, given_typed_array])
			  .attr("class", "line")
			  .attr("id", "raw_line")
			  .attr("d", line);
		//console.log(label);
		//console.log(given_typed_array);
		//document.writeln(given_typed_array);
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
				plot_line(time, array_time_domain); // store this to record to aggregate buffer/file
			}
		};
    }

}(); //  webaudio_tooling_obj = function()
