% Image proces funny stuff
% Leander de Kraker
% 2016-7-2
% Correct a load of pictures to almost white overall, removing lighting
% gradient
clc
loadmap = 'D:\Documents\GitHub\project\doc';
savemap = 'D:\Documents\GitHub\project\doc';

% Get file names
files = dir([loadmap '\*.jpg']);
files = {files.name};

%% Create new image names
npict = length(files);
prename = 'Sketch_';
postname = '.jpg';
namerange = 1:npict;

newname = cell(npict,1);
for i = 1:npict
    number = sprintf('%3.0i',namerange(i));
    number = regexprep(number, ' ', '0');
    newname{i} = [prename,number,postname];
end

% darkening factor: higher value is darker dark things
darken = 1; % 1 -> non-brightest = 2x less bright

succes = 0; % No file are loaded yet
cutcounter = 0; % No files were cut
for i = 1:npict
    % Try loading picture

    cd(loadmap)
    photo = imread(files{i});
    succes = succes+1;

    
    % Color correcting the image
    photodim = size(photo);
    photodim = photodim([1,2]);
 
    % median filtered image to see background lighting
    % median filter detail Saves an exponential amount of time
    tic
    detail = 5; % 1 is original detail
    
    % changing dimensions so the image can be filtered
    newphotodim(1) = photodim(1)-mod(photodim(1),detail);
    newphotodim(2) = photodim(2)-mod(photodim(2),detail);
    if photodim(1) ~= newphotodim(1)
        fprintf('changed height: %d px -> %d px\n', photodim(1),newphotodim(1))
        cutcounter = cutcounter + 1;
    end
    if photodim(2) ~= newphotodim(2)
        fprintf('changed width:  %d px -> %d px\n', photodim(2),newphotodim(2))
        cutcounter = cutcounter + 1;
    end
    photo = photo(1:newphotodim(1),1:newphotodim(2),:);
    photodim = size(photo);
    photodim = photodim([1,2]);
    
    filts = 300./detail; % filtersize, bigger is more vague
    background = uint8(zeros([photodim./detail,3]));
    for j = 1:3 % for every color seperately
        background(:,:,j) = medfilt2(photo(1:detail:end,1:detail:end,j), [filts, filts],'symmetric');
    end
    background = imresize(background,detail);
 
    %  Computing what the lighting correction will be:
    finalhue = max(max(max(background))); % Correction to highest original value
    finalhue = 256; % Correction to highest value possible (256)
    huecorr = finalhue - background;
 
    photocorr = photo+huecorr; % Adjusting lighting! That was fast. yes

    
    % darkening the new picture
    photocorr2 = photocorr - (finalhue-photocorr).*darken;

     % Saving
    cd(savemap)
    imwrite(photocorr2, newname{i}, 'Quality', 95) % Save
    
    timed(i) = toc;
    fprintf('saved picture %2.0f/%2.0f, time: %.5fsec\n\n', succes, i, timed(i))
end

figure()
subplot(141)
imagesc(photo)
title('original photo')
subplot(242)

imagesc(background(1:detail:end,1:detail:end,:)) % smaller version recreation
title('filtered background image')
subplot(246)
imagesc(huecorr)
title('correction of luminance')
subplot(143)
imagesc(photocorr)
title('corrected photo')
subplot(144)
imagesc(photocorr2)
title(sprintf('darkened corrected photo (darken factor = %.1f)', darken))

fprintf('dimensions cut: %d = %.1f procent.\n', cutcounter, cutcounter/(npict*2)*100)
fprintf('total processing time: %f sec.\n', sum(timed))