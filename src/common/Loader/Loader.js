import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './loader.scss'

const Loader = ({ section, small, secondary }) => {
  const wrapperClassNames = classnames(
    'loader-wrapper',
    section && 'section-loader',
    small && 'small-loader',
    secondary && 'secondary-loader'
  )

  return (
    <div className={wrapperClassNames}>
      <div className="loader" />
    </div>
  )
}

Loader.defaultProps = {
  section: false,
  small: false,
  secondary: false
}

Loader.propTypes = {
  section: PropTypes.bool,
  small: PropTypes.bool,
  secondary: PropTypes.bool
}

export default React.memo(Loader)
