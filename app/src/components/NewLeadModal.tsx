import { useState } from 'react';
import { Member } from '../data';

export interface NewLead {
  name: string;
  company: string;
  email: string;
  value: string;
  owner: string;
}

interface Props {
  team: Member[];
  isAdmin: boolean;
  onClose: () => void;
  onCreate: (f: NewLead) => void;
}

export function NewLeadModal({ team, isAdmin, onClose, onCreate }: Props) {
  const [f, setF] = useState<NewLead>({ name: '', company: '', email: '', value: '', owner: team[0]?.name ?? '' });
  const bind = (k: keyof NewLead) => ({
    value: f[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value }),
  });

  return (
    <div className="scrim center" onClick={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo lead"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (f.name.trim()) onCreate(f);
        }}
      >
        <h2>Nuevo lead</h2>
        <input className="field" {...bind('name')} placeholder="Nombre" aria-label="Nombre" autoFocus />
        <input className="field" {...bind('company')} placeholder="Empresa" aria-label="Empresa" />
        <input className="field" {...bind('email')} placeholder="Correo" aria-label="Correo" type="email" />
        {isAdmin && (
          <select className="field" {...bind('owner')} aria-label="Responsable">
            {team.map((t) => (
              <option key={t.name} value={t.name}>
                Responsable: {t.name}
              </option>
            ))}
          </select>
        )}
        <input
          className="field"
          {...bind('value')}
          placeholder="Valor estimado (USD)"
          aria-label="Valor estimado (USD)"
          type="number"
          min={0}
        />
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" style={{ padding: '11px 22px' }}>
            Crear lead
          </button>
        </div>
      </form>
    </div>
  );
}
