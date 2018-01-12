// Called during popup load (when popup icon is clicked)
function getPageDetails(callback) {
	chrome.tabs.executeScript(null, {file: 'src/getContent.js'});
	chrome.runtime.onMessage.addListener(function(message) { callback(message); });
}
