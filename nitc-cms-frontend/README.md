# NCMS Frontend

## Implementation Details

It was made in React using Bootstrap components.

## Running the App

In the project directory, you can run:

### `npm install`

Installs the required dependencies

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Routes

The following routes are present in the app:
| Route | Component | Description |
| - | - | - |
| / | HomePage | The home page |
| /clubs/:clubname | ClubDetailsPanel | For a general user to see details about a club |
| /events | Events | To see a list of all the events as a general user |
| /student | StudentDetails | To see the details when logged in as a student |
| /student/events | StudentEvents | To register for events and see registered events when logged in as a student |
| /clubadmin | ClubAdminPanel | To create events and manage members of the club as a club admin |
| /clubadmin/:eventId| ClubEventPanel | To see and edit the event information and see registrations for an event as a club admin |
| /admin | SysAdminPanel | See a list of clubs and venues as a sys admin |
| /admin/createclub | SysAdminMakeClub | Create a club as a sys admin |
| /admin/createvenue | SysAdminMakeVenue | Create a venue as a sys admin |
