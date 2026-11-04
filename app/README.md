# kodland CRM

React + TypeScript + Vite implementation of the Claude Design prototype `project/CRM.dc.html`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

- Design tokens come straight from the Kodland design system (`src/styles/tokens.css`); layout and component styles are in `src/styles/app.css`.
- Data is seed/demo data (`src/data.ts`). Leads, team and session are kept in `localStorage`. There is no backend.
- Login is a demo: pick a team member, and any password of 4+ characters works. Admins see every lead plus the Equipo view. Responsables see only their own leads.
