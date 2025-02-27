import React from "react";
import cn from "clsx";

function Input({
  type = "text",
  label = "input-01",
  id = "input-01",
  value = "",
  placeholder = "",
  handleChange = () => {},
  handleBlur = () => {},
  errorMessage,
  hasErrorMessage,
  ...props
}) {
  const classes = cn({
    "form-control": true,
    "is-invalid": hasErrorMessage && errorMessage,
    "is-valid": hasErrorMessage && !errorMessage,
  });
  return (
    <div className="form-group mt-3">
      <label htmlFor={id}>{label}</label>
      <input
        className={classes}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {hasErrorMessage && errorMessage && (
        <p className="invalid-feedback">{errorMessage}</p>
      )}
    </div>
  );
}

export default Input;
