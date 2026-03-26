import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, icon, error, className, ...props }, ref) {
  return (
    <div className={`input-wrap${className ? ` ${className}` : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-field">
        {icon && icon}
        <input ref={ref} {...props} />
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  )
})

export default Input
