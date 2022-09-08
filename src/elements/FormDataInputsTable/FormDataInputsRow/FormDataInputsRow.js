import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'
import { isNil, pick, uniqBy } from 'lodash'
import { useParams } from 'react-router-dom'

import { FormInput, TextTooltipTemplate, Tip, Tooltip, FormCombobox } from 'igz-controls/components'
import FormRowActions from 'igz-controls/elements/FormRowActions/FormRowActions'

import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import {
  comboboxSelectList,
  handleStoreInputPathChange,
  pathPlaceholders,
  pathTips,
  generateComboboxMatchesList,
  isPathInputInvalid,
  comboboxFieldsInitialState
} from '../formDataInputsTable.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateProjectsList
} from '../../../utils/panelPathScheme'
import { getFeatureReference } from '../../../utils/resources'
import { COMBOBOX_FIELDS } from '../../../types'

const FormDataInputsRow = ({
  applyChanges,
  comboboxFields,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fetchArtifact,
  fetchArtifacts,
  fetchFeatureVector,
  fetchFeatureVectors,
  fields,
  fieldsPath,
  index,
  projectStore,
  rowPath,
  setFieldState,
  setFieldValue,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const params = useParams()

  const tableRowClassNames = classnames(
    'form-table__row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active'
  )

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  useEffect(() => {
    if (comboboxFields.inputStorePathTypeEntered && comboboxFields.projects.length === 0) {
      setFieldValue(
        'dataInputs.comboboxFields.projects',
        generateProjectsList(projectStore.projectsNames.data, params.projectName)
      )
    }
  }, [
    comboboxFields.inputStorePathTypeEntered,
    comboboxFields.projects.length,
    params.projectName,
    projectStore.projectsNames.data,
    setFieldValue
  ])

  useEffect(() => {
    if (fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      setFieldValue(
        'dataInputs.comboboxFields.comboboxMatches',
        generateComboboxMatchesList(
          comboboxFields.artifacts,
          comboboxFields.artifactsReferences,
          comboboxFields.featureVectors,
          comboboxFields.featureVectorsReferences,
          comboboxFields.inputProjectItemPathEntered,
          comboboxFields.inputProjectItemReferencePathEntered,
          comboboxFields.inputProjectPathEntered,
          comboboxFields.inputStorePathTypeEntered,
          comboboxFields.project,
          comboboxFields.projectItem,
          comboboxFields.projectItemReference,
          comboboxFields.projects,
          comboboxFields.storePathType
        )
      )
    }
  }, [
    comboboxFields.artifacts,
    comboboxFields.artifactsReferences,
    comboboxFields.featureVectors,
    comboboxFields.featureVectorsReferences,
    comboboxFields.inputProjectItemPathEntered,
    comboboxFields.inputProjectItemReferencePathEntered,
    comboboxFields.inputProjectPathEntered,
    comboboxFields.inputStorePathTypeEntered,
    comboboxFields.project,
    comboboxFields.projectItem,
    comboboxFields.projectItemReference,
    comboboxFields.projects,
    comboboxFields.storePathType,
    fieldData.data.fieldInfo.pathType,
    setFieldValue
  ])

  useEffect(() => {
    if (
      comboboxFields.inputProjectPathEntered &&
      comboboxFields.storePathType &&
      comboboxFields.project
    ) {
      if (comboboxFields.storePathType === 'artifacts' && comboboxFields.artifacts.length === 0) {
        fetchArtifacts(comboboxFields.project).then(artifacts => {
          setFieldValue('dataInputs.comboboxFields.artifacts', generateArtifactsList(artifacts))
        })
      } else if (
        comboboxFields.storePathType === 'feature-vectors' &&
        comboboxFields.featureVectors.length === 0
      ) {
        fetchFeatureVectors(comboboxFields.project).then(featureVectors => {
          const featureVectorsList = uniqBy(featureVectors, 'metadata.name')
            .map(featureVector => ({
              label: featureVector.metadata.name,
              id: featureVector.metadata.name
            }))
            .sort((prevFeatureVector, nextFeatureVector) =>
              prevFeatureVector.id.localeCompare(nextFeatureVector.id)
            )

          setFieldValue('dataInputs.comboboxFields.featureVectors', featureVectorsList)
        })
      }
    }
  }, [
    comboboxFields.artifacts.length,
    comboboxFields.featureVectors.length,
    comboboxFields.inputProjectPathEntered,
    comboboxFields.project,
    comboboxFields.storePathType,
    fetchArtifacts,
    fetchFeatureVectors,
    fieldsPath,
    setFieldValue
  ])

  useEffect(() => {
    const storePathType = comboboxFields.storePathType
    const projectName = comboboxFields.project
    const projectItem = comboboxFields.projectItem

    if (comboboxFields.inputProjectItemPathEntered && storePathType && projectName && projectItem) {
      if (storePathType === 'artifacts' && comboboxFields.artifactsReferences.length === 0) {
        fetchArtifact(projectName, projectItem).then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            setFieldValue(
              'dataInputs.comboboxFields.artifactsReferences',
              generateArtifactsReferencesList(artifacts[0].data)
            )
          }
        })
      } else if (
        storePathType === 'feature-vectors' &&
        comboboxFields.featureVectorsReferences.length === 0
      ) {
        fetchFeatureVector(projectName, projectItem).then(featureVectors => {
          const featureVectorsReferencesList = featureVectors
            .map(featureVector => {
              let featureVectorReference = getFeatureReference(featureVector.metadata)

              return {
                label: featureVectorReference,
                id: featureVectorReference,
                customDelimiter: featureVectorReference[0]
              }
            })
            .filter(featureVector => featureVector.label !== '')
            .sort((prevRef, nextRef) => prevRef.id.localeCompare(nextRef.id))

          setFieldValue(
            'dataInputs.comboboxFields.featureVectorsReferences',
            featureVectorsReferencesList
          )
        })
      }
    }
  }, [
    comboboxFields.artifactsReferences.length,
    comboboxFields.featureVectorsReferences.length,
    comboboxFields.inputProjectItemPathEntered,
    comboboxFields.project,
    comboboxFields.projectItem,
    comboboxFields.storePathType,
    fetchArtifact,
    fetchFeatureVector,
    fieldsPath,
    setFieldValue
  ])

  return (
    <>
      {editingItem &&
      index === editingItem.ui?.index &&
      fieldsPath === editingItem.ui?.fieldsPath &&
      !disabled ? (
        <div className={tableRowClassNames} key={index}>
          <div className="form-table__cell form-table__cell_1">
            <FormInput
              density="dense"
              name={`${rowPath}.data.name`}
              placeholder="Name"
              required
              validationRules={[
                {
                  name: 'uniqueness',
                  label: 'Name should be unique',
                  pattern: newValue => uniquenessValidator(fields, newValue)
                }
              ]}
            />
          </div>
          <div className="form-table__cell form-table__cell_1">
            <FormCombobox
              name={`${rowPath}.data.path`}
              selectOptions={comboboxSelectList}
              density="dense"
              required
              inputDefaultValue={editingItem.data.fieldInfo?.value}
              invalidText={`Field must be in "${
                pathTips[fieldData.data.fieldInfo?.pathType]
              }" format`}
              selectDefaultValue={comboboxSelectList.find(
                option =>
                  editingItem.data.path && option.id === editingItem.data.fieldInfo?.pathType
              )}
              validator={(fieldValue, allValues) => {
                const { pathType, value } = pick(
                  allValues.dataInputs.dataInputsTable[index].data.fieldInfo,
                  ['pathType', 'value']
                )

                return isPathInputInvalid(pathType, value)
              }}
              onChange={(selectValue, inputValue) => {
                if (!inputValue && !fieldData.data.fieldInfo?.value) {
                  setFieldState(`${rowPath}.data.path`, { modified: false })
                }

                if (selectValue === MLRUN_STORAGE_INPUT_PATH_SCHEME && !isNil(inputValue)) {
                  handleStoreInputPathChange(
                    comboboxFields,
                    'dataInputs.comboboxFields',
                    setFieldValue,
                    inputValue
                  )
                }
              }}
              inputPlaceholder={pathPlaceholders[fieldData.data.fieldInfo?.pathType]}
              selectPlaceholder="Path Scheme"
              suggestionList={
                fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
                  ? comboboxFields.comboboxMatches
                  : []
              }
              maxSuggestedMatches={
                fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ? 3 : 2
              }
              hideSearchInput={!comboboxFields.inputStorePathTypeEntered}
            />
          </div>
          <FormRowActions
            applyChanges={applyChanges}
            deleteRow={deleteRow}
            discardOrDelete={discardOrDelete}
            editingItem={editingItem}
            fieldsPath={fieldsPath}
            index={index}
          />
        </div>
      ) : (
        <div
          className={tableRowClassNames}
          key={index}
          onClick={event => {
            setFieldValue('dataInputs.comboboxFields', comboboxFieldsInitialState)
            handleStoreInputPathChange(
              comboboxFields,
              'dataInputs.comboboxFields',
              setFieldValue,
              fields.value[index].data.fieldInfo.value
            )
            enterEditMode(event, fields, fieldsPath, index)
          }}
        >
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
              {fieldData.data.name}
            </Tooltip>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.path} />}>
              {fieldData.data.path}
            </Tooltip>
          </div>
          <FormRowActions
            applyChanges={applyChanges}
            deleteRow={deleteRow}
            discardOrDelete={discardOrDelete}
            editingItem={editingItem}
            fieldsPath={fieldsPath}
            index={index}
          />
        </div>
      )}
      <OnChange name={`${rowPath}.data.path`}>
        {value => {
          if (value.length !== 0) {
            setFieldValue(`${rowPath}.data.fieldInfo.value`, value.replace(/.*:[/]{2,3}/g, ''))
            setFieldValue(`${rowPath}.data.fieldInfo.pathType`, value.match(/^\w*:[/]{2,3}/)[0])
          }
        }}
      </OnChange>
    </>
  )
}

FormDataInputsRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormDataInputsRow.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  comboboxFields: COMBOBOX_FIELDS,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  rowPath: PropTypes.string.isRequired,
  setFieldState: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormDataInputsRow
