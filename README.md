# Project

> Name: Leander de Kraker<br>
> Stnr: 10423354<br>
> Date: 2017-1-9<br>

## Problem definition

The program will use the user's microphone to visualise the raw sound signal of the microphone. 
But it will also apply a Fast Fourier Transformation (FFT), this will show the user which sound frequencies are present in the sound. 
Frequency in Hz will be replaced by note names of musical instruments: A - G. So it should be possible to see what notes are being played in music easily.
Because the input is so dynamic I see a lot of story telling potential. 
Possible examples of storytelling: <br>
- This song has this awesome moment and I have no idea what actually happens. -> they went into a different scale, and the rithm changed.<br>
- I can produce higher pitched sound if I scream loudly (interesting).<br>
- That girl can sing higher notes than her boyfriend.<br>
- That person does not sing the notes that the main instruments plays, but it does not sound bad -> That person is playing in the same scale.<br>
- The cello uses vibrato and that changes the pitch of the sound, piano does not change pitch over time.
The best vibrato oscillates 4 times per second, but on average just a bit lower than the desired frequency.<br>
- Multiple tones are present in the sound even when only one piano key is being played!<br>
- If I try to increase my pitch, my voice skips a couple of notes. <br>
- I can't sing a pitch change of half an interval, except if I hear it.<br>

#### Questions the program can answer for the user.
- How high can I sing?
- How low can I sing?
- Can I sing what I hear?
- Which notes are being played (and when) in the music that I hear?
- What is the difference in sound spectrum when comparing, guitar, flute, piano and cello for example?
- Is my guitar in tune?
- Can I learn how to sing a particular note or note interval? (great potential for relative ear training)
- How does my basilar membrane vibrate (roughly) when there is sound?


#### Available features in program.
1. Microphone signal visualised. (Maybe phase locked at the start).
	- Gain slider. This is important because some microphones are really sensitive, and others can barely measure any sound. Also, the dB levels do vary a lot in practice. The gain will also be important for the frequency analysis.
2. Sound frequency spectrum visualised of latest sound window (2 different visualisation ways: rows or spiral, switching possible with buttons), with clear labels that show note name of respective frequency.
3. History of sound frequency spectrum, visualised with a heat map. The latest frequency spectrum column is shown in plot nr. 2.
	- slider to zoom in or out of sound frequency spectrum history graph (1 - 30 or 60 seconds).

- Option to toggle 'smoothing', an average of several FFTs is plotted instead of the latest one only. This will cause the sounds to disappear slower from the plot 'current'. Maybe with decreasing weight of analysis over time. (New analysis counts more in the plot than older analysis)
- If there is time to spare: 
	- A menu to add thicker lines to notes of a requested scale (A minor, A major, B minor...) (These scales mostly use the same specific notes)
	- Cochlea-like view, not with a barlike graph, but with vibrating 'membrane'. Shape resembles cochlea and sounds cause vibrations roughly in the correct place. This will need another slider which amplifies the vibrations.
		- Vibrations could be calculated with multiple methods: Implemented by a spring system or doing something to the FFT. Real effect of sound on cochlea needs to be investigated more before I can say how to do this for sure.
	- labels of frequency spectrum plots can be switched from note names to Hz scale with a button.
	- most prominent notes are printed under the history sound frequency plot.
- If possible: 
	- drop down menu with all microphones that can be selected.

## Sketches

![](doc/Sketch_001.jpg)
![](doc/Sketch_002.jpg)
![](doc/Sketch_003.jpg)

#### Data (sources & processing)
The data needed for the program has to be retrieved directly from the computer's microphone.
After the raw signal is retrieved, it needs to be put into a buffer/ array. 
It might be necessary to downsample the signal to keep the program running smoothly. Downsampling will mostly effect the frequency detail in low frequencies, which is not a big problem.
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

#### necessary API's.
getUserMedia API is necessary to get microphone input.

#### technical problems or limitations that could arise during development and possible help for them.
1. No way to have a dropdown menu with the available microphones.<br>
Searching on the internet is necessary.

1. Problems connecting to microphone.<br>
I've already found javascript code that is able to access and save data from your microphone. Should be okay.

2. Problems buffering the microphone<br>
Look at more examples.

3. Problems plotting a bar/ line graph with spiralling axis.<br>
This is going to be difficult.

4. Problems plotting a heatmap efficiently with D3. <br>
Search more D3 heatmaps.

5. Updating the plots.<br>
Updating the plots should be done around 10-20 times per second. There are a lot of examples using continously changing plots.

6. Calculating FFT's in javascript.<br>
This should not be too hard, I've already got examples.

7. Problems with layout of the webpage.<br>
Ask Assistants and fellow students.

8. Placing labels correctly.<br>
x-axis will need to be transformed and the label positions need to be calculated. Luckily there are lots of examples how to create desired X-labels and tick placements.

9. Difficulty changing the processing steps with buttons or sliders on the webpage.<br>
That is going to be relatively new. But there are good tutorials on how to do that and the other students/ assistants can help me.


#### Similar applications
A great example for me is the Real Time Spectro program and other free music software written by Norm Spier: [nasmusicsoft](http://nasmusicsoft.com/Spectratune.php "Norm Spier's site"). 
RealTimeSpectro also accesses the microphone and implements a row and spiral visualisation for the sound frequency plots. However, his program calculates the frequency power with a spring system simulation, not an FFT.

Another program by Norm Spier, SpectoTunePlus, is able to load sound files and shows a frequency spectrum history.
Norm Spier has written a lot of helpful theoretical, practical and nice-to-know information on his website. Both on how the program works, and what it shows with the analyses.
