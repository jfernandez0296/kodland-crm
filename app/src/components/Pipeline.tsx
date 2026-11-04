import { useState } from 'react';
import { Deal, initials, isStale, nextStage, STAGES, StageId, usd } from '../data';
import { Icon } from './Icon';

interface Props {
  deals: Deal[];
  onMove: (id: number, stage: StageId) => void;
  onOpen: (id: number) => void;
}

export function Pipeline({ deals, onMove, onOpen }: Props) {
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<StageId | null>(null);

  const endDrag = () => {
    setDrag(null);
    setOver(null);
  };

  return (
    <div className="board thin-scroll">
      {STAGES.map((s) => {
        const ds = deals.filter((d) => d.stage === s.id);
        return (
          <div
            key={s.id}
            className={'col-stage' + (over === s.id ? ' over' : '')}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setOver(s.id)}
            onDrop={(e) => {
              e.preventDefault();
              if (drag != null) onMove(drag, s.id);
              endDrag();
            }}
          >
            <div className="col-head">
              <span className="col-dot" style={{ background: s.color }} />
              <b className="col-name">{s.name}</b>
              <span className="col-count">{ds.length}</span>
            </div>
            <div className="col-total">{usd(ds.reduce((a, d) => a + d.value, 0))}</div>
            {ds.length === 0 && <div className="col-empty">Arrastra un lead aquí</div>}
            <div className="col-cards thin-scroll">
              {ds.map((d) => {
                const next = nextStage(d.stage);
                const stale = isStale(d);
                return (
                  <div
                    key={d.id}
                    className="card"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', String(d.id));
                      setDrag(d.id);
                    }}
                    onDragEnd={endDrag}
                    onClick={() => onOpen(d.id)}
                  >
                    <div className="card-row">
                      <span className="avatar" style={{ width: 34, height: 34, fontSize: 12, background: s.tag }}>
                        {initials(d.name)}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div className="card-name ellip">{d.name}</div>
                        <div className="card-co ellip">{d.company}</div>
                      </div>
                    </div>
                    <div className="card-foot">
                      <b className="card-value">{usd(d.value)}</b>
                      <span className="card-last">
                        <Icon name="clock" size={13} />
                        {stale && (
                          <span
                            className="stale-dot"
                            style={{ background: 'var(--orange-500)' }}
                            title="Sin contacto reciente"
                          />
                        )}
                        <span className="card-last-text" title={d.last}>
                          {d.last}
                        </span>
                      </span>
                      {next && (
                        <button
                          className="next-btn"
                          title="Mover a la siguiente etapa"
                          aria-label={`Mover a ${next.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMove(d.id, next.id);
                          }}
                        >
                          <Icon name="chevronRight" size={14} strokeWidth={2.4} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
