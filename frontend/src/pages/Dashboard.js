import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Dumbbell, TrendingUp, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const card = {
  background: '#1e2d45',
  border: '1px solid #2a3f5f',
  borderRadius: 16,
  padding: '20px 22px'
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 }
});

function BMIGauge({ bmi }) {
  if (!bmi) return null;
  const color = bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#00e5a0' : bmi < 30 ? '#f97316' : '#ef4444';
  const label = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const pct = Math.min(((bmi - 10) / 30) * 100, 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Your BMI</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{bmi.toFixed(1)} — {label}</span>
      </div>
      <div style={{ background: '#1a2235', borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ height: '100%', background: color, borderRadius: 6 }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div {...fadeUp(delay)} style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ padding: 8, borderRadius: 10, background: color + '22' }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {label}
        </span>
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring' }}
        style={{ fontSize: 32, fontWeight: 800, color }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const user = JSON.parse(localStorage.getItem('fittrack_user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/workouts').then(r => setWorkouts(r.data)).catch(() => {});
    api.get('/progress').then(r => setProgress(r.data)).catch(() => {});
  }, []);

  const bmi = user.weight && user.height ? user.weight / ((user.height / 100) ** 2) : null;
  const totalCalories = workouts.reduce((s, w) => s + (w.calories || 0), 0);
  const thisWeek = workouts.filter(w => (Date.now() - new Date(w.createdAt)) < 7 * 86400000).length;

  const chartData = progress.slice(-10).map(p => ({
    date: new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    weight: p.weight
  }));

  const CAT_COLORS = ['#00e5a0', '#3b82f6', '#8b5cf6', '#f97316', '#fbbf24'];
  const categories = ['chest', 'back', 'legs', 'shoulders', 'arms', 'cardio', 'core', 'full_body'];
  const catCounts = categories
    .map(c => ({ name: c, count: workouts.filter(w => w.category === c).length }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  const quotes = [
    'No Pain, No Gain 💪',
    'Push Your Limits 🔥',
    'Sweat Now, Shine Later ⚡',
    'Be Stronger Than Your Excuses 🏆'
  ];
  const quote = quotes[new Date().getDay() % quotes.length];

  return (
    <div>
      {/* Greeting */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>
          Good {greeting}, {user.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#94a3b8', marginTop: 4 }}>Here's your fitness overview</p>
      </motion.div>

      {/* Motivational Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        style={{
          borderRadius: 20, overflow: 'hidden',
          position: 'relative', marginBottom: 24, height: 160,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/workouts')}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'brightness(0.4)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              {quote}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', maxWidth: 400 }}>
              Every rep counts. Every drop of sweat brings you closer to your goal.
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              background: '#00e5a0', color: '#0a0f1e',
              padding: '12px 24px', borderRadius: 12,
              fontWeight: 700, fontSize: 14,
              whiteSpace: 'nowrap'
            }}
          >
            Log Workout →
          </motion.div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Flame}    label="Day Streak"      value={`${user.streak || 0} 🔥`} color="#f97316" delay={0.1} />
        <StatCard icon={Dumbbell} label="Total Workouts"  value={workouts.length}           color="#00e5a0" delay={0.2} />
        <StatCard icon={Zap}      label="This Week"       value={thisWeek}                  color="#3b82f6" delay={0.3} />
        <StatCard icon={Target}   label="Calories Burned" value={`${totalCalories} kcal`}   color="#8b5cf6" delay={0.4} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <motion.div {...fadeUp(0.5)} style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f0f4ff' }}>Weight Progress</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip contentStyle={{ background: '#1e2d45', border: '1px solid #2a3f5f', borderRadius: 8, color: '#f0f4ff' }} />
                <Line type="monotone" dataKey="weight" stroke="#00e5a0" strokeWidth={2.5} dot={{ fill: '#00e5a0', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>
              Log your weight in Progress tab to see chart
            </div>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.6)} style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f0f4ff' }}>Profile & BMI</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { l: 'Weight', v: user.weight ? `${user.weight}kg` : '—' },
              { l: 'Height', v: user.height ? `${user.height}cm` : '—' },
              { l: 'Age',    v: user.age    ? `${user.age}yrs`   : '—' },
              { l: 'Goal',   v: (user.goal || '').replace('_', ' ') || '—' },
            ].map(({ l, v }) => (
              <div key={l} style={{ background: '#1a2235', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 700, textTransform: 'capitalize', color: '#f0f4ff' }}>{v}</div>
              </div>
            ))}
          </div>
          <BMIGauge bmi={bmi} />
        </motion.div>
      </div>

      {/* Category Badges */}
      {catCounts.length > 0 && (
        <motion.div {...fadeUp(0.7)} style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f0f4ff' }}>Workout Categories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {catCounts.map(({ name, count }, i) => {
              const c = CAT_COLORS[i % CAT_COLORS.length];
              return (
                <motion.div key={name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.05, type: 'spring' }}
                  style={{
                    padding: '7px 14px', borderRadius: 20,
                    background: c + '22',
                    border: `1px solid ${c}55`,
                    fontSize: 12, fontWeight: 700,
                    color: c, textTransform: 'capitalize'
                  }}
                >
                  {name} ({count})
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}