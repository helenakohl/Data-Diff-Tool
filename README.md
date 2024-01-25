# Data Diff Exploration

This repository seeks to explore how data diffing on SQLite databases can be implemented.

## Tech Stack

The repository is composed of a `server` and an `ui` application that interact with each other.
All projects are set up via [nx](https://nx.dev/getting-started/intro) that allows organizing multiple projects within one repository.

### Server

- [TypeScript](https://www.typescriptlang.org/docs/) as base language
- [Express](https://expressjs.com/) framework to create web service with HTTP endpoints
- [Webpack](https://webpack.js.org/concepts/) as a bundler
- [ESLint](https://eslint.org/docs/latest/) for linting (in combination with prettier for code formatting)

### UI

- [TypeScript](https://www.typescriptlang.org/docs/) as base language
- [React](https://react.dev/learn) framework to create user interface components
- [Vite](https://vitejs.dev/guide/) as a bundler
- [ESLint](https://eslint.org/docs/latest/) for linting (in combination with prettier for code formatting)

## Getting Started

1. Setup [VSCode](https://code.visualstudio.com/)
   - Install [nx plugin](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
   - Install [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. Download dependencies: `npm i`
3. Run the server and ui project: `npm run serve` (a shortcut for `npx nx run-many --target serve` defined in the `package.json`)
   - For starting the server individually instead: `npx nx serve server` (or use the VSCode nx plugin)
   - For starting the ui individually instead: `npx nx serve ui` (or use the VSCode nx plugin)

## Linting

To lint the whole project, just run `npm run lint` (a shortcut for `npx nx run-many --target lint` defined in the `package.json`)

## NX Cheat Sheet

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).
