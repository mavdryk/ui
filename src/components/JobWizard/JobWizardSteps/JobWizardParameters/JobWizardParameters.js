import React from 'react'

import FormParametersTable from '../../../../common/FormParametersTable/FormParametersTable'
import FormHyperParametersTable from '../../../../common/FormHyperParametersTable/FormHyperParametersTable'

import './jobWizardParameters.scss'

const JobWizardParameters = ({ formState }) => {
  return (
    <div className="job-wizard__parameters form">
      <div className="form-row">
        <h5 className="form-step-title">Parameters</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <FormParametersTable formState={formState} fieldsPath="parameters.parametersTable" />
        <div className="form-row hyper-parameters">
            <h6 className="form-step-subtitle">Hyper parameters</h6>
        </div>
        <FormHyperParametersTable formState={formState} fieldsPath="parameters.hyperParameters" />
    </div>
  )
}

JobWizardParameters.defaultProps = {}

JobWizardParameters.propTypes = {}

export default JobWizardParameters
