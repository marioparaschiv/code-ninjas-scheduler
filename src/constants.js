import moment from 'moment';

export const BASE_HEADERS = {
	'accept': 'application/json, text/plain, */*',
	'accept-language': 'en-GB,en;q=0.9',
	'content-type': 'application/json',
	'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
	'sec-ch-ua-mobile': '?0',
	'sec-ch-ua-platform': '"Windows"',
	'sec-fetch-dest': 'empty',
	'sec-fetch-mode': 'cors',
	'sec-fetch-site': 'same-origin',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export const BASE_URL = 'https://dojo.code.ninja/api';

export const START_DATE = moment.utc().add(1, 'M').startOf('month');
export const END_DATE = moment.utc().add(1, 'M').endOf('month');