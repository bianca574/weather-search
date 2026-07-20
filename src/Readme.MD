# Weather Search

A small two-page weather app: a welcome screen leads into a city search page that shows live current-weather data — with a twist, the page's color theme automatically switches between a light and a dark mode depending on whether it's actually daytime or nighttime in the city you searched.

## Live Demo

## Features

- **City search with autocomplete** — start typing a city name and a debounced dropdown suggests real matching cities (avoids spamming the API on every keystroke; only fetches ~300ms after you stop typing).
- **Day/night auto-theming** — the app reads the `is_day` field from the weather API for the searched city and automatically switches the entire color palette between a soft light mode and a dark mode, so the UI reflects the real conditions in that city right now.
- **Current weather display** — temperature, wind speed and direction, and a weather icon that maps the API's weather code to an emoji.
- **Client-side routing** — a dedicated welcome page and search page, navigated via React Router without full page reloads.
- **Robust error handling** — distinguishes between "city not found" and a genuine network failure, with appropriate messaging for each.
- **Entrance animation** — the welcome page's heading and button fade in with a staggered delay.

## Built With

- [React](https://react.dev/) — UI library, function components + hooks
- [React Router](https://reactrouter.com/) — client-side routing between pages
- [Vite](https://vitejs.dev/) — build tool / dev server
- [Open-Meteo](https://open-meteo.com/) — free weather & geocoding API, no API key required
- Plain CSS with custom properties (CSS variables) for the theming system

## Running Locally

```bash
git clone https://github.com/
cd your-repo-name
npm install
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

## Project Structure

```
src/
├── App.jsx              # Routes (welcome page + search page)
├── WelcomePage.css       # Welcome page styling + entrance animation
├── WeatherDashboard.jsx  # Search, autocomplete, fetching, weather display
├── WeatherDashboard.css  # Search page styling
├── theme.css             # Shared color variables + light/dark mode
```

## What I Learned

This was my first React project, built while learning the fundamentals: components, props, state, controlled forms, `useEffect` and data fetching, lifting state up, Context, `useRef`, and custom hooks. Building the autocomplete search in particular meant learning about debouncing and race conditions when multiple API requests can resolve out of order.

## License

All rights reserved.
