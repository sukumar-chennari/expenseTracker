## Demo
<p align="center">
  <img src="screenshots/home.png" width="250"/>
  <img src="screenshots/add.png" width="250"/>
</p>

<p align="center">
  <img src="screenshots/list.png" width="250"/>
  <img src="screenshots/theme.png" width="250"/>
</p>

# Expense Tracker

A simple, mobile-first expense tracking app built using React and Ionic.

This project focuses on building a clean and maintainable frontend with good UX practices, without adding unnecessary complexity.

---

## Features

- Add expense (title, amount, category)
- Delete expense with confirmation
- View total expenses
- Persistent data using localStorage
- Controlled categories (predefined options)
- Basic input validation and feedback

---

## Tech Stack

- React (Functional Components + Hooks)
- Ionic React
- TypeScript
- LocalStorage

---

## Key Decisions

- Kept state simple → used useState instead of external state libraries  
- No backend → used localStorage for persistence  
- Minimal component structure → separated only form and list  
- Controlled inputs → avoids inconsistent data  
- Focused scope → avoided adding unnecessary features  

---

## Project Structure

- Home.tsx → manages state and core logic  
- ExpenseForm.tsx → handles input and validation  
- ExpenseList.tsx → renders expenses and delete actions  

---

## Run Locally

```bash
npm install
npm run dev
```

Built by [Sukumar Chennari](https://github.com/sukumar-chennari) 
