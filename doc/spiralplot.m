% Plotting spiral
clear all
close all
figure
turns = 10;

while turns>0
    
    turns=turns-0.025; %The number of turns the spiral will have

    x=[-1*pi*turns : 0.02 : pi*turns];
    r=[0:1/(length(x)-1):1];


    X=sin(x).*r;  Y=cos(x).*r;
    hold off
    plot(X,Y,'-k','LineWidth',2)
    axis off square
    pause(0.05)
end