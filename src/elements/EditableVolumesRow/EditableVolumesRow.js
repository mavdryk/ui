import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './editableVolumesRow.scss'

const EditableVolumesRow = ({
  handleEdit,
  selectedVolume,
  setSelectedVolume
}) => {
  return (
    <>
      <div className="table__row edit-row">
        <div className="table__cell">{selectedVolume.name}</div>
        <div className="table__cell">
          <Input
            floatingLabel
            label="Path"
            onChange={path =>
              setSelectedVolume({ ...selectedVolume, mountPath: path })
            }
            type="text"
            value={selectedVolume.mountPath}
          />
        </div>
      </div>
      <div className="table__row edit-row">
        <div className="table__cell">{selectedVolume.type.value}</div>
        <div className="table__cell">
          <Input
            floatingLabel
            label="Container"
            onChange={typeName =>
              setSelectedVolume({
                ...selectedVolume,
                type: { ...selectedVolume.type, name: typeName }
              })
            }
            type="text"
            value={selectedVolume.type.name}
          />
        </div>
        <div className="table__cell">
          <button className="apply-edit-btn" onClick={handleEdit}>
            <Checkmark />
          </button>
        </div>
      </div>
      {selectedVolume.type.value === 'V3IO' && (
        <div className="table__row edit-row">
          <div className="table__cell">
            <Input
              floatingLabel
              label="Access Key"
              onChange={accessKey =>
                setSelectedVolume({
                  ...selectedVolume,
                  type: { ...selectedVolume.type, accessKey: accessKey }
                })
              }
              type="text"
              value={selectedVolume.type.accessKey}
            />
          </div>
          <div className="table__cell">
            <Input
              floatingLabel
              label="Resource Path"
              onChange={subPath =>
                setSelectedVolume({
                  ...selectedVolume,
                  type: { ...selectedVolume.type, subPath: subPath }
                })
              }
              type="text"
              value={selectedVolume.type.subPath}
            />
          </div>
        </div>
      )}
    </>
  )
}

EditableVolumesRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  selectedVolume: PropTypes.shape({}).isRequired,
  setSelectedVolume: PropTypes.func.isRequired
}

export default EditableVolumesRow
