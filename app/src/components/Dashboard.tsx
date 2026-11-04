import { Deal, needsFollowUp, STAGES, usd } from '../data';

interface Props {
  deals: Deal[];
  onOpen: (id: number) => void;
}

const sum = (a: Deal[]) => a.reduce((x, d) => x + d.value, 0);

export function Dashboard({ deals, onOpen }: Props) {
  const won = deals.filter((d) => d.stage === 'ganado');
  const active = deals.filter((d) => d.stage !== 'ganado');
  const n = deals.length;
  const byStage = STAGES.map((s) => ({ stage: s, total: sum(deals.filter((d) => d.stage === s.id)) }));
  const maxV = Math.max(1, ...byStage.map((b) => b.total));

  const kpis = [
    { label: 'Valor en pipeline', value: usd(sum(active)), sub: active.length + ' leads activos', brand: true },
    { label: 'Ganado', value: usd(sum(won)), sub: won.length + ' cierres' },
    { label: 'Tasa de cierre', value: (n ? Math.round((won.length / n) * 100) : 0) + '%', sub: 'sobre ' + n + ' leads' },
    { label: 'Ticket promedio', value: usd(n ? Math.round(sum(deals) / n) : 0), sub: 'por lead' },
  ];

  return (
    <div className="stack scroll-area">
      <div className="kpis">
        {kpis.map((k) => (
          <div key={k.label} className={'kpi' + (k.brand ? ' brand' : '')}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Valor por etapa</h2>
        <div className="bars">
          {byStage.map(({ stage, total }) => (
            <div key={stage.id} className="bar">
              <span style={{ fontWeight: 600 }}>{stage.name}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{ background: stage.color, width: Math.round((total / maxV) * 100) + '%' }}
                />
              </span>
              <b style={{ textAlign: 'right' }}>{usd(total)}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2 className="tight">Seguimientos pendientes</h2>
        {deals.filter(needsFollowUp).map((d) => (
          <button key={d.id} className="followup" onClick={() => onOpen(d.id)}>
            <span>
              <b>{d.name}</b> · {d.company}
            </span>
            <span style={{ color: 'var(--ink-500)' }}>Último contacto {d.last}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
