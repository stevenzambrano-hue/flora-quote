# FloraQuote - Flower Cost Management

This is the official repository for **FloraQuote**, a platform designed for efficiently managing flower catalogs, costs, and generating quotations.

## 🚀 Tech Stack

The project is divided into two main parts:

- **Frontend:** [Angular 21](https://angular.io/) + [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) + [Supabase](https://supabase.com/)

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

---

## ⚙️ Project Setup

Follow these steps to get the project up and running in your local environment.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flora-quote
```

### 2. Quick Installation (Recommended)
From the root of the project, run the following command to install dependencies for both **frontend** and **backend**:
```bash
npm run install:all
```

### 3. Backend Configuration
The backend uses Supabase for the database.
1. Ensure the `.env` file in the `backend/` folder has the correct credentials. (We have included a `.env.example` in that folder as a guide).
2. If you want to use the default configuration:
```bash
cd backend && cp .env.example .env && cd ..
```

### 4. Running the Project
You can start both components (frontend and backend) simultaneously from the root:
```bash
npm start
```

Alternatively, you can start them separately:
- Backend: `npm run start:backend`
- Frontend: `npm run start:frontend`

The application will be available at [http://localhost:4200](http://localhost:4200).

---

## 📁 Project Structure

```text
flora-quote/
├── backend/        # Express server and business logic
└── frontend/       # User interface built with Angular
```

## 📄 License

This project is licensed under the ISC License.
