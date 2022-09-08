import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import FormActionButton from 'igz-controls/elements/FormActionButton/FormActionButton'
import FormDataInputsRow from './FormDataInputsRow/FormDataInputsRow'

import { useFormTable } from 'igz-controls/hooks/useFormTable.hook'
import { comboboxFieldsInitialState } from './formDataInputsTable.util'

const FormDataInputsTable = ({
  className,
  disabled,
  fetchArtifact,
  fetchArtifacts,
  fetchFeatureVector,
  fetchFeatureVectors,
  fieldsPath,
  formState,
  projectStore
}) => {
  const tableClassNames = classnames('form-table', className)
  const { editingItem, addNewRow, applyChanges, deleteRow, discardOrDelete, enterEditMode } =
    useFormTable(formState)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { name } }, index) => {
      return newValue.trim() === name && index !== editingItem.ui.index
    })
  }

  return (
    <div className={tableClassNames}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Name" />}>Input name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Value" />}>Path</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath}>
        {({ fields }) => {
          return (
            <>
              {fields.map((rowPath, index) => {
                return (
                  <FormDataInputsRow
                    applyChanges={applyChanges}
                    comboboxFields={formState.values.dataInputs.comboboxFields}
                    deleteRow={deleteRow}
                    disabled={disabled}
                    discardOrDelete={discardOrDelete}
                    editingItem={editingItem}
                    enterEditMode={enterEditMode}
                    fetchArtifact={fetchArtifact}
                    fetchArtifacts={fetchArtifacts}
                    fetchFeatureVector={fetchFeatureVector}
                    fetchFeatureVectors={fetchFeatureVectors}
                    fields={fields}
                    fieldsPath={fieldsPath}
                    index={index}
                    key={rowPath}
                    projectStore={projectStore}
                    rowPath={rowPath}
                    setFieldState={formState.form.mutators.setFieldState}
                    setFieldValue={formState.form.change}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
              {!editingItem?.ui?.isNew && (
                <FormActionButton
                  disabled={disabled}
                  fields={fields}
                  fieldsPath={fieldsPath}
                  label="Add input "
                  onClick={(...addRowArgs) => {
                    formState.form.change('dataInputs.comboboxFields', comboboxFieldsInitialState)
                    addNewRow(...addRowArgs, {
                      data: {
                        name: '',
                        path: '',
                        fieldInfo: {
                          pathType: '',
                          value: ''
                        }
                      },
                      doc: '',
                      isDefault: false
                    })
                  }}
                />
              )}
            </>
          )
        }}
      </FieldArray>
    </div>
  )
}

FormDataInputsTable.defaultProps = {
  disabled: false,
  className: ''
}

FormDataInputsTable.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired
}

export default FormDataInputsTable
