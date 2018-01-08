// Called during popup load (when popup icon is clicked)
function getPageDetails(callback) {
	chrome.tabs.executeScript(null, {file: 'src/get_content.js'});
	chrome.runtime.onMessage.addListener(function(message) { callback(message); });
}
