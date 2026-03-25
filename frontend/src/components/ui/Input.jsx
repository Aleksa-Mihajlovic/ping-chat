export default function Input({ label, icon, ...props }) {
  return (
    <div className="input-wrap">
      {label && <label className="input-label">{label}</label>}
      <div className="input-field">
        {icon && icon}
        <input {...props} />
      </div>
    </div>
  )
}
