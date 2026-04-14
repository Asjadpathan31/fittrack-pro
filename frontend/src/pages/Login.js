import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Dumbbell } from 'lucide-react';
import api from '../api';

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('fittrack_token', data.token);
      localStorage.setItem('fittrack_user', JSON.stringify(data.user));
      toast.success('Welcome back! 💪');
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT — Background Image */}
      <div style={{
        flex: 1,
        backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.72), rgba(0,229,160,0.18))'
        }} />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px' }}
        >
          <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Transform<br />
            <span style={{ color: '#00e5a0' }}>Your Body</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 340 }}>
            Track workouts, monitor progress, and achieve your fitness goals
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
            {[['500+', 'Exercises'], ['10K+', 'Users'], ['98%', 'Success']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#00e5a0' }}>{num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Login Form */}
      <div style={{
        width: 460,
        background: '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ display: 'inline-flex', marginBottom: 12 }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg,#00e5a0,#3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Dumbbell size={28} color="#0a0f1e" />
              </div>
            </motion.div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f0f4ff' }}>Welcome Back!</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Login to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#94a3b8' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#00e5a0', fontWeight: 700, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}