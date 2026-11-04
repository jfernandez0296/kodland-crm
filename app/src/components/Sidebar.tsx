import { accessBg, accessLabel, initials, Member } from '../data';
import { Icon } from './Icon';

export type View = 'pipeline' | 'equipo' | 'contactos' | 'dashboard';

interface Props {
  view: View;
  onNavigate: (v: View) => void;
  isAdmin: boolean;
  leadCount: number;
  teamCount: number;
  me: Member;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Sidebar({ view, onNavigate, isAdmin, leadCount, teamCount, me, collapsed, onToggle, onLogout }: Props) {
  const items: { key: View; label: string; count?: number }[] = [
    { key: 'pipeline', label: 'Pipeline', count: leadCount },
    ...(isAdmin ? [{ key: 'equipo' as const, label: 'Equipo', count: teamCount }] : []),
    { key: 'contactos', label: 'Contactos', count: leadCount },
    { key: 'dashboard', label: 'Resumen' },
  ];

  return (
    <aside className="side">
      <div className="brand">
        <span className="bfull">
          kodland<span className="brand-sub">CRM</span>
        </span>
        <span className="bshort">k</span>
      </div>
      <button className="tog" onClick={onToggle} title="Comprimir o expandir" aria-label="Comprimir o expandir menú">
        <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} strokeWidth={2.2} />
      </button>
      <div className="side-label lbl">Menú</div>
      <nav style={{ display: 'contents' }}>
        {items.map((n) => (
          <button
            key={n.key}
            className={'navb' + (view === n.key ? ' active' : '')}
            title={n.label}
            aria-current={view === n.key ? 'page' : undefined}
            onClick={() => onNavigate(n.key)}
          >
            <Icon name={n.key} size={20} />
            <span className="lbl">{n.label}</span>
            {n.count !== undefined && <span className="lbl navb-count">{n.count}</span>}
          </button>
        ))}
      </nav>
      <div className="me">
        <div className="me-row">
          <span className="me-avatar">{initials(me.name)}</span>
          <div className="me-info">
            <div className="me-name">{me.name}</div>
            <div className="me-role">{me.role}</div>
            <span className="me-access" style={{ background: accessBg(me.access) }}>
              {accessLabel(me.access)}
            </span>
          </div>
        </div>
        <button className="logout" onClick={onLogout} title="Cerrar sesión">
          <Icon name="logout" />
          <span className="lbl">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
