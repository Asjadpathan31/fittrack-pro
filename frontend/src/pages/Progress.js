import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function Progress() {
  const [data, setData] = useState([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await api.get('/progress'); setData(r.data); }
    catch { toast.error('Failed to load'); }
  };

  const add = async e => {
    e.preventDefault();
    if (!weight) return;
    try {
      await api.post('/progress', { weight: +weight, notes });
      setWeight(''); setNotes('');
      toast.success('Weight logged!');
      load();
    } catch { toast.error('Failed to save'); }
  };

  const del = async id => {
    try { await api.delete(`/progress/${id}`); toast.success('Removed'); load(); }
    catch { toast.error('Failed'); }
  };

  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { month:'short', day:'numeric' }),
    weight: d.weight
  }));

  const latest = data[data.length-1]?.weight;
  const prev   = data[data.length-2]?.weight;
  const diff   = latest && prev ? (latest-prev).toFixed(1) : null;
  const first  = data[0]?.weight;
  const total  = latest && first ? (latest-first).toFixed(1) : null;

  return (
    <div>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800 }}>Progress Tracker</h1>
        <p style={{ color:'var(--muted)', fontSize:13, marginTop:2 }}>Monitor your weight over time</p>
      </motion.div>

      {latest && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Current Weight', value:`${latest} kg`,                                              color:'var(--green)'  },
            { label:'Since Last',     value: diff ? `${diff>0?'+':''}${diff} kg` : '—',                 color: diff>0 ? 'var(--red)':'var(--green)' },
            { label:'Total Change',   value: total ? `${total>0?'+':''}${total} kg` : '—',              color: total>0 ? 'var(--orange)':'var(--blue)' },
          ].map(({ label, value, color }, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
              style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 20px' }}>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6, fontWeight:600 }}>{label}</div>
              <div style={{ fontSize:26, fontWeight:800, color }}>{value}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px' }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Weight Chart</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} width={40}/>
                <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)' }}/>
                <Area type="monotone" dataKey="weight" stroke="var(--green)" strokeWidth={2.5} fill="url(#wg)" dot={{ fill:'var(--green)', r:4 }}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)', fontSize:13 }}>
              Log at least 2 entries to see chart
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px', marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Log Weight</h3>
            <form onSubmit={add} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div><label>Weight (kg)</label>
                <input className="input" type="number" step="0.1" placeholder="70.5" value={weight}
                  onChange={e => setWeight(e.target.value)} required />
              </div>
              <div><label>Notes (optional)</label>
                <input className="input" placeholder="e.g. After morning run" value={notes}
                  onChange={e => setNotes(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop:4 }}>
                + Log Entry
              </button>
            </form>
          </div>

          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'16px 20px', maxHeight:280, overflowY:'auto' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>History</h3>
            {data.length === 0 ? (
              <p style={{ color:'var(--muted)', fontSize:13, textAlign:'center', padding:'20px 0' }}>No entries yet</p>
            ) : (
              [...data].reverse().map((d, i) => (
                <div key={d._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i < data.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{d.weight} kg</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{new Date(d.date).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => del(d._id)}
                    style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', opacity:.6 }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}