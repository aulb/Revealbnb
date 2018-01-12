window.addEventListener('load', function(event) {
	chrome.runtime.getBackgroundPage(function(eventPage) {
		eventPage.getPageDetails(onPageDetailsReceived);
	});
});

function onPageDetailsReceived(pageDetails) {
	// Unspread pageDetails
	const { booking_details_endpoint, query_params } = pageDetails; 

	// // Ajax request here
	const xhr = new XMLHttpRequest();
	const endpoint = constructGetUrl(booking_details_endpoint, query_params);
	xhr.open('GET', endpoint, true);
	xhr.onreadystatechange = function() {
		main(xhr.response, xhr.readyState);
	}
	xhr.send();
}

function error() {
	const element = document.getElementById('root');
	element.textContent = 'error';
}

function updateTruePrice(response) {
	const element = document.getElementById('root');
	const truePrice = getTruePriceOfListing(response);
	const currency = getCurrency(response);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
	});
	element.textContent = formatter.format(truePrice);
	element.className = 'price';
}

function main(response, state) {
	if (state == 4) {
		updateTruePrice(JSON.parse(response));
	} else {
		error();
	}
}

function constructGetUrl(baseUrl, queryParams) {
	let queryString = '';
	for (let key in queryParams)  {
		// Skip empty params
		if (queryParams[key]) {
			queryString += `${key}=${encodeURIComponent(queryParams[key])}&`;
		}
	}

	return `${baseUrl}?${queryString}`;
}

function getTruePriceOfListing(response) {
	const bookingDetails = response.pdp_listing_booking_details[0];
	let truePrice = 0;
	if (bookingDetails.price) {
		const nights = bookingDetails.nights;
		const totalPrice = bookingDetails.price.total.amount;
		truePrice = totalPrice / nights;
	} else {
		truePrice = bookingDetails.p3_display_rate.amount;
	}

	return truePrice;
}

function getCurrency(response) {
	const bookingDetails = response.pdp_listing_booking_details[0];
	return bookingDetails.p3_display_rate.currency;
}
