import React from 'react'

import { FormCheckBox, FormInput, FormKeyValueTable } from 'igz-controls/components'

import { PANEL_DEFAULT_ACCESS_KEY } from '../../../../constants'
import { secretsKindOptions } from './JobWizardAdvanced.utils'
import { useMode } from '../../../../hooks/mode.hook'

import './jobWizardAdvanced.scss'


const JobWizardAdvanced = ({ formState }) => {
  const { isStagingMode } = useMode()

  return (
    <div className="job-wizard__advanced form">
      <div className="form-row">
        <h5 className="form__step-title">Advanced</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <div className="form-row job-wizard__table-title">Environment variables</div>
      <div className="form-row">
        <FormKeyValueTable
          addNewItemLabel="Add environment variable"
          formState={formState}
          keyHeader="Name"
          keyLabel="Name"
          name="environmentVariables"
          className="form-col-1"
        />
      </div>

      {isStagingMode && (
        <>
          <div className="form-row job-wizard__table-title">Secrets</div>
          <div className="form-row">
            <FormKeyValueTable
              addNewItemLabel="Add secret"
              defaultKey="file"
              formState={formState}
              keyHeader="Kind"
              keyLabel="Kind"
              keyOptions={secretsKindOptions}
              name="secretSources"
              className="form-col-1"
            />
          </div>
        </>
      )}
      <div className="form-row align-stretch">
        <div className="access-key__checkbox">
          <FormCheckBox
            checked={formState.values.access_key === PANEL_DEFAULT_ACCESS_KEY}
            label="Auto-generate access key"
            name="access_key"
            onChange={() => {
              formState.form.change(
                'access_key',
                formState.values.access_key === PANEL_DEFAULT_ACCESS_KEY ? '' : '$generate'
              )
            }}
          />
        </div>
        {formState.values.access_key !== PANEL_DEFAULT_ACCESS_KEY && (
          <div className="form-col-1">
            <FormInput name="access_key" label="Access key" required />
          </div>
        )}
      </div>
    </div>
  )
}

JobWizardAdvanced.defaultProps = {}

JobWizardAdvanced.propTypes = {}

export default JobWizardAdvanced
