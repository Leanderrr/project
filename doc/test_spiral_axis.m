% Doing spiral axis in Matlab for testing D3 shit
% Leander
% 2017-1-23
%
%
clear
close all
clc

n_circles = 5; % Number of times the axis will go round
ending = n_circles*2*pi;
x = 0:0.05:ending; % The linear x axis
% spiraller will decrease the earlier sin values, causing the line to come
% from 0,0.
spiraller = linspace(0,1,length(x));
xAxis = sin(x).*spiraller; % create 2D x coordinates for the linear axis
yAxis = cos(x).*spiraller; % create 2D y coordinates for the linear axis

Axisamp = abs(1);
figure
for i= 1:100 % Press ctrl+ c to stop
    y = rand(1,length(x))./n_circles; % The 'data' ranging from 0 to 0.5
    % Calculate x and y positions for the 'data'
    Yx = y.*sin(x) + xAxis;
    Yy = y.*cos(x) + yAxis;
    
    % Matrixs to enable line drawing
    xes = [xAxis',Yx'];
    yes = [yAxis',Yy'];

    % -- plotting --
    
    subplot(221)
    hold off
    plot(xAxis, yAxis) % Clean axis
    hold on
    plot(Yx,Yy,'r') % data
    xlim([-1.5 1.5])
    ylim([-1.5 1.5])
    for i = 1:length(yes) % For some reason we really need a for loop here
        line(xes(i,:),yes(i,:),'color','r','linewidth',1.5)
        % pause(0.025)
    end
    xlabel('xAxis')
    ylabel('yAxis')
    title('data on spiral axis')


    subplot(222)
    plot(x,y,'r')
    xlabel('x')
    ylabel('y')
    title('data on normal axis')
    ylim([0 0.5])
    xlim([0 ending])
    pause(0.001)
%     subplot(223)
%     hold off
%     plot(x, xAxis)
%     hold on
%     plot(x,Yx, 'b')
%     plot(x, yAxis, 'r')
%     plot(x,Yy,'r')
%     plot(x, zeros(1,length(x)),'--k')
%     xlabel('x')
%     ylabel('Axis amplitude')
%     title('data and axis spiral coordinates')
%     legend('x-axis','x-data','y-axis','y-data')
%     ylim([-pi pi])
%     xlim([0 ending])

%     % For filling one line always needs to be above the other one. So we need
%     % to switch half of the y values around
%     Yfill = zeros(2,length(Yy));
%     for i = 1:length(Yy)
%         if Yy(i) < yAxis(i)
%             Yfill(1,i) = Yy(i);
%             Yfill(2,i) = yAxis(i);
%         else
%             Yfill(1,i) = yAxis(i);
%             Yfill(2,i) = Yy(i);
%         end
%     end
%     Xfill1 = [x,fliplr(x)];
%     Yfill1 = [Yfill(1,:),fliplr(Yfill(2,:))];
% 
%     
%     subplot(224)
%     hold off
%     fill(Xfill1,Yfill1,'b')
%     hold on
%     plot(x,Yfill,'linewidth',1.5)
%     title('filling is difficult')
%     xlim([0 ending])
%     pause(0.05)
end