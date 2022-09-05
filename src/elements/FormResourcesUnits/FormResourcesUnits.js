import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'

import { FormInput, FormSelect } from 'igz-controls/components'

import {
  getSelectedCpuOption,
  selectMemoryOptions,
  getLimitsGpuType,
  getSelectedMemoryOption
} from './formResourcesUnits.util'

import './formResourcesUnits.scss'

const FormResourcesUnits = ({ formState }) => {
  const gpuType = useMemo(
    () => getLimitsGpuType(formState.values.resources.currentLimits),
    [formState.values.resources.currentLimits]
  )

  const validateMemory = (value, allValues) => {
    const convertToBites = (value, unitData) => {
      return parseInt(value) * Math.pow(unitData.root, unitData.power)
    }

    const limits = Number.parseInt(allValues.resources.currentLimits.memory)
    const requests = Number.parseInt(allValues.resources.currentRequest.memory)

    const selectedLimitsOption = getSelectedMemoryOption(
      allValues.resources.currentLimits.memoryUnit
    )
    const selectedRequestsOption = getSelectedMemoryOption(
      allValues.resources.currentRequest.memoryUnit
    )

    const isValid =
      convertToBites(limits, selectedLimitsOption) >=
      convertToBites(requests, selectedRequestsOption)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const validateCpu = (value, allValues) => {
    const limitsValue = allValues.resources.currentLimits.cpu
    const requestsValue = allValues.resources.currentRequest.cpu
    const selectedLimitsOption = getSelectedCpuOption(allValues.resources.currentLimits.cpuUnit)
    const selectedRequestsOption = getSelectedCpuOption(allValues.resources.currentRequest.cpuUnit)

    const isValid =
      selectedRequestsOption.convertValue(requestsValue) <=
      selectedLimitsOption.convertValue(limitsValue)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)
    formState.form.change(
      `resources.${type}.cpu`,
      selectedOption.onChange(formState.values.resources[type].cpu)
    )
  }

  useEffect(() => {
    if (
      formState.modified['resources.currentRequest.memoryUnit'] ||
      formState.modified['resources.currentLimits.memoryUnit'] ||
      formState.modified['resources.currentRequest.memory'] ||
      formState.modified['resources.currentLimits.memory']
    ) {
      formState.form.mutators.setFieldState('resources.currentRequest.memory', { modified: true })
      formState.form.mutators.setFieldState('resources.currentLimits.memory', { modified: true })
    }

    if (
      formState.modified['resources.currentRequest.cpuUnit'] ||
      formState.modified['resources.currentLimits.cpuUnit'] ||
      formState.modified['resources.currentRequest.cpu'] ||
      formState.modified['resources.currentLimits.cpu']
    ) {
      formState.form.mutators.setFieldState('resources.currentRequest.cpu', { modified: true })
      formState.form.mutators.setFieldState('resources.currentLimits.cpu', { modified: true })
    }
  }, [formState.form.mutators, formState.modified])

  return (
    <>
      <div className="form-row resources-units">
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">Memory</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="resources.currentRequest.memory"
              label="Request"
              type="number"
              min={1}
              validator={(value, allValues) => validateMemory(value, allValues)}
              required
              invalidText="Request must be less than or equal to Limit and not be less than 1"
            />
            <FormSelect
              className="resources-card__fields-select"
              name="resources.currentRequest.memoryUnit"
              options={selectMemoryOptions.unitMemory}
            />
          </div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="resources.currentLimits.memory"
              label="Limit"
              type="number"
              min={1}
              validator={(value, allValues) => validateMemory(value, allValues)}
              required
              invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            />
            <FormSelect
              className="resources-card__fields-select"
              name="resources.currentLimits.memoryUnit"
              options={selectMemoryOptions.unitMemory}
            />
          </div>
        </div>
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">CPU</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="resources.currentRequest.cpu"
              label="Request"
              type="number"
              min={
                getSelectedCpuOption(formState.values.resources.currentRequest.cpuUnit)?.minValue
              }
              step={getSelectedCpuOption(formState.values.resources.currentRequest.cpuUnit)?.step}
              validator={validateCpu}
              required
              invalidText={`Request must be less than or equal to Limit and not be less than ${
                getSelectedCpuOption(formState.values.resources.currentRequest.cpuUnit)?.minValue
              }`}
            />
            <FormSelect
              className="resources-card__fields-select"
              name="resources.currentRequest.cpuUnit"
              options={selectMemoryOptions.unitCpu}
            />
          </div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input"
              name="resources.currentLimits.cpu"
              label="Limit"
              type="number"
              min={getSelectedCpuOption(formState.values.resources.currentLimits.cpuUnit)?.minValue}
              step={getSelectedCpuOption(formState.values.resources.currentLimits.cpuUnit)?.step}
              validator={validateCpu}
              required
              invalidText={`Limit must be bigger than or equal to Request and not be less than ${
                getSelectedCpuOption(formState.values.resources.currentLimits.cpuUnit)?.minValue
              }`}
            />
            <FormSelect
              className="resources-card__fields-select"
              name="resources.currentLimits.cpuUnit"
              options={selectMemoryOptions.unitCpu}
            />
          </div>
        </div>
        <div className="form-col-1 resources-card">
          <div className="resources-card__title">GPU</div>
          <div className="resources-card__fields">
            <FormInput
              className="resources-card__fields-input gpu"
              name={`resources.currentLimits[${gpuType}]`}
              label="Limit"
              type="number"
              min={1}
            />
          </div>
        </div>
      </div>
      <OnChange name="resources.currentRequest.cpuUnit">
        {value => handleSelectCpuUnit(value, 'currentRequest')}
      </OnChange>
      <OnChange name="resources.currentLimits.cpuUnit">
        {value => handleSelectCpuUnit(value, 'currentLimits')}
      </OnChange>
    </>
  )
}
FormResourcesUnits.propTypes = {
  formState: PropTypes.shape({}).isRequired
}

export default FormResourcesUnits
