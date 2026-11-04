import { useState } from 'react';
import { Deal, initials, Member, STAGES, StageId, usd } from '../data';
import { Icon } from './Icon';

interface Props {
  deal: Deal;
  team: Member[];
  isAdmin: boolean;
  onClose: () => void;
  onMove: (stage: StageId) => void;
  onReassign: (owner: string) => void;
  onAddNote: (text: string) => void;
  onDelete: () => void;
}

export function LeadDrawer({ deal, team, isAdmin, onClose, onMove, onReassign, onAddNote, onDelete }: Props) {
  const [note, setNote] = useState('');

  const save = () => {
    if (!note.trim()) return;
    onAddNote(note);
    setNote('');
  };

  return (
    <div className="scrim right" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={deal.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <span className="avatar" style={{ width: 52, height: 52, fontWeight: 800, fontSize: 18, background: 'var(--lime-300)' }}>
            {initials(deal.name)}
          </span>
          <div style={{ flex: 1 }}>
            <div className="drawer-name">{deal.name}</div>
            <div style={{ color: 'var(--ink-500)', fontSize: 14 }}>{deal.company}</div>
          </div>
          <button className="icon-btn" onClick={onClose} title="Cerrar" aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="actions">
          <a className="act dark" href={'mailto:' + deal.email}>
            <Icon name="mail" />
            Correo
          </a>
          <a className="act line" href={'tel:' + deal.phone.replace(/\s/g, '')}>
            <Icon name="phone" />
            Llamar
          </a>
        </div>

        <div className="info-grid">
          <div className="info">
            <div className="info-label">Valor</div>
            <b>{usd(deal.value)}</b>
          </div>
          <div className="info">
            <div className="info-label">Responsable</div>
            <select
              className="owner-select"
              value={deal.owner}
              disabled={!isAdmin}
              onChange={(e) => onReassign(e.target.value)}
              aria-label="Responsable"
            >
              {team.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="info span2">
            <div className="info-label">Contacto</div>
            <a href={'mailto:' + deal.email}>{deal.email}</a> · {deal.phone}
          </div>
        </div>

        <div>
          <div className="section-title">Etapa</div>
          <div className="stage-btns">
            {STAGES.map((s) => {
              const on = deal.stage === s.id;
              return (
                <button
                  key={s.id}
                  className={'stage-btn' + (on ? ' on' : '')}
                  style={on ? { background: s.tag } : undefined}
                  aria-pressed={on}
                  onClick={() => onMove(s.id)}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="section-title">Actividad</div>
          <form
            className="note-form"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <input
              className="pill-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Agregar una nota…"
              aria-label="Nota"
            />
            <button type="submit" className="btn-save">
              Guardar
            </button>
          </form>
          <div className="notes">
            {deal.notes.map((nt, i) => (
              <div key={i} className="note">
                <div className="note-when">{nt.when}</div>
                {nt.text}
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <button className="btn-delete" onClick={onDelete}>
            Eliminar lead
          </button>
        )}
      </aside>
    </div>
  );
}
