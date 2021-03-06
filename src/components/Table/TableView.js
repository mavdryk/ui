import React from 'react'
import PropTypes from 'prop-types'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'
import { ReactComponent as Yaml } from '../../images/yaml.svg'

const TableView = ({
  content,
  detailsMenu,
  groupFilter,
  groupLatestItem,
  groupedByName,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  page,
  selectedItem,
  tableHeaders,
  tableContent,
  toggleConvertToYaml
}) => {
  const actionsMenu = [
    { label: 'View YAML', icon: <Yaml />, onClick: toggleConvertToYaml }
  ]

  return (
    <div className="table">
      <div
        className={`table__content ${Object.keys(selectedItem).length !== 0 &&
          'table_opened'}`}
      >
        <div className="table-head">
          {tableHeaders.map((item, index) => (
            <div
              className={`table-head__item ${item.class}`}
              key={item.header + index}
            >
              <span>{item.header}</span>
            </div>
          ))}
        </div>
        <div className="table-body">
          {(groupFilter === 'none' &&
            Object.keys(groupedByName).length === 0) ||
          groupLatestItem.length === 0
            ? tableContent.map((rowItem, i) => {
                switch (page) {
                  case ARTIFACTS_PAGE:
                    return (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        key={i}
                        content={content}
                        handleSelectItem={handleSelectItem}
                        index={i}
                        match={match}
                        rowItem={rowItem}
                        selectedItem={selectedItem}
                      />
                    )
                  case FUNCTIONS_PAGE:
                    return (
                      <FunctionsTableRow
                        actionsMenu={actionsMenu}
                        key={i}
                        content={content}
                        match={match}
                        rowItem={rowItem}
                        index={i}
                        selectedItem={selectedItem}
                        handleSelectItem={handleSelectItem}
                      />
                    )
                  case JOBS_PAGE:
                    return (
                      <JobsTableRow
                        actionsMenu={actionsMenu}
                        key={i}
                        content={content}
                        handleSelectItem={handleSelectItem}
                        index={i}
                        match={match}
                        rowItem={rowItem}
                        selectedItem={selectedItem}
                      />
                    )
                  default:
                    return null
                }
              })
            : tableContent.map((group, i) => {
                if (page === FUNCTIONS_PAGE) {
                  return (
                    <FunctionsTableRow
                      actionsMenu={actionsMenu}
                      key={i}
                      content={content}
                      handleExpandRow={handleExpandRow}
                      handleSelectItem={handleSelectItem}
                      index={i}
                      match={match}
                      rowItem={groupLatestItem[i]}
                      selectedItem={selectedItem}
                      tableContent={group}
                    />
                  )
                } else {
                  return (
                    <JobsTableRow
                      actionsMenu={actionsMenu}
                      key={i}
                      content={content}
                      handleExpandRow={handleExpandRow}
                      handleSelectItem={handleSelectItem}
                      index={i}
                      match={match}
                      rowItem={groupLatestItem[i]}
                      selectedItem={selectedItem}
                      tableContent={group}
                    />
                  )
                }
              })}
        </div>
      </div>
      {Object.keys(selectedItem).length !== 0 && (
        <Details
          actionsMenu={actionsMenu}
          detailsMenu={detailsMenu}
          handleCancel={handleCancel}
          handleSelectItem={handleSelectItem}
          item={selectedItem}
          match={match}
          page={page}
        />
      )}
    </div>
  )
}

TableView.defaultProps = {
  groupLatestJob: {}
}

TableView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default TableView
