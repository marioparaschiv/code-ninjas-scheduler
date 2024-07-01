import { BASE_HEADERS, BASE_URL, END_DATE, START_DATE } from './constants';
import config from '../config.json' assert { type: 'json' };
import moment from 'moment';

const { COOKIE, DOJO_ID, SCHEDULE } = config;

export async function addSessions(sessions) {
	if (!sessions.length) return;

	const res = await fetch(BASE_URL + '/scheduler/admin/', {
		method: 'POST',
		body: JSON.stringify(sessions),
		headers: {
			...BASE_HEADERS,
			'Cookie': COOKIE,
			'Referer': `https://dojo.code.ninja/scheduler/builder/${DOJO_ID}/new`,
		}
	});

	console.log(`[DEBUG] Got status code of ${res.status}: ${res.statusText} while adding sessions`);
	console.log('[DEBUG] Publishing all sessions...');

	const list = await res.json();
	for (const session of list) {
		try {
			const res = await fetch(BASE_URL + `/scheduler/admin/sessions/${session.guid}`, {
				method: 'PUT',
				body: JSON.stringify({ ...session, isPublished: true }),
				headers: {
					...BASE_HEADERS,
					'Cookie': COOKIE,
					'Referer': `https://dojo.code.ninja/scheduler/builder/${DOJO_ID}/view/${session.guid}/edit`,
				}
			});

			console.log(`[DEBUG] (${res.status}: ${res.statusText}) For session ${session.guid}`);
		} catch (e) {
			console.log(e);
			console.log('[DEBUG] Failed publishing session, you might have to do this manually.');
		}
	}
};


export function makeSessions(weekday, existingSessions) {
	const dates = getDatesForWeekDay(weekday);
	const res = [];

	for (const date of dates) {
		const sessions = SCHEDULE.filter(t => t.day === weekday);

		for (const session of sessions) {
			const start = date.clone().milliseconds(0).minute(0).seconds(0).hour(session.startTime);
			const end = date.clone().milliseconds(0).minute(0).seconds(0).hour(session.endTime);
			const day = date.clone().format('YYYY-MM-DD');

			if (existingSessions.find(s => {
				if (s.name !== session.name) {
					return false;
				}

				if (s.startTime.hour() === start.hour() && start.date() === s.startTime.date()) {
					return true;
				}

				if (s.endTime.hour() === end.hour() && end.date() === s.endTime.date()) {
					return true;
				}

				return false;
			})) {
				continue;
			}

			res.push({
				...session,
				allowsWaitlisting: true,
				date: day,
				sessionLength: null,
				quantity: null,
				facilityGuid: DOJO_ID,
				type: 'Single',
				startTime: start.format('YYYY-MM-DTHH:mm:ss'),
				isPublished: true,
				endTime: end.format('YYYY-MM-DTHH:mm:ss')
			});
		}
	}

	return res;
}

export function getDatesForWeekDay(day = 2) {
	const current = START_DATE.clone().minutes(0).seconds(0).hour(0);
	const result = [current.clone().day(day)];

	while (current.day(7 + day).isBefore(END_DATE)) {
		result.push(current.clone());
	}

	return result;
}

export async function getSessions() {
	console.log('[DEBUG] Requesting sessions from API...');

	const url = BASE_URL + `/scheduler/admin/${DOJO_ID}/weeklySessions?searchParentStudent=&startDate=${new Date().toISOString()}&endDate=9999-1-1T00:00:00.000Z`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Cookie': COOKIE
		},
	}).then(r => r.json());

	return res.map(session => {
		session.startTime = moment(session.startTime);
		session.endTime = moment(session.endTime);

		return session;
	}).sort((a, b) => a.startTime.unix() - b.startTime.unix());
}

export async function deleteSession(session) {
	try {
		const res = await fetch(BASE_URL + `/scheduler/admin/sessions/${session.guid}`, {
			method: 'DELETE',
			headers: {
				...BASE_HEADERS,
				'Cookie': COOKIE,
				'Referer': `https://dojo.code.ninja/scheduler/builder/${DOJO_ID}/view/${session.guid}/edit`,
			}
		});

		console.log(`[DEBUG] (${res.status}: ${res.statusText}) For session ${session.guid}`);
	} catch (e) {
		console.error(`[DEBUG] Failed for session ${session.guid}:`, e);
	}
}