export default function IconButton({ icon, label, active, size = 36, ...props }) {
  return (
    <button
      className={`icon-btn${active ? ' icon-btn--active' : ''}`}
      style={{ width: size, height: size }}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}
