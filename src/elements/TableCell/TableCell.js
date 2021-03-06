import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'
import TableLinkCell from '../TableLinkCell/TableLinkCell'
import TableTypeCell from '../TableTypeCell/TableTypeCell'

import { ReactComponent as ArtifactView } from '../../images/eye.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import artifactAction from '../../actions/artifacts'

import { truncateUid } from '../../utils'
import jobsData from '../../components/JobsPage/jobsData'
import { useDispatch } from 'react-redux'

const TableCell = ({
  data,
  expandLink,
  firstRow,
  handleExpandRow,
  item,
  link,
  match,
  selectItem,
  selectedItem
}) => {
  const dispatch = useDispatch()

  if (link) {
    return (
      <TableLinkCell
        data={data}
        expandLink={expandLink}
        handleExpandRow={handleExpandRow}
        item={item}
        link={link}
        selectItem={selectItem}
        selectedItem={selectedItem}
      />
    )
  } else if (data.type === 'uid') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip
          textShow={true}
          template={<TextTooltipTemplate text={data.value} />}
        >
          {truncateUid(data.value)}
        </Tooltip>
      </div>
    )
  } else if (firstRow) {
    return (
      <div className={`table-body__cell ${data.class}`}>
        {data && data.value}
        <Arrow
          onClick={e => handleExpandRow(e, item)}
          className="expand-arrow"
        />
      </div>
    )
  } else if (data.type === 'type') {
    return <TableTypeCell data={data} />
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <ChipCell
          className={`table-body__${data.type}`}
          elements={data.value}
          tooltip
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        {data.value.uri && (
          <Tooltip
            template={
              <ProducerTooltipTemplate
                kind={data.value.kind}
                owner={data.value.owner ? data.value.owner : ''}
              />
            }
          >
            <Link
              to={`/projects/${match.params.projectName}/jobs/${data.value
                .uri && data.value.uri.split('/')[1]}/${
                jobsData.detailsMenu[0]
              }`}
            >
              {data.value.name}
            </Link>
          </Tooltip>
        )}
      </div>
    )
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <button
          onClick={() => {
            dispatch(
              artifactAction.showArtifactsPreview({
                isPreview: true,
                item
              })
            )
          }}
        >
          <Tooltip template={<TextTooltipTemplate text="Artifact Preview" />}>
            <ArtifactView />
          </Tooltip>
        </button>
      </div>
    )
  } else if (data.type === 'buttonDownload') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip template={<TextTooltipTemplate text="Download" />}>
          <Download
            path={item?.target_path.path}
            schema={item?.target_path.schema}
            user={item?.producer?.owner}
          />
        </Tooltip>
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip
          className="table-body__cell_path"
          template={<TextTooltipTemplate text={data.value.path} />}
        >
          {`${data.value.schema ? `${data.value.schema}://` : ''}${
            data.value.path
          }`}
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hash') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hidden') {
    return null
  } else {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip
          className="data_ellipsis"
          template={<TextTooltipTemplate text={data.value} />}
        >
          {data.value}
        </Tooltip>
      </div>
    )
  }
}

TableCell.defaultProps = {
  expandLink: false,
  firstRow: false,
  handleExpandRow: null,
  item: {
    target_path: '',
    schema: ''
  },
  link: '',
  match: null
}

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  expandLink: PropTypes.bool,
  firstRow: PropTypes.bool,
  handleExpandRow: PropTypes.func,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  match: PropTypes.shape({}),
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
