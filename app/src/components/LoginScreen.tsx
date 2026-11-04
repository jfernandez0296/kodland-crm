import { useState } from 'react';
import { accessLabel, Member } from '../data';

interface Props {
  team: Member[];
  defaultUser: string;
  message: string;
  onLogin: (user: string, password: string) => void;
}

export function LoginScreen({ team, defaultUser, message, onLogin }: Props) {
  const [user, setUser] = useState(team.some((t) => t.name === defaultUser) ? defaultUser : team[0]?.name ?? '');
  const [pass, setPass] = useState('');

  return (
    <div className="login">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(user, pass);
        }}
      >
        <div className="login-brand">
          kodland<span>CRM</span>
        </div>
        <div className="login-msg" role="status">
          {message}
        </div>
        <select className="field" value={user} onChange={(e) => setUser(e.target.value)} aria-label="Usuario">
          {team.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} — {accessLabel(t.access)}
            </option>
          ))}
        </select>
        <input
          className="field"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Contraseña"
          aria-label="Contraseña"
        />
        <button type="submit" className="btn-dark">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
