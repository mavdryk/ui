import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import CheckBox from '../../common/CheckBox/CheckBox'
import RangeInput from '../../common/RangeInput/RangeInput'

import {
  BOOLEAN_TYPE,
  isEditableParameterValid,
  isNameNotUnique,
  NUMBER_TYPE,
  parameterTypeOptions
} from './functionsPanelParameters.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableFunctionParameterRow = ({
  handleEdit,
  parameters,
  selectedParameter,
  setSelectedParameter
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell table__cell_edit">
        <Input
          floatingLabel
          invalid={
            selectedParameter.newName !== selectedParameter.data.name &&
            isNameNotUnique(selectedParameter.newName, parameters)
          }
          invalidText="Name already exists"
          label="Name"
          onChange={name => {
            setSelectedParameter({
              ...selectedParameter,
              newName: name
            })
          }}
          required
          type="text"
          value={selectedParameter.newName ?? selectedParameter.data.name}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Select
          onClick={type =>
            setSelectedParameter(state => ({
              ...state,
              data: {
                ...state.data,
                type,
                value: type === BOOLEAN_TYPE ? 'false' : ''
              }
            }))
          }
          options={parameterTypeOptions}
          selectedId={selectedParameter.data.type}
        />
      </div>
      <div className="table__cell table__cell_edit">
        {selectedParameter.data.type === BOOLEAN_TYPE ? (
          <CheckBox
            className="parameter-value"
            item={{ id: 'true' }}
            onChange={value => {
              setSelectedParameter(state => ({
                ...state,
                data: {
                  ...state.data,
                  value: value === state.data.value ? 'false' : value
                }
              }))
            }}
            selectedId={selectedParameter.data.value}
          />
        ) : selectedParameter.data.type === NUMBER_TYPE ? (
          <RangeInput
            density="normal"
            label="Value"
            labelType="floatingLabel"
            onChange={value =>
              setSelectedParameter(state => ({
                ...state,
                data: {
                  ...state.data,
                  value
                }
              }))
            }
            required
            value={selectedParameter.data.value}
          />
        ) : (
          <Input
            floatingLabel
            label="Value"
            onChange={value => {
              setSelectedParameter({
                ...selectedParameter,
                data: {
                  ...selectedParameter.data,
                  value
                }
              })
            }}
            required
            type="text"
            value={selectedParameter.data.value}
          />
        )}
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={!isEditableParameterValid(selectedParameter, parameters)}
          onClick={handleEdit}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableFunctionParameterRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableFunctionParameterRow