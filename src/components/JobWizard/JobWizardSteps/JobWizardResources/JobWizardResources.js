import React, { useEffect, useMemo } from 'react'
import { OnChange } from 'react-final-form-listeners'

import { FormInput, FormSelect, FormKeyValueTable } from 'igz-controls/components'

import { generateFunctionPriorityLabel } from '../../../../utils/generateFunctionPriorityLabel'
import {
  selectMemoryOptions,
  volumePreemptionModeOptions,
  getSelectedCpuOption,
  getSelectedMemoryOption,
  getLimitsGpuType
} from './JowWizardResources.utils'

import './jobWizardResources.scss'

const JobWizardResources = ({ formState, frontendSpec }) => {
  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [frontendSpec.valid_function_priority_class_names])

  const gpuType = useMemo(
    () => getLimitsGpuType(formState.values.currentLimits),
    [formState.values.currentLimits]
  )

  const validateMemory = (value, allValues) => {
    const convertToBites = (value, unitData) => {
      return parseInt(value) * Math.pow(unitData.root, unitData.power)
    }

    const limits = Number.parseInt(allValues.currentLimits.memory)
    const requests = Number.parseInt(allValues.currentRequest.memory)

    const selectedLimitsOption = getSelectedMemoryOption(allValues.currentLimits.memoryUnit)
    const selectedRequestsOption = getSelectedMemoryOption(allValues.currentRequest.memoryUnit)

    const isValid =
      convertToBites(limits, selectedLimitsOption) >=
      convertToBites(requests, selectedRequestsOption)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const validateCpu = (value, allValues) => {
    const limitsValue = allValues.currentLimits.cpu
    const requestsValue = allValues.currentRequest.cpu
    const selectedLimitsOption = getSelectedCpuOption(allValues.currentLimits.cpuUnit)
    const selectedRequestsOption = getSelectedCpuOption(allValues.currentRequest.cpuUnit)

    const isValid =
      selectedRequestsOption.convertValue(requestsValue) <=
      selectedLimitsOption.convertValue(limitsValue)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)
    formState.form.change(`${type}.cpu`, selectedOption.onChange(formState.values[type].cpu))
  }

  useEffect(() => {
    if (
      formState.modified['currentRequest.memoryUnit'] ||
      formState.modified['currentLimits.memoryUnit'] ||
      formState.modified['currentRequest.memory'] ||
      formState.modified['currentLimits.memory']
    ) {
      formState.form.mutators.setFieldState('currentRequest.memory', { modified: true })
      formState.form.mutators.setFieldState('currentLimits.memory', { modified: true })
    }

    if (
      formState.modified['currentRequest.cpuUnit'] ||
      formState.modified['currentLimits.cpuUnit'] ||
      formState.modified['currentRequest.cpu'] ||
      formState.modified['currentLimits.cpu']
    ) {
      formState.form.mutators.setFieldState('currentRequest.cpu', { modified: true })
      formState.form.mutators.setFieldState('currentLimits.cpu', { modified: true })
    }
  }, [formState.form.mutators, formState.modified])

  return (
    <div className="job-wizard__resources form">
      <div className="form-row">
        <h5 className="form__step-title">Resources</h5>
      </div>
      <div className="form-row">
        {validFunctionPriorityClassNames.length > 0 && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Pods priority"
              name="jobPriorityClassName"
              options={validFunctionPriorityClassNames}
            />
          </div>
        )}
        {formState.values.preemptionMode && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Spot Instances"
              name="preemptionMode"
              options={volumePreemptionModeOptions}
            />
          </div>
        )}
      </div>
      <div className="form-row job-wizard__table-title">Node selection</div>
      <div className="form-row">
        <FormKeyValueTable
          keyHeader="Key"
          keyLabel="Key"
          addNewItemLabel="Add a node"
          name="nodeSelector"
          formState={formState}
          className="form-col-1"
        />
      </div>

      <div className="form-row align-stretch">
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">Memory</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="currentRequest.memory"
              label="Request"
              type="number"
              min={1}
              validator={(value, allValues) => validateMemory(value, allValues)}
              required
              invalidText="Request must be less than or equal to Limit and not be less than 1"
            />
            <FormSelect
              className="resources-card__fields-select"
              name="currentRequest.memoryUnit"
              options={selectMemoryOptions.unitMemory}
            />
          </div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="currentLimits.memory"
              label="Limit"
              type="number"
              min={1}
              validator={(value, allValues) => validateMemory(value, allValues)}
              required
              invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            />
            <FormSelect
              className="resources-card__fields-select"
              name="currentLimits.memoryUnit"
              options={selectMemoryOptions.unitMemory}
            />
          </div>
        </div>
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">CPU</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="currentRequest.cpu"
              label="Request"
              type="number"
              min={getSelectedCpuOption(formState.values.currentRequest.cpuUnit)?.minValue}
              step={getSelectedCpuOption(formState.values.currentRequest.cpuUnit)?.step}
              validator={validateCpu}
              required
              invalidText={`Request must be less than or equal to Limit and not be less than ${
                getSelectedCpuOption(formState.values.currentRequest.cpuUnit)?.minValue
              }`}
            />
            <FormSelect
              className="resources-card__fields-select"
              name="currentRequest.cpuUnit"
              options={selectMemoryOptions.unitCpu}
            />
          </div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="currentLimits.cpu"
              label="Limit"
              type="number"
              min={getSelectedCpuOption(formState.values.currentLimits.cpuUnit)?.minValue}
              step={getSelectedCpuOption(formState.values.currentLimits.cpuUnit)?.step}
              validator={validateCpu}
              required
              invalidText={`Limit must be bigger than or equal to Request and not be less than ${
                getSelectedCpuOption(formState.values.currentLimits.cpuUnit)?.minValue
              }`}
            />
            <FormSelect
              className="resources-card__fields-select"
              name="currentLimits.cpuUnit"
              options={selectMemoryOptions.unitCpu}
            />
          </div>
        </div>
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">GPU</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input gpu"
              name={`currentLimits[${gpuType}]`}
              label="Limit"
              type="number"
              min={1}
            />
          </div>
        </div>
      </div>
      <OnChange name="currentRequest.cpuUnit">
        {value => handleSelectCpuUnit(value, 'currentRequest')}
      </OnChange>
      <OnChange name="currentLimits.cpuUnit">
        {value => handleSelectCpuUnit(value, 'currentLimits')}
      </OnChange>
    </div>
  )
}

JobWizardResources.defaultProps = {}

JobWizardResources.propTypes = {}

export default JobWizardResources
