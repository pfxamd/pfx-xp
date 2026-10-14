import React from 'react';

const TOOLS = [
  {
    title: 'Windows Explorer',
    detail: 'Browse files and folders',
    path: 'C:/WINDOWS/explorer.exe',
  },
  {
    title: 'Notepad',
    detail: 'Write and save text files',
    path: 'C:/WINDOWS/system32/notepad.exe',
  },
  {
    title: 'Paint',
    detail: 'Draw and edit images',
    path: 'C:/WINDOWS/system32/mspaint.exe',
  },
  {
    title: 'Calculator',
    detail: 'Standard and scientific modes',
    path: 'C:/WINDOWS/system32/calc.exe',
  },
  {
    title: 'Command Prompt',
    detail: 'Use commands and navigate the virtual disk',
    path: 'C:/WINDOWS/system32/cmd.exe',
  },
  {
    title: 'Control Panel',
    detail: 'Personalize your system',
    path: 'C:/WINDOWS/system32/control.exe',
  },
];

const css = {
  root: { background: '#ece9d8', color: '#222', width: '100%', height: '100%', overflowY: 'auto', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 12, boxSizing: 'border-box' },
  header: { padding: '20px 20px 18px', background: 'linear-gradient(120deg, #0e3272, #3e78ca)', color: '#fff' },
  heading: { fontSize: 19, fontWeight: 700, margin: 0 },
  subtitle: { margin: '7px 0 0', opacity: 0.9, fontSize: 12 },
  body: { padding: '18px 20px' },
  group: { margin: '0 0 12px', color: '#345b8c', fontSize: 12, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 9 },
  item: { textAlign: 'left', border: '1px solid #aab9ce', borderRadius: 5, background: '#fff', color: '#202936', minHeight: 71, padding: '12px 13px', cursor: 'pointer', fontFamily: 'inherit' },
  itemName: { display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 },
  itemDetail: { display: 'block', fontSize: 11, color: '#566174', lineHeight: 1.3 },
  foot: { marginTop: 14, fontSize: 11, color: '#636363', lineHeight: 1.4 },
};

export default function PFxTools({ onShellOpen }) {
  return (
    <main style={css.root}>
      <header style={css.header}>
        <h1 style={css.heading}>PFx Tools</h1>
        <p style={css.subtitle}>System utilities — integrated with the XP shell</p>
      </header>
      <div style={css.body}>
        <h2 style={css.group}>Programs</h2>
        <div style={css.grid}>
          {TOOLS.map(tool => (
            <button
              key={tool.path}
              type="button"
              style={css.item}
              onClick={() => onShellOpen(tool.path)}
              title={tool.path}
            >
              <span style={css.itemName}>{tool.title}</span>
              <span style={css.itemDetail}>{tool.detail}</span>
            </button>
          ))}
        </div>
        <p style={css.foot}>
          Files and settings remain in this browser. Local XP accounts are not a security boundary.
        </p>
      </div>
    </main>
  );
}
