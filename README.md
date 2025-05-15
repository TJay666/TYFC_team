# nextn

This is a Next.js project built with TypeScript, React, and Tailwind CSS. It includes AI capabilities using Genkit.

## Getting Started

First, install the dependencies:

```bash
npm install
# or yarn install
# or pnpm install
# or bun install
```

Next, run the development server:

```bash
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```

This will start the application on `http://localhost:9002`.

To run the Genkit development server:

```bash
npm run genkit:dev
# or yarn genkit:dev
# or pnpm genkit:dev
# or bun genkit:dev
```

This will start the Genkit studio, typically on `http://localhost:4000/streams`.

You can explore the AI flow in `src/ai/flows/ai-drill-suggestion-flow.ts`.

## Building and Starting

To build the project:

```bash
npm run build
```

To start the built project:

```bash
npm run start
```

## Scripts

*   `npm run dev`: Starts the development server with Turbopack on port 9002.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the project.
*   `npm run typecheck`: Checks TypeScript types.
