const COLORS = ['#e17055', '#74b9ff', '#a29bfe', '#55efc4', '#fd79a8', '#fdcb6e', '#00b894', '#e84393']

function colorFor(name) {
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

export default function Avatar({ name, size = 40, online }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: colorFor(name),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 600, fontSize: size * 0.38,
        userSelect: 'none',
      }}>
        {initials}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 10, height: 10, borderRadius: '50%',
          background: online ? '#00a884' : '#8696a0',
          border: '2px solid var(--sidebar)',
        }} />
      )}
    </div>
  )
}
