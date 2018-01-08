sendResponseToPopup();

/* 
 * Helper functions below___
 */

function sendResponseToPopup() {
	/* 
	 * Content script's sole job is to fetch data and pass it to the popup page.
	 */
	const url = new URL(window.location.href);
	const listingId = url.pathname.split('/').pop();
	const apiKey = getApiKey();
	const defaultFormat = 'for_web_with_date';
	const searchParams = url.searchParams;
	const bookingDetailsEndpoint = `${url.origin}/api/v2/pdp_listing_booking_details`;
	const queryParams = {
		'listing_id': listingId,
		'location':   searchParams.get('location'),
		'check_in':   searchParams.get('check_in'),
		'check_out':  searchParams.get('check_out'),
		'guests':     searchParams.get('guests'),
		'number_of_children': searchParams.get('children'),
		'number_of_infants':  searchParams.get('infants'),
		'_format': defaultFormat,
		'key': apiKey
	}

	chrome.runtime.sendMessage({
		'booking_details_endpoint': bookingDetailsEndpoint,
		'query_params': queryParams
	});
}

function getApiKey() {
   const metas = document.body.getElementsByTagName('meta'); 
   for (let i = 0; i < metas.length; i++) { 
   		// Other ways to get includes iterating through and regex-ing through the content for
   		// 'api_config' string
   		if (metas[i].id === '_bootstrap-layout-init') {
   			return JSON.parse(metas[i].content).api_config.key;
   		} 
   } 

    return '';
}
