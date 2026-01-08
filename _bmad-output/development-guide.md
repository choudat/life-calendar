# Development Guide

## Prerequisites
- **Node.js**: v20 or higher recommended.
- **Package Manager**: `npm`.

## Installation

```bash
git clone https://github.com/choudat/life-calendar.git
cd life-calendar
npm install
```

## Running Development Server

```bash
npm run dev
```
Access the app at [http://localhost:3000](http://localhost:3000).

## Build and Start

```bash
npm run build
npm start
```

## Linting

```bash
npm run lint
```

## Project Structure

This project uses the **Next.js App Router**.
- **Pages**: Located in `src/app`.
- **Components**: Located in `src/components`, organized by domain.
- **Styles**: Tailwind CSS v4 is used for all styling.

## Key Technologies
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4
- **State**: React Context (`EventsContext`)
- **Icons**: Lucide React
