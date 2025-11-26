# QualifAI Project Management Platform

A comprehensive project management and AI automation platform built with Next.js 16.

## 🚀 Features

- **Authentication**: Secure login and registration using Firebase.
- **Project Management**: Manage clients and projects efficiently.
- **QualifAI Suite**:
  - **AI Automation**: Automate tasks using AI.
  - **Quick QA**: Rapid quality assurance tools.
  - **WordPress Integration**: Seamlessly manage WordPress sites.
- **Modern UI**: Built with Tailwind CSS 4 and Framer Motion for a responsive and animated user experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Authentication**: Firebase

## 📂 Project Structure

```
app/
├── (main)/          # Main application routes
│   ├── qualifai/    # AI features (Automation, Quick QA, etc.)
│   ├── clients/     # Client management
│   ├── login/       # Authentication
│   └── ...
├── api/             # Next.js API routes
├── components/      # Reusable UI components
├── lib/             # Utility functions and configurations
└── ...
```

## 🏁 Getting Started

1.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up Environment Variables**

    Create a `.env` file in the root directory and add your Firebase and other configuration keys.

3.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
