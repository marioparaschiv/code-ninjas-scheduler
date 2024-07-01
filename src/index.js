import { addSessions, deleteSession, getSessions, makeSessions } from './sessions.js';
import { SCHEDULE } from '../config.json' assert { type: 'json' };

const SESSIONS = await getSessions();

if (process.argv.includes('--delete')) {
	for (const session of SESSIONS) {
		deleteSession(session);
	}
} else {
	const weekdays = new Set(SCHEDULE.map(i => i.day));

	for (const weekday of weekdays) {
		const sessions = makeSessions(weekday, SESSIONS);
		addSessions(sessions);
	}
}
