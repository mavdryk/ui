/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

import { Button, FormInput, Modal } from 'igz-controls/components'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { addTag } from '../../reducers/artifactsToolkitReducer'

const AddArtifactTagPopUp = ({
  artifact,
  isOpen,
  onAddTag,
  onResolve,
  projectName,
  setNotification
}) => {
  const dispatch = useDispatch()
  const [initialValues] = useState({
    artifactTag: ''
  })
  const filtersStore = useSelector(store => store.filtersStore)

  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )
  const location = useLocation()

  const addArtifactTag = values => {
    const addTagArgs = {
      project: projectName,
      tag: values.artifactTag,
      data: {
        kind: 'artifact',
        identifiers: [
          {
            key: artifact.key,
            kind: artifact.kind,
            uid: artifact.uid ?? artifact.tree
          }
        ]
      }
    }

    dispatch(addTag(addTagArgs))
      .unwrap()
      .then(response => {
        setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Tag was added successfully'
        })
        onAddTag && onAddTag(filtersStore)
      })
      .catch(error => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Failed to add a tag',
          retry: addArtifactTag
        })
      })

    onResolve()
  }

  const getModalActions = formState => {
    const actions = [
      {
        label: 'Cancel',
        onClick: () => onResolve(),
        variant: TERTIARY_BUTTON
      },
      {
        disabled: formState.submitting || (formState.invalid && formState.submitFailed),
        label: 'Add',
        onClick: formState.handleSubmit,
        variant: SECONDARY_BUTTON
      }
    ]

    return actions.map(action => <Button {...action} />)
  }

  return (
    <Form form={formRef.current} initialValues={initialValues} onSubmit={addArtifactTag}>
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            location={location}
            onClose={onResolve}
            show={isOpen}
            size="min"
            title="Add a tag"
          >
            <div className="form">
              <div className="form-row">
                <div className="form-col-1">
                  <FormInput
                    name="artifactTag"
                    label="Artifact tag"
                    focused
                    required
                    validationRules={getValidationRules('common.tag')}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

AddArtifactTagPopUp.defaultProps = {
  onAddTag: () => {}
}

AddArtifactTagPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  artifact: PropTypes.shape({}).isRequired,
  onAddTag: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired
}

const actionCreators = {
  buildFunction: artifactsAction.buildFunction,
  setNotification: notificationActions.setNotification
}

export default connect(null, {
  ...actionCreators
})(AddArtifactTagPopUp)