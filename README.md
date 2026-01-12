# Art Gallery DataTable

This project is a React + TypeScript application that displays artwork data
from the Art Institute of Chicago API using a PrimeReact DataTable.

The application implements true server-side pagination and persistent row
selection without prefetching or storing data from other pages.

---

## 🚀 Tech Stack

- React (Vite)
- TypeScript
- PrimeReact
- PrimeFlex
- Art Institute of Chicago Public API

---

## 📡 API Used

https://api.artic.edu/api/v1/artworks?page=1

---

## 📊 Features

- Server-side pagination
- Lazy loading of data
- Checkbox row selection
- Custom row selection using overlay panel
- Persistent selection across pages
- No prefetching of API data

---

## 🔁 Server-Side Pagination Strategy

The application fetches artwork data page by page from the API.
Only the current page data is stored in memory.

Whenever the user changes the page, a new API request is made to fetch
the corresponding page data.

This ensures scalability and prevents unnecessary memory usage.

---

## ✅ Persistent Row Selection Strategy

The application does not store row objects or data from other pages.

Row selection persistence is achieved by tracking selected and deselected
row IDs using `Set<number>`.

For each page:
- Only the current page data is fetched
- Selected rows are derived dynamically by matching row IDs
- No additional API calls are made for selection

This approach ensures correct selection behavior without prefetching
or caching page data.

---

## 🧮 Custom Row Selection

The custom row selection feature allows users to select a specified number
of rows from the current page only.

If the entered number exceeds the number of available rows on the page,
selection is limited to the current page.

This behavior strictly follows the assignment constraints and avoids
fetching or storing data from other pages.

---

## 🧪 Testing Scenarios

- Selecting rows using checkboxes
- Selecting rows using custom input
- Navigating between pages and returning
- Ensuring selection persists correctly
- Verifying no additional API calls are made

---

## 🌐 Deployment

The application is deployed on Netlify.

Live URL: https://chimerical-dodol-4ebcb7.netlify.app/


---

## 📦 Installation & Setup

```bash
npm install
npm run dev
