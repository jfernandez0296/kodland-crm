import { useMemo, useState } from 'react';
import { Deal, initials, stageIndex, stageOf, usd } from '../data';

type SortKey = 'name' | 'company' | 'stage' | 'value' | 'owner';

const HEADS: [SortKey, string][] = [
  ['name', 'Contacto'],
  ['company', 'Empresa'],
  ['stage', 'Etapa'],
  ['value', 'Valor'],
  ['owner', 'Responsable'],
];

interface Props {
  deals: Deal[];
  onOpen: (id: number) => void;
}

export function Contacts({ deals, onOpen }: Props) {
  const [sortK, setSortK] = useState<SortKey>('name');
  const [sortD, setSortD] = useState<1 | -1>(1);

  const sorted = useMemo(() => {
    const key = (d: Deal): string | number =>
      sortK === 'value' ? d.value : sortK === 'stage' ? stageIndex(d.stage) : String(d[sortK]).toLowerCase();
    return [...deals].sort((a, b) => {
      const ka = key(a), kb = key(b);
      return (ka > kb ? 1 : ka < kb ? -1 : 0) * sortD;
    });
  }, [deals, sortK, sortD]);

  const sortBy = (k: SortKey) => {
    setSortD(sortK === k ? (-sortD as 1 | -1) : 1);
    setSortK(k);
  };

  return (
    <div className="pad scroll-area">
      <div className="table">
        <div className="thead">
          {HEADS.map(([k, label]) => (
            <button key={k} className={'th' + (sortK === k ? ' on' : '')} onClick={() => sortBy(k)}>
              {label}
              <span>{sortK === k ? (sortD > 0 ? '↑' : '↓') : ''}</span>
            </button>
          ))}
        </div>
        {sorted.map((d) => {
          const st = stageOf(d.stage);
          return (
            <div key={d.id} className="trow" onClick={() => onOpen(d.id)}>
              <span className="person">
                <span className="avatar" style={{ width: 34, height: 34, fontSize: 13, background: 'var(--lime-300)' }}>
                  {initials(d.name)}
                </span>
                <span>
                  <b>{d.name}</b>
                  <br />
                  <span className="muted-sm">{d.email}</span>
                </span>
              </span>
              <span>{d.company}</span>
              <span>
                <span className="stage-tag" style={{ background: st.tag }}>
                  {st.name}
                </span>
              </span>
              <b>{usd(d.value)}</b>
              <span>{d.owner}</span>
            </div>
          );
        })}
        {deals.length === 0 && <div className="empty-msg">Sin resultados para esa búsqueda.</div>}
      </div>
    </div>
  );
}
