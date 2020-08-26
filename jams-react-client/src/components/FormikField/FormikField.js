import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field } from 'formik';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Input from '@material-ui/core/Input';

class FormikField extends React.Component {
    render() {
        return (
            <div className="FormikField">
                <FormControl size="medium" error={<ErrorMessage name={this.props.name} /> === ""} fullWidth>
                    <InputLabel htmlFor={this.props.name}>{<ErrorMessage name={this.props.name} /> === "" ? this.props.label : <ErrorMessage name={this.props.name} />}</InputLabel>
                    <Field
                        placeholder={this.props.placeholder}
                        required={this.props.required}
                        name={this.props.name}
                        as={Input}
                        startAdornment={this.props.startAdornment}
                        label={this.props.label} 
                        fullWidth
                        type={this.props.type}
                    />
                </FormControl>
            </div>
        )
    }
}

FormikField.propTypes = {
    placeholder: PropTypes.string,
    required: false,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: "text"
};

export default FormikField;