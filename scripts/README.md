# ESLint Helper Scripts

This directory contains scripts to help fix common ESLint warnings in the QRloop project.

## Available Scripts

### 1. Fix Common ESLint Warnings

Automatically fixes common ESLint warnings across the project:

```bash
npm run fix-warnings
```

This script:
- Runs ESLint with the --fix option first
- Scans all component files for common issues
- Fixes unused variables by prefixing them with `_`
- Adds missing dependencies to useEffect hooks

### 2. Fix a Specific File

Analyzes and fixes ESLint warnings in a specific file:

```bash
npm run fix-file path/to/file.jsx
```

### 3. Fix useCallback Issues

Identifies functions that should be wrapped in useCallback to prevent dependency issues:

```bash
npm run fix-callback path/to/file.jsx
```

This script:
- Finds functions used in useEffect dependencies
- Wraps them in useCallback
- Automatically determines the proper dependencies for the useCallback hook
- Adds the useCallback import if needed

## Common ESLint Warnings and How to Fix Them

### 1. Unused Variables

```jsx
// ❌ Bad
const unusedVariable = 'never used';

// ✅ Good
const _unusedVariable = 'never used';
```

### 2. Missing useEffect Dependencies

```jsx
// ❌ Bad
useEffect(() => {
  console.log(someVariable);
}, []); // Missing dependency

// ✅ Good
useEffect(() => {
  console.log(someVariable);
}, [someVariable]); // Dependency included
```

### 3. Functions Recreated on Every Render

```jsx
// ❌ Bad
const handleClick = () => {
  setSomeState(someValue);
};

useEffect(() => {
  // Using handleClick in useEffect causes warnings
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [handleClick]); // handleClick changes on every render

// ✅ Good
const handleClick = useCallback(() => {
  setSomeState(someValue);
}, [someValue]); // List dependencies

useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [handleClick]); // Now handleClick is stable between renders
```

## Other Tips

- Consider extracting complex components into smaller ones to reduce warnings
- Use custom hooks to encapsulate related functionality
- Use React.memo() for performance-critical components
