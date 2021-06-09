import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FcOk, FcCancel } from "react-icons/fc";

function UiInput({
  label = "input-01",
  id = "input-01",
  value = "",
  handleChange = () => {},
  handleBlur = () => {},
  handleFlip = () => {},
  errorMessage,
  hasErrorMessage,
  type = "text",
  ...props
}) {
  const [wasFocused, changeWasFocused] = useState(false);

  function handleFocus(e) {
    changeWasFocused(true);
    if (e.target.id === "cardCvv") {
      handleFlip(e);
    }
  }
  function onHandleBlur(e) {
    changeWasFocused(true);
    if (e.target.id === "cardCvv") {
      handleFlip(e);
    }
    handleBlur(e);
  }

  return (
    <TextField
      fullWidth
      required
      id={id}
      label={label}
      name={id}
      variant="filled"
      size="small"
      value={value}
      onChange={handleChange}
      onBlur={onHandleBlur}
      onFocus={handleFocus}
      error={hasErrorMessage && Boolean(errorMessage)}
      helperText={hasErrorMessage && errorMessage}
      type={type}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {wasFocused && !errorMessage && <FcOk />}
            {wasFocused && errorMessage && <FcCancel />}
          </InputAdornment>
        ),
      }}
    />
  );
}

export default UiInput;
