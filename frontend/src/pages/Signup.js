import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';

export default function Signup({ setAuth }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', weight: '', height: '', goal: 'general_fitness'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('fittrack_token', data.token);
      localStorage.setItem('fittrack_user', JSON.stringify(data.user));
      toast.success('Welcome to FitTrack! 🏋️');
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
    setLoading(false);
  };

  const bgImages = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200'
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT — Background Image */}
      <div style={{
        flex: 1,
        backgroundImage: `url(${bgImages[step - 1]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.5s'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.75), rgba(139,92,246,0.2))'
        }} />
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            {step === 1 ? (
              <>Start Your<br /><span style={{ color: '#00e5a0' }}>Fitness Journey</span></>
            ) : (
              <>Build Your<br /><span style={{ color: '#8b5cf6' }}>Dream Physique</span></>
            )}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, maxWidth: 320 }}>
            {step === 1
              ? 'Join thousands of people achieving their fitness goals every day'
              : 'Tell us about yourself so we can personalize your experience'}
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 28 }}>
            {[['Free', 'Forever'], ['No', 'Ads'], ['100%', 'Private']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#00e5a0' }}>{num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Signup Form */}
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
          style={{ width: '100%', maxWidth: 380 }}
        >
          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? '#00e5a0' : '#2a3f5f',
                transition: 'background .3s'
              }} />
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: '#f0f4ff' }}>
            {step === 1 ? 'Create Account' : 'Your Fitness Profile'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>
            {step === 1 ? 'Step 1 of 2 — Basic info' : 'Step 2 of 2 — Personalize your experience'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {step === 1 ? (
              <>
                <div>
                  <label>Full Name</label>
                  <input className="input" placeholder="John Doe" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label>Email</label>
                  <input className="input" type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label>Password</label>
                  <input className="input" type="password" placeholder="Min 6 characters" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label>Age</label>
                    <input className="input" type="number" placeholder="25" value={form.age}
                      onChange={e => setForm({ ...form, age: e.target.value })} />
                  </div>
                  <div>
                    <label>Weight (kg)</label>
                    <input className="input" type="number" placeholder="70" value={form.weight}
                      onChange={e => setForm({ ...form, weight: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label>Height (cm)</label>
                  <input className="input" type="number" placeholder="175" value={form.height}
                    onChange={e => setForm({ ...form, height: e.target.value })} />
                </div>
                <div>
                  <label>Fitness Goal</label>
                  <select className="input" value={form.goal}
                    onChange={e => setForm({ ...form, goal: e.target.value })}>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </>
            )}
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Creating...' : step === 1 ? 'Continue →' : 'Start Training! 🚀'}
            </button>
          </form>

          {step === 1 && (
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#94a3b8' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#00e5a0', fontWeight: 700, textDecoration: 'none' }}>
                Login
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}