import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Typography, IconButton, TextField, Divider, Fab, Tooltip, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function getAuthUser() {
  try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { return null; }
}
async function apiFetch(url, options = {}) {
  const token = getAuthUser()?.token;
  const headers = { 'Content-Type': 'application/json', ...(options.headers||{}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.status === 204 ? null : res.json();
}

export default function DonorAssistantBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('donor_bot_history') || '[]'); } catch { return []; }
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('donor_bot_history', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!messages.length) {
      setMessages([{ from: 'bot', text: "Hi! I'm your Donor Assistant. Try 'eligibility', 'how to donate', or 'my requests'.", ts: Date.now() }]);
    }
  }, [messages.length]);

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { from: 'me', text, ts: Date.now() }]);
    await respond(text);
  }

  function add(text) { setMessages(m => [...m, { from: 'bot', text, ts: Date.now() }]); }

  async function respond(text) {
    const q = text.toLowerCase();
    setLoading(true);
    try {
      if (/^(eligibility|am i eligible)/.test(q)) {
        add(`Eligibility:
• Age 18–65 (organ rules vary), 18–60 for blood (typical)
• No active infections/uncontrolled chronic illness
• Hemoglobin ok for blood donation
• Recent surgeries/piercings may need waiting`);
      } else if (/^(how to donate|register)/.test(q)) {
        add(`How to donate:
1) Complete Donor Profile  2) Choose blood/organ pledge
3) Submit & await confirmation  4) Book slot or print donor card`);
      } else if (/^(my requests|requests|status)$/.test(q)) {
        try {
          const endpoints = ['/api/requests/mine','/api/blood-requests/mine','/api/organ-requests/mine','/api/donor/requests'];
          let res=null, url='';
          for (const u of endpoints) { try { res = await apiFetch(u); url=u; break; } catch {} }
          if (!res) { add("I couldn't reach your requests API. Please open My Requests page."); return; }
          const arr = Array.isArray(res) ? res : (res?.content || []);
          if (!arr.length) add('You have no active requests right now.');
          else {
            const lines = arr.slice(0,5).map((r,i)=>`• #${r.id ?? r.requestId ?? i+1} — ${(r.type||r.requestType||'Request')} — ${(r.status||'PENDING')}`);
            add(`Here are your latest requests (from ${url}):\n${lines.join('\n')}${arr.length>5?'\n…(showing first 5)':''}`);
          }
        } catch { add("I couldn't reach your requests API. Please open My Requests page."); }
      } else {
        add("I can help with 'eligibility', 'how to donate', or 'my requests'.");
      }
    } finally { setLoading(false); }
  }

  return (
    <>
      {!open && (
        <Tooltip title="Donor Assistant">
          <Fab color="primary" sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1500 }} onClick={() => setOpen(true)}>
            <ChatIcon />
          </Fab>
        </Tooltip>
      )}
      {open && (
        <Paper elevation={8} sx={{ position: 'fixed', right: 20, bottom: 20, width: 360, height: 480, display: 'flex',
          flexDirection: 'column', borderRadius: 3, overflow: 'hidden', zIndex: 1500 }}>
          <Box sx={{ p: 1.2, display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography sx={{ fontWeight: 700, flex: 1 }}>Donor Assistant</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'inherit' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider />
          <Box ref={scrollRef} sx={{ flex: 1, p: 1.2, overflowY: 'auto', bgcolor: 'background.default' }}>
            {messages.map((m,i)=>(
              <Box key={i} sx={{ display:'flex', justifyContent: m.from==='me'?'flex-end':'flex-start', mb: 1 }}>
                <Box sx={{ maxWidth:'80%', px:1.2, py:0.8, borderRadius:2, bgcolor: m.from==='me'?'primary.light':'grey.100',
                  color: m.from==='me'?'common.white':'text.primary', whiteSpace:'pre-wrap', wordBreak:'break-word', boxShadow:1, fontSize:14 }}>
                  {m.text}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display:'flex', alignItems:'center', gap:1, color:'text.secondary', fontSize:13 }}>
                <CircularProgress size={16} /> thinking…
              </Box>
            )}
          </Box>
          <Divider />
          <Box component="form" onSubmit={handleSend} sx={{ p: 1, display: 'flex', gap: 1 }}>
            <TextField size="small" fullWidth placeholder="Ask: eligibility / how to donate / my requests"
              value={input} onChange={(e)=>setInput(e.target.value)} />
            <IconButton type="submit" color="primary" disabled={!input.trim() || loading}><SendIcon /></IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
