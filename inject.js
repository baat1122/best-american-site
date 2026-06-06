const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const sliderHtml = fs.readFileSync('slider.html', 'utf8');

const startTag = '<div class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 lg:-mx-8 lg:px-8 custom-scrollbar" id="servicesSlider">';
const startIdx = content.indexOf(startTag) + startTag.length;

// Find the matching closing div of the slider.
const endIdx = content.indexOf('</div>\n            </div>\n        </section>', startIdx);

if (startIdx > startTag.length && endIdx > -1) {
    const newContent = content.slice(0, startIdx) + '\n' + sliderHtml + '                ' + content.slice(endIdx);
    fs.writeFileSync('index.html', newContent);
    console.log('Replaced slider content in index.html');
} else {
    console.error('Could not find slider boundaries.');
}
