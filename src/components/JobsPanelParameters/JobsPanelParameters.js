import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'

import panelData from '../JobsPanel/panelData'

const JobsPanelParameters = ({
  hyperparams,
  match,
  parameters,
  setNewJobParameters,
  setNewJobHyperParameters
}) => {
  const [addNewParameter, setAddNewParameter] = useState(false)
  const [newParameter, setNewParameter] = useState({
    name: '',
    type: '',
    value: ''
  })
  const [newParameterSimple, setNewParameterSimple] = useState(
    panelData.newParameterSimple[0].id
  )
  const [parametersArray, setParametersArray] = useState([])
  const [selectedParameter, setSelectedParameter] = useState({})

  const handleAddNewParameter = () => {
    const emptyParameter = Object.values(newParameter).filter(
      value => value.length > 0
    )

    if (emptyParameter.length === 0) {
      setNewParameter({
        name: '',
        type: '',
        value: ''
      })
      return setAddNewParameter(false)
    }

    setNewJobParameters({
      ...parameters,
      [newParameter.name]: newParameter.value
    })

    if (newParameterSimple !== panelData.newParameterSimple[0].id) {
      setNewJobHyperParameters({
        ...hyperparams,
        [newParameter.name]: newParameter.value.split(',')
      })
    }

    setParametersArray([
      ...parametersArray,
      {
        ...newParameter,
        simple: newParameterSimple
      }
    ])

    setAddNewParameter(false)
    setNewParameter({
      name: '',
      type: '',
      value: ''
    })
    setNewParameterSimple(panelData.newParameterSimple[0].id)
  }

  const handleEditParameter = () => {
    const params = { ...parameters }
    const hyperParams = { ...hyperparams }

    params[selectedParameter.name] = selectedParameter.value

    if (selectedParameter.simple !== panelData.newParameterSimple[0].id) {
      if (hyperParams[selectedParameter.name]) {
        hyperParams[selectedParameter.name] = selectedParameter.value.split(',')
        setNewJobHyperParameters({ ...hyperParams })
      } else {
        setNewJobHyperParameters({
          ...hyperparams,
          [selectedParameter.name]: selectedParameter.value.split(',')
        })
      }
    }

    if (
      selectedParameter.simple === panelData.newParameterSimple[0].id &&
      hyperParams[selectedParameter.name]
    ) {
      delete hyperParams[selectedParameter.name]

      setNewJobHyperParameters({ ...hyperParams })
    }

    const newParametersArray = parametersArray.map(param => {
      if (param.name === selectedParameter.name) {
        param.value = selectedParameter.value
        param.simple = selectedParameter.simple
      }

      return param
    })

    setNewJobParameters({ ...params })
    setSelectedParameter({})
    setParametersArray(newParametersArray)
  }

  const handleDeleteParameter = (isInput, item) => {
    const newParameters = { ...parameters }

    delete newParameters[item.name]

    if (item.simple !== panelData.newParameterSimple[0].id) {
      const newHyperParameters = { ...hyperparams }

      delete newHyperParameters[item.name]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    setNewJobParameters({ ...newParameters })
    setParametersArray(
      parametersArray.filter(parameter => parameter.name !== item.name)
    )
  }

  return (
    <JobsPanelParametersView
      addNewParameter={addNewParameter}
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      match={match}
      newParameter={newParameter}
      newParameterSimple={newParameterSimple}
      parameters={parametersArray}
      selectedParameter={selectedParameter}
      setAddNewParameter={setAddNewParameter}
      setNewParameter={setNewParameter}
      setNewParameterSimple={setNewParameterSimple}
      setSelectedParameter={setSelectedParameter}
    />
  )
}

JobsPanelParameters.propTypes = {
  hyperparams: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.shape({}).isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired
}

export default JobsPanelParameters
