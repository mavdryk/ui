import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { FormInput, FormSelect } from 'igz-controls/components'
import { selectOptions } from './formHyperParametersTable.util'

const FormHyperParametersTable = ({ formState, fieldsPath }) => {
    const paramFilePath = `${fieldsPath}.paramFile`
    const tuningStrategyPath = `${fieldsPath}.tuningStrategy`
    const resultPath = `${fieldsPath}.result`
    const criteriaPath = `${fieldsPath}.criteria`

    return (
        <div className="form-row">
            <div className="form-col-3">
                <FormInput
                    label="Read hyper params from a file"
                    placeholder="v3io:///projects/my-proj/param.txt"
                    type="text"
                    name={paramFilePath}
                />
            </div>
            <div className="form-col-1">
                <FormSelect
                    disabled={!get(formState.values, paramFilePath.split('.'), '')}
                    label="Tuning strategy"
                    name={tuningStrategyPath}
                    options={selectOptions.hyperStrategyType}
                />
            </div>
            <div className="form-col-3">
                <FormInput
                    label="Result"
                    type="text"
                    name={resultPath}
                />
            </div>
            <div className="form-col-1">
                <FormSelect
                    label="Criteria" name={criteriaPath}
                    options={selectOptions.selectorCriteria}
                />
            </div>
        </div>
    )
}

FormHyperParametersTable.defaultProps = {}

FormHyperParametersTable.propTypes = {
    fieldsPath: PropTypes.string.isRequired
}

export default FormHyperParametersTable
