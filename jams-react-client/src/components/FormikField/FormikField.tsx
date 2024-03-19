import React, { ReactElement } from "react";
import PropTypes from "prop-types";
import { ErrorMessage, Field } from "formik";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";

interface FormikFieldProps {
  startAdornment?: ReactElement;
  endAdornment?: ReactElement;
  placeholder?: string;
  required?: boolean;
  name: string;
  label: string;
  type?: string;
  autoComplete?: "on" | "off";
  handleChange?: (value: string) => void;
  onKeyUpError?: boolean;
  onKeyUpErrorMessage?: string;
}

const FormikField = (props: FormikFieldProps) => {
  return (
    <div className="FormikField">
      <FormControl size="medium" error={props.onKeyUpError} fullWidth>
        <InputLabel htmlFor={props.name}>
          {props.onKeyUpError ? (
            props.onKeyUpErrorMessage
          ) : (
            <ErrorMessage name={props.name} />
          )}
        </InputLabel>
        <Field
          placeholder={props.placeholder}
          required={props.required}
          name={props.name}
          as={Input}
          startAdornment={props.startAdornment}
          endAdornment={props.endAdornment}
          label={props.label}
          fullWidth
          type={props.type}
          autoComplete={props.autoComplete}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            props.handleChange?.(e.currentTarget.value)
          }
        />
      </FormControl>
    </div>
  );
};

FormikField.propTypes = {
  startAdornment: PropTypes.element,
  endAdornment: PropTypes.element,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.oneOf(["on", "off"]),
  handleChange: PropTypes.func,
  onKeyUpError: PropTypes.bool,
  onKeyUpErrorMessage: PropTypes.string,
};

export default FormikField;
