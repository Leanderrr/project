# Process book

Process book for the programming minor eindproject.

> Name: Leander de Kraker<br>
> Stnr: 10423354<br>
> Start date: 2017-1-11<br>

## Week 1. day 3. 2017-1-11

- Finish design file.<br>
- Look at more examples for audio recording code.<br>
-  Make my own microphone recording webpage.<br>
- [This page](https://webaudiodemos.appspot.com/input/index.html) convinced me that the project can in theory work in realtime in javascript and HTML.
But the frequency data does not look good; the low frequencies are always dominating and you can't really see the frequency change when you do music.
This is because the frequency axis is linear, and the analysis time is very short so not enough sound is taken to really see how much the low frequencies are present.

![](doc/Realtime_Audio_Example.png)

- The Spectratune software and [the creators site](http://nasmusicsoft.com/) are still my big inspiration.

![](doc/spectratune.png)


## Week 1, day 4. 2017-1-12

Planned:<br>
- Take microphone with me, test selection of two audio sources<br>
- Save microphone recording<br>
- Fix gain of audio<br>

Reality: <br>
- Took microphone with me, selection audio source seems impossible to implement.<br>
- Fast Fourier Transform audio signal<br>


## Week 1, day 5. 2017-1-13

Planned:<br>
- Fast Fourier Transform audio signal<br>
- Time Fast Fourier Transform<br>

Reality:<br>
- We put almost all our time into the presentation<br>
- Timing doesn't seem to be necissary.<br>
- The volume seems to scale quite logarithmically, so high enough values are easy to reach in almost all cases. 
I start to think adding a gain slider might not be necissary.

## Week 2, day 1. 2017-1-16

Planned:<br>
- Plot buffer output<br>
Reality:<br>
- Plotted buffer output!<br>
- Plotted FFT results<br>


## Week 2, day 2. 2017-1-17

Planned:<br>
- Change Plot FFT<br>

Reality:<br>
- Looked into data represented in FFT plot. <br>
- Log transformed x-axis.<br>
- Calculated note name frequencies.<br>
- Put note name labels on correct place in FFT plot.<br>
- Looked into clearing up FFT results with gain.<br>

![](doc/WIP_01_18.jpg)

## Week 2, day 3. 2017-1-18

Planned:<br>
- change Plot FFT, Stack plots.<br>
- Save FFT into matrix and plot heatmap.<br>

Reality:<br>
- At home and sick<br>

## Week 2, day 4. 2017-1-16

Planned:<br>
- Plot heatmap <br>
- Add interactivity sliders (gain, zoom, analysis-time)<br>

Reality: <br>
- Saved FFT into matrix<br>
- Plotted heatmap<br>
- Log transformed heatmap y/freq-axis<br>

![](doc/WIP_01_19.jpg)

## Week 2, day 5. 2017-1-17

Planned:<br>
- Add interactivity sliders (gain, zoom, analysis-time)<br>
- Add axis to heatmap<br>

Reality:<br>
- Spent most time for presentation again.<br>

## Week 3, day 1.

Planned:<br>
- Add interactivity tick (smoothed view)<br>
- Implement spiral FFT plot.<br>
- Add buttons to switch plot type.<br>

Reality:<br>
- Trouble with FFT spiral plot and stacking plot<br>
- Made an implementation for spiral plotting in Matlab<br>

![](doc/spiral_tests.png)

## Week 3, day 2.

Planned:<br>
- Spiral FFT plot.<br>

Reality:<br>
- Heatmap placement corrected and axis added<br>
- Correct frequency/y-axis implemented<br>
- Correct x-axis implemented<br>
- Zoom slider for heatmap implemented!<br>

![](doc/WIP_01_24.jpg)

## Week 3, day 3.

Planned: <br>
- Spiral FFT plot.<br>

Reality: <br>
- Fixed small bug that caused heatmap to plot incorrectly and boring.
- Inproved performance of Matlab spiral plot.
- Tried to implement 1-octave per spiral spiral in Matlab, but failed.

## Week 3, day 4.

Planned: <br>
- Spiral FFT plot.<br>
- Smoothing signal option.<br>

Reality: <br>
- Fixed small bug that caused frequencies in the heatmap to be an octave to low.<br>
- Made the axis prettier.<br>
- Implemented stacking of FFT results!<br>
- Implemented temporal walking average smoothing with switch button!<br>
- Decided Spiral plot with each rotation being an octave is not going to happen in D3. 
Luckily the linear view is looking good already, so that can be used as a second plot.

![](doc/WIP_01_26.jpg)

## Week 3, day 5.

- Presentation

## Week 4, day 1.

Planned:<br>
- Bootstrap<br>
Reality:<br>
- Bootstrap isn't helping much, I do not like the results and how much you need to add to get those results.<br>

## Week 4, day 2

Planned: <br>
- Pause button.<br>
- Position plots nicely.<br>
Reality: <br>
- Implemented pause function & button.<br>
- Published GitHub site -> weird 404 bug. -> Disapeared, working now!<br>
- Positioned plots.<br>

## Week 4, day 3: FEBRRUARY

Planned: <br>
- Finish positioning stuff.<br>
- Add info buttons and info text.<br>
- (Maybeee) Add hover over line that also appears on heatmap plot.<br>
Reality: <br>
- Finished position stuff.<br>
- Added info buttons and text.<br>
- Made the buttons nicer and more in-style.<br>
- Added header.<br>

![](doc/WIP_02_01.jpg)

## Week 4, day 4

Planned: <br>
- Maybe change info into a pop-up hover, because scrolling is no fun.<br>
- (Maybeee) Add hover over line that also appears on heatmap plot.<br>
- Make report<br>
- Practice presentation<br>
Reality: <br>
- Wrote report. <br> 
- Fixed little bug that caused the frequency data to be shifted one bin, 
causing sounds to look as if they were a little bit to high in frequency. This was caused because the frequency axis goes from zero to higher, 
but taking log(0) crashes D3, so I deleted that bin, shifting the frequency data on the x-axis. To fix it I added another bin with the first frequency as value. <br>
- Changed the way of cutting the octaves for stacking the frequency plot, so now the notes appear more in straight columns.

## Week 4, day 5

Presentation
Ending!
