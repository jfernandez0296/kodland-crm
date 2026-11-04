import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Deal, Member, SEED_DEALS, SEED_TEAM, stageOf, StageId } from './data';
import { load, save } from './storage';
import { Icon } from './components/Icon';
import { Sidebar, View } from './components/Sidebar';
import { Pipeline } from './components/Pipeline';
import { Contacts } from './components/Contacts';
import { Dashboard } from './components/Dashboard';
import { Team } from './components/Team';
import { LeadDrawer } from './components/LeadDrawer';
import { NewLead, NewLeadModal } from './components/NewLeadModal';
import { LoginScreen } from './components/LoginScreen';

const TITLES: Record<View, string> = {
  equipo: 'Equipo',
  pipeline: 'Pipeline de ventas',
  contactos: 'Contactos',
  dashboard: 'Resumen',
};

/** Below this width the sidebar starts collapsed and the toggle *expands* it. */
const AUTO_COLLAPSE_W = 1100;

function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

export default function App() {
  // Persisted data
  const [team, setTeam] = useState<Member[]>(() => load('crm_team', SEED_TEAM));
  const [deals, setDeals] = useState<Deal[]>(() => load('crm_deals', SEED_DEALS));
  const [user, setUser] = useState<string>(() => load('crm_user', 'Ana'));
  const [loggedOut, setLoggedOut] = useState(() => !load('crm_session', false));
  useEffect(() => save('crm_team', team), [team]);
  useEffect(() => save('crm_deals', deals), [deals]);

  // UI state
  const [loginMsg, setLoginMsg] = useState('Inicia sesión para continuar.');
  const [view, setView] = useState<View>('pipeline');
  const [q, setQ] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('Todos');
  const [selId, setSelId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [col, setCol] = useState(false); // desktop: user collapsed
  const [ext, setExt] = useState(false); // narrow: user expanded
  const width = useWindowWidth();
  const collapsed = width <= AUTO_COLLAPSE_W ? !ext : col;

  // Toast
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>();
  const flash = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  }, []);

  // Escape closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelId(null);
        setShowNew(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Derived
  const me = team.find((t) => t.name === user) ?? team[0];
  const isAdmin = me.access === 'admin';
  const mine = useMemo(() => (isAdmin ? deals : deals.filter((d) => d.owner === me.name)), [deals, isAdmin, me.name]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return mine.filter(
      (d) =>
        (!term || (d.name + d.company).toLowerCase().includes(term)) &&
        (ownerFilter === 'Todos' || d.owner === ownerFilter),
    );
  }, [mine, q, ownerFilter]);
  const sel = mine.find((d) => d.id === selId);
  const effectiveView: View = view === 'equipo' && !isAdmin ? 'pipeline' : view;
  const isListView = effectiveView === 'pipeline' || effectiveView === 'contactos';

  // Actions
  const updateDeal = (id: number, patch: (d: Deal) => Partial<Deal>) =>
    setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch(d) } : d)));

  const move = (id: number, stage: StageId) => {
    updateDeal(id, () => ({ stage, last: 'hoy' }));
    flash('Movido a ' + stageOf(stage).name);
  };

  const login = (u: string, pass: string) => {
    if (pass.length < 4) return setLoginMsg('Ingresa una contraseña de 4+ caracteres.');
    save('crm_session', true);
    save('crm_user', u);
    setUser(u);
    setLoggedOut(false);
    setLoginMsg('');
    setView('pipeline');
    setOwnerFilter('Todos');
    setQ('');
  };

  const logout = () => {
    save('crm_session', undefined);
    setLoggedOut(true);
    setSelId(null);
    setShowNew(false);
    setLoginMsg('Cerraste sesión. Vuelve a entrar cuando quieras.');
  };

  const create = (f: NewLead) => {
    const id = Math.max(0, ...deals.map((d) => d.id)) + 1;
    setDeals((ds) => [
      {
        id,
        name: f.name.trim(),
        company: f.company.trim() || 'Sin empresa',
        value: Number(f.value) || 0,
        stage: 'nuevo',
        owner: isAdmin ? f.owner || team[0].name : me.name,
        last: 'hoy',
        email: f.email.trim() || '—',
        phone: '—',
        notes: [{ when: 'Ahora', text: 'Lead creado.' }],
      },
      ...ds,
    ]);
    setShowNew(false);
    flash('Lead creado');
  };

  const addMember = (m: Member) => {
    if (team.some((t) => t.name.toLowerCase() === m.name.toLowerCase())) {
      flash('Ese responsable ya existe');
      return false;
    }
    setTeam((t) => [...t, m]);
    flash('Responsable agregado');
    return true;
  };

  const toggleAccess = (name: string) => {
    const t = team.find((x) => x.name === name);
    if (!t) return;
    const isA = t.access === 'admin';
    const admins = team.filter((x) => x.access === 'admin').length;
    if (name === me.name) return flash('No puedes cambiar tu propio rol');
    if (isA && admins < 2) return flash('Debe quedar al menos un Admin');
    setTeam((ts) => ts.map((x) => (x.name === name ? { ...x, access: isA ? 'responsable' : 'admin' } : x)));
    flash(name + ' ahora es ' + (isA ? 'Responsable' : 'Admin'));
  };

  const removeMember = (name: string) => {
    const hasLeads = deals.some((d) => d.owner === name);
    if (hasLeads || team.length <= 1 || name === me.name) return flash('Reasigna sus leads antes de quitarlo');
    setTeam((ts) => ts.filter((x) => x.name !== name));
    if (ownerFilter === name) setOwnerFilter('Todos');
    flash('Responsable quitado');
  };

  const subtitle: Record<View, string> = {
    pipeline: mine.length + ' leads · arrastra las tarjetas entre etapas',
    contactos: mine.length + ' contactos registrados',
    dashboard: 'Estado de tu embudo hoy',
    equipo: team.length + ' responsables comerciales',
  };

  return (
    <div className={'crm' + (collapsed ? ' col' : '')}>
      <Sidebar
        view={effectiveView}
        onNavigate={setView}
        isAdmin={isAdmin}
        leadCount={mine.length}
        teamCount={team.length}
        me={me}
        collapsed={collapsed}
        onToggle={() => (width <= AUTO_COLLAPSE_W ? setExt((v) => !v) : setCol((v) => !v))}
        onLogout={logout}
      />

      <main className="main">
        <header className="top">
          <div className="ttl">
            <h1>{TITLES[effectiveView]}</h1>
            <div className="ttl-sub">{subtitle[effectiveView]}</div>
          </div>
          {isListView && (
            <label className="srch">
              <span className="srch-ico">
                <Icon name="search" />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar contacto o empresa"
                aria-label="Buscar contacto o empresa"
              />
            </label>
          )}
          <button className="btn-primary glow" onClick={() => setShowNew(true)}>
            <Icon name="plus" />
            Nuevo lead
          </button>
        </header>

        {isAdmin && isListView && (
          <div className="chips">
            <span className="chips-label">Responsable</span>
            {['Todos', ...team.map((t) => t.name)].map((o) => (
              <button
                key={o}
                className={'chip' + (ownerFilter === o ? ' on' : '')}
                aria-pressed={ownerFilter === o}
                onClick={() => setOwnerFilter(o)}
              >
                {o}
              </button>
            ))}
          </div>
        )}

        {effectiveView === 'pipeline' && <Pipeline deals={filtered} onMove={move} onOpen={setSelId} />}
        {effectiveView === 'contactos' && <Contacts deals={filtered} onOpen={setSelId} />}
        {effectiveView === 'dashboard' && <Dashboard deals={mine} onOpen={setSelId} />}
        {effectiveView === 'equipo' && (
          <Team
            team={team}
            deals={deals}
            me={me}
            onAdd={addMember}
            onToggleAccess={toggleAccess}
            onRemove={removeMember}
          />
        )}
      </main>

      {sel && (
        <LeadDrawer
          key={sel.id}
          deal={sel}
          team={team}
          isAdmin={isAdmin}
          onClose={() => setSelId(null)}
          onMove={(stage) => move(sel.id, stage)}
          onReassign={(owner) => {
            updateDeal(sel.id, () => ({ owner }));
            flash('Asignado a ' + owner);
          }}
          onAddNote={(text) => {
            updateDeal(sel.id, (d) => ({ last: 'hoy', notes: [{ when: 'Ahora', text }, ...d.notes] }));
            flash('Nota guardada');
          }}
          onDelete={() => {
            setDeals((ds) => ds.filter((d) => d.id !== sel.id));
            setSelId(null);
            flash('Lead eliminado');
          }}
        />
      )}

      {showNew && <NewLeadModal team={team} isAdmin={isAdmin} onClose={() => setShowNew(false)} onCreate={create} />}

      {toast && (
        <div className="toast" role="status">
          <span className="toast-dot" />
          {toast}
        </div>
      )}

      {loggedOut && <LoginScreen team={team} defaultUser={user} message={loginMsg} onLogin={login} />}
    </div>
  );
}
