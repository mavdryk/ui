import React, { useCallback, useMemo, useRef } from 'react'
import classnames from 'classnames'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import { BE_PAGE, FE_PAGE, FE_PAGE_END, FE_PAGE_START } from '../../constants'
import { getDefaultCloseDetailsLink } from '../../utils/link-helper.util'

import './pagination.scss'

const threeDotsString = '...'

const Pagination = ({ page, pageChangeCallback, paginationConfig, selectedItem }) => {
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const params = useParams()
  const leftSideRef = useRef(0)
  const rightSideRef = useRef(0)

  // Total pages are now calculated based on start and end pages
  const totalPagesCount = useMemo(
    () => paginationConfig[FE_PAGE_END] - paginationConfig[FE_PAGE_START] + 1,
    [paginationConfig]
  )

  const handlePageChange = useCallback(() => {
    if (!isEmpty(selectedItem)) {
      navigate(getDefaultCloseDetailsLink(params, page), { replace: true })
    }

    pageChangeCallback()
  }, [navigate, page, pageChangeCallback, params, selectedItem])

  const getPaginationItems = useCallback(() => {
    if (!paginationConfig[FE_PAGE]) return []

    const items = []
    const firstPage = paginationConfig[FE_PAGE_START]
    const lastPage = paginationConfig[FE_PAGE_END]

    // Always show the first page in the dynamic range
    items.push(firstPage)

    if (totalPagesCount <= 7) {
      // If total pages within range are 7 or fewer, show all
      for (let i = firstPage + 1; i <= lastPage; i++) {
        items.push(i)
      }
    } else {
      const isFirstFourRange = paginationConfig[FE_PAGE] < paginationConfig[FE_PAGE_START] + 4
      const isLastFourRange = paginationConfig[FE_PAGE] > paginationConfig[FE_PAGE_END] - 4
      let leftSide = Math.max(firstPage + 1, paginationConfig[FE_PAGE] - (isFirstFourRange ? 2 : 1))
      let rightSide = Math.min(lastPage - 1, paginationConfig[FE_PAGE] + (isLastFourRange ? 2 : 1))

      if (paginationConfig[FE_PAGE] <= firstPage + 3) {
        // Case when activePage is close to the start
        rightSide = firstPage + 4
      } else if (paginationConfig[FE_PAGE] >= lastPage - 3) {
        // Case when activePage is close to the end
        leftSide = lastPage - 4
      }

      rightSideRef.current = rightSide
      leftSideRef.current = leftSide

      if (leftSide > firstPage + 1) {
        items.push(threeDotsString)
      }

      for (let i = leftSide; i <= rightSide; i++) {
        items.push(i)
      }

      if (rightSide < lastPage - 1) {
        items.push(threeDotsString)
      }

      // Always show the last page in the dynamic range
      items.push(lastPage)
    }

    return items
  }, [paginationConfig, totalPagesCount])

  const goToPage = page => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(FE_PAGE, page)

      return prevSearchParams
    })

    handlePageChange()
  }

  const goToNextBePage = () => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(BE_PAGE, paginationConfig[BE_PAGE] + 1)
      return prevSearchParams
    })

    handlePageChange()
  }

  const goToPrevBePage = customFePage => {
    setSearchParams(prevSearchParams => {
      prevSearchParams.set(BE_PAGE, paginationConfig[BE_PAGE] - 1)

      if (customFePage) {
        prevSearchParams.set(FE_PAGE, customFePage)
      }

      return prevSearchParams
    })

    handlePageChange()
  }

  const goToNextFePage = () => {
    if (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_END]) {
      goToNextBePage()
    } else {
      setSearchParams(prevSearchParams => {
        prevSearchParams.set(FE_PAGE, paginationConfig[FE_PAGE] + 1)

        return prevSearchParams
      })

      handlePageChange()
    }
  }

  const goToPrevFePage = () => {
    if (paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_START]) {
      goToPrevBePage(paginationConfig[FE_PAGE] - 1)
    } else {
      setSearchParams(prevSearchParams => {
        prevSearchParams.set(FE_PAGE, paginationConfig[FE_PAGE] - 1)

        return prevSearchParams
      })

      handlePageChange()
    }
  }

  const getThreeDotsStyle = useCallback((paginationItem, index) => {
    let paginationItemWidth = 'auto'

    if (paginationItem === threeDotsString) {
      const dotPage = index === 1 ? leftSideRef.current : rightSideRef.current
      paginationItemWidth = `${dotPage.toString().length}ch`
    }

    return { width: paginationItemWidth }
  }, [])

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-navigate-btn"
        onClick={() => goToPrevBePage()}
        disabled={paginationConfig[BE_PAGE] === 1}
      >
        <span className="pagination-navigate-btn__arrow">&laquo;</span>
      </button>
      <button
        className="pagination-btn pagination-navigate-btn"
        onClick={() => goToPrevFePage()}
        disabled={paginationConfig[FE_PAGE] === 1}
      >
        <span className="pagination-navigate-btn__arrow">&lsaquo;</span>
      </button>

      <div className="pagination-pages">
        {getPaginationItems().map((pageItem, index) => (
          <button
            key={index}
            onClick={() => goToPage(pageItem)}
            className={classnames(
              'pagination-btn',
              pageItem === paginationConfig[FE_PAGE] && 'pagination-btn_active',
              pageItem === threeDotsString && 'pagination-dots'
            )}
            style={getThreeDotsStyle(pageItem, index)}
            disabled={pageItem === threeDotsString}
          >
            {pageItem}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-navigate-btn"
        onClick={() => goToNextFePage()}
        disabled={
          paginationConfig[FE_PAGE] === paginationConfig[FE_PAGE_END] &&
          !paginationConfig.paginationResponse['page-token']
        }
      >
        <span className="pagination-navigate-btn__arrow">&rsaquo;</span>
      </button>
      <button
        className="pagination-btn pagination-navigate-btn"
        onClick={() => goToNextBePage()}
        disabled={!paginationConfig.paginationResponse['page-token']}
      >
        <span className="pagination-navigate-btn__arrow">&raquo;</span>
      </button>
    </div>
  )
}

export default Pagination
