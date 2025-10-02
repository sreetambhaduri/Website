# Next.js + TypeScript — Full Project (fixed)

**Purpose:** Replace the previous canvas document with a minimal, fully-configured **Next.js + TypeScript** starter that resolves the `SyntaxError: /index.tsx: Unexpected token (1:0)` error. This project includes unit tests (Jest + React Testing Library) so you have immediate test coverage verifying that the main page renders — fulfilling the requirement to *add tests if none exist*.

---

## What I changed and why
- Added a complete TypeScript setup (`tsconfig.json`, `next-env.d.ts`) so Next.js recognizes and compiles `.ts`/`.tsx` files.
- Added a Jest testing setup (using `ts-jest`) and a simple test case that renders the homepage and asserts the title — this ensures the TSX pipeline works in a test environment too.
- Included `.babelrc` (safe) to ensure other tooling that expects Babel picks up TypeScript + JSX support.
- Provided instructions (scripts) to run the dev server and tests locally.

If you still see `Unexpected token (1:0)` after this, it typically means some other tool (a custom script, test runner, or CI step) is trying to parse `.tsx` without the right transformer. Share the exact command you ran and its full stack trace and I'll tailor the fix.

---

## Project file tree (what's included)

```
sreetam-site/
├─ package.json
├─ tsconfig.json
├─ next-env.d.ts
├─ .babelrc
├─ jest.config.js
├─ jest.setup.ts
├─ __mocks__/fileMock.js
├─ pages/
│  ├─ _app.tsx
│  └─ index.tsx
├─ public/
│  └─ resume.pdf
├─ __tests__/
│  └─ index.test.tsx
├─ README.md
```

---

## File contents (copy these into your project root)

### `package.json`

```json
{
  "name": "sreetam-site",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --colors --runInBand"
  },
  "dependencies": {
    "next": "13.x",
    "react": "18.x",
    "react-dom": "18.x"
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/react": "18.x",
    "@types/node": "20.x",
    "jest": "29.x",
    "ts-jest": "29.x",
    "@types/jest": "29.x",
    "@testing-library/react": "14.x",
    "@testing-library/jest-dom": "6.x",
    "identity-obj-proxy": "3.x",
    "babel-jest": "29.x",
    "@babel/core": "7.x",
    "@babel/preset-typescript": "7.x",
    "@babel/preset-react": "7.x",
    "jest-environment-jsdom": "29.x"
  }
}
```

> Use `npm install` (or `yarn`) to install all dependencies. If you already have `next` and `react`, you can add the `typescript` and jest deps only.

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Notes: `jsx: react-jsx` is compatible with React 17+ automatic runtime. If you prefer `preserve`, set to `preserve` — Next.js supports both.

---

### `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file is required by Next.js and should not be edited.
```

---

### `.babelrc`

```json
{
  "presets": [
    "next/babel",
    "@babel/preset-typescript",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

This is a safe default enabling Babel-based tools to parse TSX.

---

### `jest.config.js`

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
```

---

### `jest.setup.ts`

```ts
import '@testing-library/jest-dom/extend-expect';
```

---

### `__mocks__/fileMock.js`

```js
module.exports = 'test-file-stub';
```

---

### `pages/_app.tsx`

```tsx
import type { AppProps } from 'next/app';
import React from 'react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

> Create `styles/globals.css` as needed; for the minimal reproduction you can create an empty file to avoid import errors.

---

### `pages/index.tsx` (core file — must be valid TSX)

```tsx
import React from 'react';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Hi — I'm Sreetam</h1>
      <p>This is a minimal, TypeScript-ready Next.js index page. If this renders, TypeScript and JSX are configured correctly.</p>
    </main>
  );
}
```

Make sure the filename is exactly `pages/index.tsx`.

---

### `__tests__/index.test.tsx` (new test — checks the page renders)

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home page', () => {
  test('renders heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi — I'm Sreetam");
  });
});
```

This test ensures that the TSX is compiled and that rendering works with `ts-jest` + `jsdom`.

---

### `README.md` (run instructions)

```md
# Sreetam Site — Next.js + TypeScript

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
# Visit http://localhost:3000
```

3. Run tests:

```bash
npm test
```
```

---

## How this fixes `Unexpected token (1:0)`
That error indicates that a parser encountered the first character of a TSX file (typically `<`) but didn't understand JSX/TSX syntax. Providing `tsconfig.json`, `next-env.d.ts`, and either Babel presets or `ts-jest` ensures the various tools (Next.js dev server, Jest, or other pipelines) can correctly transform `.tsx` files.

- Next dev server reads `tsconfig.json` and `next-env.d.ts` to enable TypeScript.
- Babel (if present) is configured to accept TSX via `.babelrc`.
- Jest uses `ts-jest` (configured in `jest.config.js`) so tests can import `.tsx` files safely.

If a custom script or an external tool still fails, tell me the exact command you ran and paste the full stack trace.

---

## Next steps (pick one)
1. I can write these files into the canvas project tree (I already replaced the textdoc content). If you want, I will create a ZIP at `/mnt/data/sreetam-site.zip` that you can download and run locally — tell me to create the ZIP.
2. If you'd rather avoid TypeScript, I can convert everything to plain JavaScript (`.js/.jsx`) and add tests in JS.
3. If the error came from a CI job or a different command, paste the exact command and stack trace and I'll adapt the configuration accordingly.

---

## Small question for you (required):
What's the **expected behavior** when you run the project locally? e.g. "I expect `npm run dev` to start a Next.js server and show the homepage at `http://localhost:3000` with the Heading text" — or do you prefer a Vite-based dev server instead? Also paste the exact command and full stack trace that produced `SyntaxError: /index.tsx: Unexpected token (1:0)` if you still have it.


---

*End of rewrite.*
