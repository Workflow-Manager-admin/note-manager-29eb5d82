# Lightweight React Template for KAVIA

## Supabase 404 Error Diagnostics

### Problem
If you see a 404 error in your browser console for `https://<project>.supabase.co/rest/v1/notes`, this is usually because:
- The "notes" table does **not exist** in your Supabase database, or its spelling/casing does not match.
- The table was deleted or never created.
- (Rare) The Supabase credentials are pointed to the wrong project.

### How to Fix

1. **Check that the notes table exists:**
   - Go to your [Supabase Dashboard](https://app.supabase.com/project/jbiwztlpxvwthdmpnrqv).
   - In the "Table Editor", verify that there is a table called `notes`.
   - If not, create the table with this SQL:
     ```sql
     create table notes (
       id uuid primary key default uuid_generate_v4(),
       title text,
       content text,
       updated_at timestamp with time zone default now()
     );
     ```

2. **Check spelling/case:**  
   Supabase is case-sensitive for table names in URLs. The table must be named exactly `notes`.

3. **Set Row Level Security (optional for basic testing):**
   - For easy prototyping, you can disable RLS or add a policy to allow all (for demonstration only):

     ```
     alter table notes enable row level security;
     create policy "Allow all" on notes for all using (true);
     ```

4. **Re-run your application.**  
   The 404 error should disappear once the table exists.

---

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
