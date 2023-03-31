const API_KEY = 'YOUR API KEY';
const SERVER = 'YOUR SERVER';
// Main function to fetch and display data
async function main() {
    // Function to fetch data from given API URL
    async function fetchData(apiUrl) {
        const req = new Request(apiUrl);
        req.headers = {
            "Content-Type": "application/json"
        };
        const json = await req.loadJSON();
        return json;
    }
    
    // Function to keep a specified number of random elements in the array
    function keepRandomElements(array, count) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        array.splice(count);
    }
    
    // Define date variables
    const currentDate = new Date();
    const sixDaysInMilliseconds = 6 * 24 * 60 * 60 * 1000;
    const futureDate = new Date(currentDate.getTime() + sixDaysInMilliseconds);
    const start = currentDate.toISOString();
    const end = futureDate.toISOString();
    
    
    // Fetch data from APIs
    const json = await fetchData(`${SERVER}/api/v3/calendar?apikey=${API_KEY}&start=${start}&end=${end}&includeEpisodeImages=true&includeSeries=true`);
    
    
    
    
    // Randomize and limit the elements if necessary
    if (json.length > 3) {
        keepRandomElements(json, 3);
        
    }
    
    // Create a widget
    let widget = new ListWidget();
    widget.backgroundColor = new Color('#222');
    widget.addSpacer(20);
    
    // Display data in the widget
    if (json.length === 0) {
        const hStack = widget.addStack();
        hStack.layoutHorizontally();
        hStack.addSpacer(20);
        const noNewEpisodes = hStack.addText('No New Episodes');
        noNewEpisodes.font = Font.boldSystemFont(60);
        noNewEpisodes.textColor = Color.white();
    } else {
        for (const item of json) {
            const seriesTitle = item.series.title;
            const seasonNumber = item.seasonNumber;
            const posterImage = item.series.images.find((image) => image.coverType === 'poster');
            const posterUrl = posterImage ? posterImage.url : 'No poster URL found';
            const episodeTitle = item.title;
            const episodeNumber = item.episodeNumber;
            const episodeOverview = item.overview || '';
            const hStack = widget.addStack();
            hStack.layoutHorizontally();
            hStack.addSpacer(20);
            
            const req = new Request(posterUrl);
            const image = await req.loadImage();
            const poster = hStack.addImage(image);
            poster.imageSize = new Size(60, 80);
            
            hStack.addSpacer(10);
            const vStack = hStack.addStack();
            vStack.layoutVertically();
            
            const title = vStack.addText(seriesTitle);
            title.font = Font.boldSystemFont(16);
            title.textColor = Color.white();
            
            const episodeInfo = `S${seasonNumber}E${episodeNumber}: ${episodeTitle}`;
            const episodeText = vStack.addText(episodeInfo);
            episodeText.font = Font.systemFont(9);
            episodeText.textColor = Color.gray();
            vStack.addSpacer(10);
            
            const episodeTextOverview = vStack.addText(episodeOverview);
            episodeTextOverview.font = Font.systemFont(9);
            episodeTextOverview.textColor = Color.gray();
            vStack.addSpacer(10);
            
            hStack.addSpacer(); // Add this to push to the left size
            widget.addSpacer(20);
            
        }
    }
    
    // Display the widget
    if (config.runsInWidget) {
        Script.setWidget(widget);
        Script.complete();
    } else {
        await widget.presentLarge();
    }
}

// Call the main function
main();
