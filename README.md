# <img width='50' align='center' src='assets/logo.png' /> Code Ninjas Scheduler
This tool was created to get around the pesky UX and UI that Code Ninjas provides for scheduling sessions. It features a configurable session scheduler along with a session deleter.

## Notes
The scheduler will schedule sessions for the next month. No matter what the date is, starting this script will schedule for next month, even if this script is ran on the 1st of the month you'd like to schedule sessions for.

When configuring the script, please rename `sample_config.json` to `config.json`.

**Please ensure your supervisor/manager is fine with you using this tool. This can be destructive.**

## Requirements
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/en)
- Your Dojo ID
- Your Code Ninjas website cookies.

## Setup
- **Cookies** - You may find this under the "Network" tab when making a request such as creating or deleting a session. It will be in the request headers.
- **Dojo ID** - You may find this in the URL bar of your scheduler
- **Schedule** - This has to be configured to reflect your Dojo's schedule. The fields in the sample configuration are self explanatory.

## Usage

#### Add Sessions
`bun .`

#### Delete Sessions
`bun . --delete`