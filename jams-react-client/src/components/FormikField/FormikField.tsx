import { Component } from "react";
import PropTypes from "prop-types";
import { ErrorMessage, Field } from "formik";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";

class FormikField extends Component {
  render() {
    return (
      <div className="FormikField">
        <FormControl
          size="medium"
          error={
            this.props.onKeyUpError ||
            <ErrorMessage name={this.props.name} /> === ""
          }
          fullWidth
        >
          <InputLabel htmlFor={this.props.name}>
            {this.props.onKeyUpError ? (
              this.props.onKeyUpErrorMessage
            ) : "" || <ErrorMessage name={this.props.name} /> === "" ? (
              this.props.label
            ) : (
              <ErrorMessage name={this.props.name} />
            )}
          </InputLabel>
          <Field
            placeholder={this.props.placeholder}
            required={this.props.required}
            name={this.props.name}
            as={Input}
            startAdornment={this.props.startAdornment}
            endAdornment={this.props.endAdornment}
            label={this.props.label}
            fullWidth
            type={this.props.type}
            autoComplete={this.props.autoComplete}
            onKeyUp={(e) => this.props.handleChange(e.target.value)}
          />
        </FormControl>
      </div>
    );
  }
}

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
