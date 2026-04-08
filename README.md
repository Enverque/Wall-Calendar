# Wall Calendar

An interactive **wall calendar web application** built with **Next.js, React, and Tailwind CSS**, designed to recreate the feel of a physical hanging calendar while adding rich digital interactions such as date-range selection, notes, historical events, live day highlighting, dynamic image previews, year-based navigation, and month-based festive animations.

This project focuses on **frontend engineering**, with strong emphasis on:
* polished UI
* smooth interactions
* responsive design for mobile and desktop 
* reusable components
* animation and visual storytelling

---

## Live Concept

Wall Calendar is not just a simple calendar grid. It is designed as an **interactive visual calendar experience** where users can:
* browse months and years smoothly
* select a single day or multiple-day period
* write notes for their selected period
* explore festivals and special dates
* discover historical events for a chosen date
* enjoy month-specific festive and seasonal animations
* interact with a dynamic image-driven calendar header

---

## Features

### 1. Wall Calendar Aesthetic
* Designed to resemble a **physical hanging wall calendar**
* Includes a top spiral-style binding effect
* Large hero image section for visual appeal
* Clean monthly layout inspired by real paper calendars

### 2. Smart Day Styling
* **Past days** in the current visible month appear slightly faded
* **Upcoming days** are darker and more prominent
* **Today** is specially highlighted for immediate visibility

### 3. Live Current Day Disc
* The current date is shown with a special highlighted disc
* This disc contains a **live clock showing the current time**
* Gives the current day an active and dynamic feel

### 4. Motivational Quote on Hover
* Hovering over the current day disc reveals a motivational quote
* Adds a more human and engaging touch to the interface

### 5. Festival and Special Event Highlights
* Certain dates are highlighted for festivals or notable occasions
* Hovering over those dates shows a small visual tile with:
  - event/festival image
  - event/festival name

### 6. Date Range Selection
* Users can click once to start selecting a date
* Clicking another date completes the range
* Supports:
  - **single-day selection**
  - **multi-day selection**
* Start date, end date, and in-between dates are styled differently

### 7. Notes for Selected Date Range
* After selecting a date or range, the user can write notes for that period
* Notes remain saved until the user clears them manually
* Useful for reminders, planning, and short annotations

### 8. Historical Events on Double Click
* Double-clicking on a date opens a history modal
* The user can view **3 notable things that happened on that same date in history**

### 9. Dynamic Hero Image Preview
* When the user hovers over different dates in the same month, the image in the top section changes dynamically
* Makes date exploration more engaging and immersive

### 10. Interactive Year Timeline
* Clicking the displayed year opens a **horizontal year timeline**
* The user can jump to past or future years instantly
* Makes year navigation faster and more interactive than traditional controls

### 11. Festival-Based Month Animations
* Special months trigger themed animations automatically
* Examples:
  - **January** → kite animation
  - **March** → colorful festive/Holi-style effect
  - **November** → Diwali-inspired festive effect
  - **December** → snowfall/winter effect

### 12. Festive Animation Toggle
* A **Festive On / Off** button is available in the top-right area
* Users can disable monthly festive animations whenever they want

### 13. Realistic Page Flip Animation
* Month navigation is animated like a physical calendar page turn
* On navigation:
  - moving to the previous month feels like the page flips upward
  - moving to the next month feels like a natural forward page transition

### 14. Responsive Design
* Fully responsive on desktop and mobile
* Layout remains clean, readable, and touch-friendly across screen sizes

---

## How Users Can Use the Calendar

### Opening the Calendar
When the application loads, the user sees the current month in an interactive wall calendar format, with a large image section at the top and the calendar content below it.

### Understanding Day Appearance
* Days that already passed in the current month are faded
* Upcoming days are darker and clearer
* The current day is specially emphasized

### Hovering Over Today
If the user hovers over the current day disc, a motivational quote appears.

### Hovering Over Festival or Special Days
If a day contains a festival or special event, hovering on that day opens a tooltip with:
* the related image
* the event name

### Selecting a Date Range
The user can:
1. click one date to start the selection
2. click another date to complete the date range

This can create:
* a one-day selection
* or a multi-day period

### Writing Notes
After selecting a date or period, the user can write notes in the notes section. These notes remain saved until the user manually clears the selection.

### Viewing Historical Events
If the user double-clicks on a date, a history modal opens and shows three important events from history that happened on that date.

### Exploring Dates with Dynamic Image Changes
As the user moves the cursor across dates in the current month, the hero image changes according to the hovered date.

### Changing the Year
Clicking on the year opens a horizontal year timeline. The user can then select any visible year from the past or future.

### Changing the Month
Previous and next buttons allow the user to move across months. During month change:
* the page-flip transition appears
* special month-based animations may play

### Controlling Festival Effects
Users can turn festive animations on or off with the festive toggle button.

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```


## Tech Stack

* **Next.js**
* **React**
* **Tailwind CSS**
* **JavaScript**
* **Custom CSS animations**
* **Static JSON data**

---

## Project Structure

```text
Wall-Calendar/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── CalendarGrid.js
│   ├── Festivalcanvas.js
│   ├── FestivalEffects.js
│   ├── FestivalTooltip.js
│   ├── HeroImage.js
│   ├── HistoryModal.js
│   ├── NotesPanel.js
│   ├── QuoteTooltip.js
│   ├── SpecialDayReminder.js
│   ├── Timetravelhero.js
│   ├── TimeTravelHeroFixed.js
│   ├── TodayDisc.js
│   ├── WallCalendar.js
│   └── YearTimeline.js
├── hooks/
│   └── useCalendarData.js
├── public/
│   └── data/
│       ├── festivals.json
│       ├── historical-events.json
│       └── quotes.json
├── .eslintignore
├── .gitignore
├── eslint.config.mjs
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
