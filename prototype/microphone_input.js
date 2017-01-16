

var webaudio_tooling_obj = function () {
	function plot_line(array){	
		console.log("HERE IS THE ARRAAAAAAAAAAAAAY: ");
		console.log(array);
		d3.select('#raw_signal_svg').remove("path");
		d3.select('#raw_signal_svg').append("path")
		  .data(array)
		  .attr("class", "line")
			//.attr("d", data]);
	};
   
	// Initialize line plot
	function initialize_plot(){
		var svgsize = [800,100];

		var margin = {top: 20, left: 20, bottom: 20, right: 20},
			width = svgsize[0] - margin.left - margin.right,
			height = svgsize[1] - margin.top - margin.bottom;

		var svg = d3.select("body").append("svg")
					.attr("id","raw_signal_svg")
					.attr("width",svgsize[0])
					.attr("height",svgsize[1])
					.append("g") // add plot to svg 'canvas'
						.attr('id','line')
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	};
	
	initialize_plot();

	var audioContext = new AudioContext();
	console.log("audio is starting up ...");
	
	var BUFF_SIZE = 16384;

	var audioInput = null,
		microphone_stream = null,
		gain_node = null,
		script_processor_node = null,
		script_processor_fft_node = null,
		analyserNode = null;

	if (!navigator.getUserMedia){
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
						  navigator.mozGetUserMedia || navigator.msGetUserMedia;
	}
	// log the id's and labels of found media devices.
	navigator.mediaDevices.enumerateDevices()
	.then(function(devices) {
	  devices.forEach(function(device) {
		if (device.kind == "audioinput"){console.log(device);}
	  });
	})

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
	function process_microphone_buffer(event) {
		var i, N, inp, microphone_output_buffer;
		microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
		console.log("I don't know how this is possible");
		// microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE
		console.log(microphone_output_buffer);
	}
	
	function print_fft() {
		// get the average for the first channel
		var array = new Uint8Array(analyserNode.frequencyBinCount); // preallocation
		analyserNode.getByteFrequencyData(array); // fill with FFT result data
		
		// draw the spectrogram
		if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
			plot_line(array);
			//show_some_data(array, 5, "from fft");
		}
	};
	  
	function start_microphone(stream){

		gain_node = audioContext.createGain();
		gain_node.connect( audioContext.destination );

		microphone_stream = audioContext.createMediaStreamSource(stream);
		microphone_stream.connect(gain_node); // connect microphone to gain? -> speaker gives sound

		script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);

		microphone_stream.connect(script_processor_node);
		//console.log(script_processor_node);

		// --- enable gain control for <output speakers and> FFT
		document.getElementById('gain').addEventListener('change', function() {
			var curr_gain = this.value;
			gain_node.gain.value = curr_gain;
			console.log("curr_gain ", curr_gain);
		});

		// --- setup FFT
		script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
		script_processor_fft_node.connect(gain_node);

		analyserNode = audioContext.createAnalyser();
		analyserNode.smoothingTimeConstant = 0;
		analyserNode.fftSize = 2048;

		microphone_stream.connect(analyserNode);
		
		analyserNode.connect(script_processor_fft_node);
		console.log(script_processor_node.onaudioprocess.event.inputBuffer.getChannelData(0));
		
		script_processor_node.onaudioprocess = process_microphone_buffer;
		// script_processor_fft_node.onaudioprocess = print_fft;
		
	}

}(); //  webaudio_tooling_obj = function()
