# Wall Calendar

An interactive wall calendar built using Next.js with a clean UI and date range selection.

## Features

* Date range selection with highlighted start, end, and in-between days
* Month navigation across all 12 months
* Notes panel for each month
* Responsive layout for mobile and desktop

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

* Next.js
* React
* Tailwind CSS

## Project Structure

```
Calendar/
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
```
