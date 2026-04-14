import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, TrendingUp, LogOut, Flame } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('fittrack_user') || '{}');

  const logout = () => {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/workouts',  icon: Dumbbell,        label: 'Workouts'  },
    { to: '/progress',  icon: TrendingUp,       label: 'Progress'  },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: 240, background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 16px', position: 'sticky',
          top: 0, height: '100vh'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg,var(--green),var(--blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Dumbbell size={20} color="#0a0f1e" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--green)' }}>FitTrack</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10,
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
              color: isActive ? '#0a0f1e' : 'var(--muted)',
              background: isActive ? 'var(--green)' : 'transparent',
              transition: 'all .2s'
            })}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--purple),var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--orange)' }}>
                <Flame size={11} />{user.streak || 0} day streak
              </div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '9px', background: 'transparent',
            border: '1.5px solid var(--border)', borderRadius: 8,
            color: 'var(--muted)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all .2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--red)'; e.currentTarget.style.color='var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)'; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </motion.aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}