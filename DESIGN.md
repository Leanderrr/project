# Design

> Name: Leander de Kraker<br>
> Stnr: 10423354<br>
> Date: 2017-1-11<br>

## API's
getUserMedia API is necessary to get microphone input.
Web Audio API could also be used.

## Program overview
![](doc/setup_program.png)

## UI

![](doc/Sketch_001.jpg)
![](doc/Sketch_002.jpg)
![](doc/Sketch_003.jpg)

#### Available features in program.
1. Microphone signal visualised. (Maybe phase locked at the start).
	- Gain slider. This is important because some microphones are really sensitive, and others can barely measure any sound. Also, the dB levels do vary a lot in practice. The gain will also be important for the frequency analysis.
2. Sound frequency spectrum visualised of latest sound window (2 different visualisation ways: rows or spiral, switching possible with buttons), with clear labels that show note name of respective frequency.
3. History of sound frequency spectrum, visualised with a heat map. The latest frequency spectrum column is shown in plot nr. 2.
	- slider to zoom in or out of sound frequency spectrum history graph (1 - 30 or 60 seconds).

- Option to toggle 'smoothing', an average of several FFTs is plotted instead of the latest one only. This will cause the sounds to disappear slower from the plot 'current'. Maybe with decreasing weight of analysis over time. (New analysis counts more in the plot than older analysis)
- If there is time to spare: 
	- A menu to add thicker lines to notes of a requested scale (A minor, A major, B minor...) (These scales mostly use the same specific notes)
	- Pauze button which stops microphone recording and plot updating.
	- Cochlea-like view, not with a barlike graph, but with vibrating 'membrane'. Shape resembles cochlea and sounds cause vibrations roughly in the correct place. This will need another slider which amplifies the vibrations.
		- Vibrations could be calculated with multiple methods: Implemented by a spring system or doing something to the FFT. Real effect of sound on cochlea needs to be investigated more before I can say how to do this for sure.
	- labels of frequency spectrum plots can be switched from note names to Hz scale with a button.
	- most prominent notes are printed under the history sound frequency plot.
- If possible: 
	- drop down menu with all microphones that can be selected.

	
#### Data (sources & processing)
The data needed for the program has to be retrieved directly from the computer's microphone.
After the raw signal is retrieved, it needs to be put into a buffer/ array. 
It might be necessary to downsample the signal to keep the program running smoothly. Downsampling will mostly effect the frequency detail in high frequencies, which is not a big problem.
The signal is put through a fast fourier transformation (FFT). The x-axis of the resulting frequency spectrum will probably have to be log transformed.
Names of notes are retrieved by putting the A of the 4th octave (A4) to 440 Hz. The frequency of notes above A4 can be calculated because each half step increases by the 12th root of 2 (around 1.0594630). (one octave higher the sound frequency is twice as high)
The latest FFT results are stored in a matrix which contains the FFT results of the latest 30 or 60 seconds.

#### what separate parts of the application can be defined (decomposing the problem) and how these should work together.
- Getting Microphone input.
	- If possible: drop down menu to select microphone.
- Processing microphone input with FFT. 
	- If necessary: Slider to change analysis time window for FFT, and subsequent frequency spectrum plotting.
	- Different ways of processing need to be possible by changing sliders and buttons. 
	- Latest processed data needs to be added to matrix which contains sound frequency history for the history plot.
- Plotting raw input.
- Plotting current frequency spectogram.
	- Button to switch current frequency spectogram view. This might have to change the way the processing works if cochlea view will be implemented.
- Plotting history frequency spectogram
	- slider to zoom in or out.
