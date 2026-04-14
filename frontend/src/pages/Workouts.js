import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, ChevronDown, ChevronUp, Dumbbell, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const CATS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'cardio', 'core', 'full_body'];

const COLORS = {
  chest: '#ef4444', back: '#3b82f6', legs: '#8b5cf6',
  shoulders: '#f97316', arms: '#fbbf24', cardio: '#00e5a0',
  core: '#ec4899', full_body: '#06b6d4'
};

const EXERCISE_IMAGES = {
  chest: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
  back: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=600',
  legs: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600',
  shoulders: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600',
  arms: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=600',
  cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600',
  core: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
  full_body: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'
};

const EXERCISE_SUGGESTIONS = {
  chest: [
    { name: 'Bench Press', calsPerSet: 8 },
    { name: 'Push Ups', calsPerSet: 5 },
    { name: 'Incline Dumbbell Press', calsPerSet: 7 },
    { name: 'Cable Flyes', calsPerSet: 6 },
    { name: 'Chest Dips', calsPerSet: 7 },
    { name: 'Decline Bench Press', calsPerSet: 8 },
  ],
  back: [
    { name: 'Pull Ups', calsPerSet: 8 },
    { name: 'Deadlift', calsPerSet: 12 },
    { name: 'Bent Over Row', calsPerSet: 9 },
    { name: 'Lat Pulldown', calsPerSet: 7 },
    { name: 'Seated Cable Row', calsPerSet: 6 },
    { name: 'T-Bar Row', calsPerSet: 8 },
  ],
  legs: [
    { name: 'Squat', calsPerSet: 12 },
    { name: 'Leg Press', calsPerSet: 10 },
    { name: 'Romanian Deadlift', calsPerSet: 10 },
    { name: 'Lunges', calsPerSet: 8 },
    { name: 'Leg Curl', calsPerSet: 6 },
    { name: 'Calf Raises', calsPerSet: 4 },
  ],
  shoulders: [
    { name: 'Overhead Press', calsPerSet: 9 },
    { name: 'Lateral Raises', calsPerSet: 5 },
    { name: 'Front Raises', calsPerSet: 5 },
    { name: 'Arnold Press', calsPerSet: 8 },
    { name: 'Face Pulls', calsPerSet: 5 },
    { name: 'Shrugs', calsPerSet: 5 },
  ],
  arms: [
    { name: 'Bicep Curl', calsPerSet: 5 },
    { name: 'Tricep Pushdown', calsPerSet: 5 },
    { name: 'Hammer Curl', calsPerSet: 5 },
    { name: 'Skull Crushers', calsPerSet: 6 },
    { name: 'Preacher Curl', calsPerSet: 5 },
    { name: 'Overhead Tricep Extension', calsPerSet: 6 },
  ],
  cardio: [
    { name: 'Running (Treadmill)', calsPerSet: 15 },
    { name: 'Cycling', calsPerSet: 12 },
    { name: 'Jump Rope', calsPerSet: 10 },
    { name: 'Burpees', calsPerSet: 12 },
    { name: 'Box Jumps', calsPerSet: 10 },
    { name: 'Rowing Machine', calsPerSet: 13 },
  ],
  core: [
    { name: 'Plank', calsPerSet: 4 },
    { name: 'Crunches', calsPerSet: 4 },
    { name: 'Russian Twists', calsPerSet: 5 },
    { name: 'Leg Raises', calsPerSet: 5 },
    { name: 'Mountain Climbers', calsPerSet: 7 },
    { name: 'Ab Wheel Rollout', calsPerSet: 6 },
  ],
  full_body: [
    { name: 'Deadlift', calsPerSet: 12 },
    { name: 'Squat', calsPerSet: 12 },
    { name: 'Clean and Press', calsPerSet: 14 },
    { name: 'Kettlebell Swings', calsPerSet: 10 },
    { name: 'Thrusters', calsPerSet: 13 },
    { name: 'Battle Ropes', calsPerSet: 11 },
  ],
};

const calcCalories = (exercises, category) => {
  const suggestions = EXERCISE_SUGGESTIONS[category] || [];
  let total = 0;
  exercises.forEach(ex => {
    const found = suggestions.find(s => s.name === ex.name);
    const calsPerSet = found ? found.calsPerSet : 6;
    total += calsPerSet * (ex.sets || 3);
  });
  return total;
};

const emptyEx = () => ({ name: '', sets: 3, reps: 10, weight: 0, duration: 0 });
const emptyForm = () => ({
  title: '', category: 'full_body',
  duration: 0, calories: 0,
  notes: '', exercises: [emptyEx()]
});

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all');
  const [autoCals, setAutoCals] = useState(0);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const cal = calcCalories(form.exercises, form.category);
    setAutoCals(cal);
    setForm(prev => ({ ...prev, calories: cal }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.exercises, form.category]);

  const load = async () => {
    try {
      const { data } = await api.get('/workouts');
      setWorkouts(data);
    } catch {
      toast.error('Failed to load');
    }
  };

  const save = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/workouts/${editId}`, form);
        toast.success('Updated!');
      } else {
        const { data } = await api.post('/workouts', form);
        if (data.streak) {
          const u = JSON.parse(localStorage.getItem('fittrack_user') || '{}');
          u.streak = data.streak;
          localStorage.setItem('fittrack_user', JSON.stringify(u));
        }
        toast.success('Workout logged! 💪');
      }
      setShowModal(false);
      setEditId(null);
      setForm(emptyForm());
      load();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const del = async id => {
    if (!window.confirm('Delete workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const openEdit = w => {
    setEditId(w._id);
    setForm({
      title: w.title, category: w.category,
      duration: w.duration, calories: w.calories,
      notes: w.notes,
      exercises: w.exercises.length ? w.exercises : [emptyEx()]
    });
    setShowModal(true);
  };

  const updateEx = (i, field, val) => {
    const ex = [...form.exercises];
    ex[i] = { ...ex[i], [field]: val };
    setForm(prev => ({ ...prev, exercises: ex }));
  };

  const addSuggestedExercise = (exName) => {
    const already = form.exercises.find(e => e.name === exName);
    if (already) { toast.error('Already added!'); return; }
    const newEx = { name: exName, sets: 3, reps: 10, weight: 0, duration: 0 };
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises.filter(e => e.name !== ''), newEx]
    }));
    toast.success(`${exName} added!`);
  };

  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.category === filter);
  const suggestions = EXERCISE_SUGGESTIONS[form.category] || [];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f0f4ff' }}>Workouts</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>{workouts.length} sessions logged</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditId(null); setForm(emptyForm()); setShowModal(true); }}
          style={{
            background: '#00e5a0', color: '#0a0f1e', border: 'none',
            padding: '10px 20px', borderRadius: 12, fontWeight: 700,
            fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <Plus size={16} /> Log Workout
        </motion.button>
      </motion.div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['all', ...CATS].map(c => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(c)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              textTransform: 'capitalize',
              background: filter === c ? (COLORS[c] || '#00e5a0') : '#1a2235',
              color: filter === c ? '#0a0f1e' : '#94a3b8',
              transition: 'all .2s'
            }}
          >
            {c === 'all' ? 'All' : c.replace('_', ' ')}
          </motion.button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
          <Dumbbell size={52} style={{ marginBottom: 14, opacity: 0.25 }} />
          <p style={{ fontSize: 16 }}>No workouts yet. Log your first one!</p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          <AnimatePresence>
            {filtered.map((w, i) => (
              <motion.div key={w._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                style={{ background: '#1e2d45', border: '1px solid #2a3f5f', borderRadius: 16, overflow: 'hidden' }}
              >
                {/* Image */}
                <div style={{
                  height: 150,
                  backgroundImage: `url(${EXERCISE_IMAGES[w.category]})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(30,45,69,0.95) 100%)' }} />
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: COLORS[w.category] + 'ee', color: '#0a0f1e',
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize'
                  }}>
                    {w.category.replace('_', ' ')}
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(w)} style={{ background: 'rgba(30,45,69,0.85)', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '6px 8px', borderRadius: 8 }}>
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => del(w._id)} style={{ background: 'rgba(30,45,69,0.85)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px 8px', borderRadius: 8 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {w.calories > 0 && (
                    <div style={{
                      position: 'absolute', bottom: 14, right: 14,
                      background: 'rgba(249,115,22,0.9)', color: '#fff',
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700
                    }}>
                      🔥 {w.calories} kcal
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#f0f4ff', marginBottom: 6 }}>{w.title}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    {w.duration > 0 && <span style={{ fontSize: 12, color: '#94a3b8' }}>⏱ {w.duration} min</span>}
                    {w.exercises.length > 0 && <span style={{ fontSize: 12, color: '#94a3b8' }}>💪 {w.exercises.length} exercises</span>}
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(w.createdAt).toLocaleDateString()}</span>
                  </div>
                  {w.exercises.length > 0 && (
                    <button
                      onClick={() => setExpanded(p => ({ ...p, [w._id]: !p[w._id] }))}
                      style={{
                        background: 'none', border: '1px solid #2a3f5f', color: '#94a3b8',
                        cursor: 'pointer', padding: '5px 12px', borderRadius: 8,
                        fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center',
                        gap: 4, width: '100%', justifyContent: 'center'
                      }}
                    >
                      {expanded[w._id] ? <><ChevronUp size={12} /> Hide Exercises</> : <><ChevronDown size={12} /> Show {w.exercises.length} Exercises</>}
                    </button>
                  )}
                  <AnimatePresence>
                    {expanded[w._id] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {w.exercises.map((ex, j) => (
                            <div key={j} style={{ background: '#1a2235', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff' }}>{ex.name}</span>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                {ex.sets}×{ex.reps}{ex.weight > 0 ? ` @ ${ex.weight}kg` : ''}{ex.duration > 0 ? ` ${ex.duration}s` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#111827', border: '1px solid #2a3f5f', borderRadius: 20, padding: 28, width: '100%', maxWidth: 620, maxHeight: '92vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f4ff' }}>
                  {editId ? 'Edit Workout' : 'Log New Workout'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Image Preview */}
              <div style={{ height: 110, borderRadius: 12, overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
                <div style={{
                  width: '100%', height: '100%',
                  backgroundImage: `url(${EXERCISE_IMAGES[form.category]})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.55)', transition: 'all 0.4s'
                }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, textTransform: 'capitalize' }}>
                    {form.category.replace('_', ' ')}
                  </span>
                  {autoCals > 0 && (
                    <span style={{ background: 'rgba(249,115,22,0.9)', color: '#fff', padding: '5px 14px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>
                      🔥 {autoCals} kcal
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label>Workout Title *</label>
                  <input className="input" placeholder="e.g. Push Day" value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label>Category</label>
                    <select className="input" value={form.category}
                      onChange={e => setForm(prev => ({ ...prev, category: e.target.value, exercises: [emptyEx()] }))}>
                      {CATS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Duration (min)</label>
                    <input className="input" type="number" placeholder="45" value={form.duration}
                      onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} />
                  </div>
                </div>

                {/* Auto Calorie Box */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.1))',
                  border: '1px solid rgba(249,115,22,0.35)',
                  borderRadius: 12, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={16} color="#f97316" />
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Auto Calculated Calories</span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>
                    {autoCals} kcal 🔥
                  </span>
                </div>

                {/* Exercise Suggestions */}
                <div>
                  <label>Tap to Add Suggested Exercises</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {suggestions.map(s => {
                      const isAdded = form.exercises.some(e => e.name === s.name);
                      return (
                        <motion.button
                          key={s.name}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addSuggestedExercise(s.name)}
                          style={{
                            padding: '5px 12px', borderRadius: 20,
                            border: `1px solid ${isAdded ? COLORS[form.category] : '#2a3f5f'}`,
                            background: isAdded ? COLORS[form.category] + '33' : '#1a2235',
                            color: isAdded ? COLORS[form.category] : '#94a3b8',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s'
                          }}
                        >
                          {isAdded ? '✓ ' : '+ '}{s.name}
                          <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>~{s.calsPerSet * 3}cal</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Exercises List */}
                <div style={{ borderTop: '1px solid #2a3f5f', paddingTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ margin: 0 }}>Your Exercises</label>
                    <button type="button"
                      onClick={() => setForm(prev => ({ ...prev, exercises: [...prev.exercises, emptyEx()] }))}
                      style={{ background: 'none', border: '1px solid #00e5a0', color: '#00e5a0', padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                      + Custom
                    </button>
                  </div>
                  {form.exercises.map((ex, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      style={{ background: '#1a2235', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input className="input" placeholder="Exercise name" value={ex.name}
                          onChange={e => updateEx(i, 'name', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', fontSize: 13 }} />
                        {form.exercises.length > 1 && (
                          <button type="button"
                            onClick={() => setForm(prev => ({ ...prev, exercises: prev.exercises.filter((_, j) => j !== i) }))}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                        {[['sets', 'Sets'], ['reps', 'Reps'], ['weight', 'kg'], ['duration', 'sec']].map(([f, l]) => (
                          <div key={f}>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 3 }}>{l}</div>
                            <input className="input" type="number" value={ex[f]}
                              onChange={e => updateEx(i, f, +e.target.value)}
                              style={{ padding: '6px 8px', fontSize: 13, textAlign: 'center' }} />
                          </div>
                        ))}
                      </div>
                      {ex.name && (() => {
                        const found = suggestions.find(s => s.name === ex.name);
                        if (!found) return null;
                        return (
                          <div style={{ marginTop: 6, fontSize: 11, color: '#f97316', textAlign: 'right' }}>
                            🔥 ~{found.calsPerSet * (ex.sets || 3)} kcal for {ex.sets || 3} sets
                          </div>
                        );
                      })()}
                    </motion.div>
                  ))}
                </div>

                <div>
                  <label>Notes</label>
                  <textarea className="input" rows={2} placeholder="How did it feel? Any PRs today?"
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
                </div>

                {/* Total Summary */}
                {autoCals > 0 && (
                  <div style={{ background: '#1a2235', borderRadius: 10, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Total Calories This Workout</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>🔥 {autoCals} kcal</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ padding: 12, background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: 10, color: '#94a3b8', cursor: 'pointer', fontWeight: 700 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ width: 'auto', margin: 0 }}>
                    {editId ? 'Update Workout' : `Save — ${autoCals} kcal 💪`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}