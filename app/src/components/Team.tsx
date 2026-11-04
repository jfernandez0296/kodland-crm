import { useState } from 'react';
import { Access, accessBg, accessLabel, Deal, initials, Member, MEMBER_COLORS, usd } from '../data';

interface Props {
  team: Member[];
  deals: Deal[];
  me: Member;
  onAdd: (m: Member) => boolean;
  onToggleAccess: (name: string) => void;
  onRemove: (name: string) => void;
}

const EMPTY = { name: '', role: '', access: 'responsable' as Access };

export function Team({ team, deals, me, onAdd, onToggleAccess, onRemove }: Props) {
  const [tf, setTf] = useState(EMPTY);

  const add = () => {
    const name = tf.name.trim();
    if (!name) return;
    if (onAdd({ name, role: tf.role.trim() || 'Ejecutivo de ventas', access: tf.access })) setTf(EMPTY);
  };

  return (
    <div className="stack scroll-area">
      <form
        className="add-member"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <b>Agregar responsable</b>
        <input
          className="field"
          value={tf.name}
          onChange={(e) => setTf({ ...tf, name: e.target.value })}
          placeholder="Nombre completo"
          aria-label="Nombre completo"
        />
        <input
          className="field"
          value={tf.role}
          onChange={(e) => setTf({ ...tf, role: e.target.value })}
          placeholder="Cargo (ej. Ejecutivo de ventas)"
          aria-label="Cargo"
        />
        <select
          className="field"
          value={tf.access}
          onChange={(e) => setTf({ ...tf, access: e.target.value as Access })}
          aria-label="Acceso"
        >
          <option value="responsable">Responsable</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn-dark">
          Agregar
        </button>
      </form>
      <div className="members">
        {team.map((t, i) => {
          const ds = deals.filter((d) => d.owner === t.name);
          const canRemove = ds.length === 0 && team.length > 1 && t.name !== me.name;
          return (
            <div key={t.name} className="member">
              <div className="member-head">
                <span className="avatar" style={{ width: 48, height: 48, background: MEMBER_COLORS[i % 4] }}>
                  {initials(t.name)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="member-name">{t.name}</div>
                  <div className="member-role">{t.role}</div>
                </div>
                <span className="badge" style={{ background: accessBg(t.access) }}>
                  {accessLabel(t.access)}
                </span>
              </div>
              <div className="stat-grid">
                <div className="stat">
                  Leads
                  <br />
                  <b>{ds.length}</b>
                </div>
                <div className="stat">
                  En pipeline
                  <br />
                  <b>{usd(ds.reduce((a, d) => a + d.value, 0))}</b>
                </div>
              </div>
              <button className="btn-outline" onClick={() => onToggleAccess(t.name)}>
                {t.access === 'admin' ? 'Pasar a Responsable' : 'Hacer Admin'}
              </button>
              <button
                className={'btn-remove' + (canRemove ? '' : ' disabled')}
                title={canRemove ? undefined : 'Reasigna sus leads para poder quitarlo (no puedes quitarte a ti mismo)'}
                onClick={() => onRemove(t.name)}
              >
                Quitar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
