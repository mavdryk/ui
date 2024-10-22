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
import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isEqual, isNull } from 'lodash'

import {
  BE_PAGE,
  BE_PAGE_SIZE,
  FE_PAGE,
  FE_PAGE_END,
  FE_PAGE_SIZE,
  FE_PAGE_START
} from '../constants'

export const usePagination = ({
  bePageSize = 20,
  fePageSize = 5,
  paginationConfigRef,
  refreshContent,
  rowsData = {
    content: [],
    tableContent: []
  }
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const resetPagination = useCallback(() => {
    setSearchParams(
      prevSearchParams => {
        prevSearchParams.set(BE_PAGE, 1)
        prevSearchParams.set(FE_PAGE, 1)
        return prevSearchParams
      },
      { replace: true }
    )

    paginationConfigRef.current = {
      [BE_PAGE_SIZE]: bePageSize,
      [FE_PAGE_SIZE]: fePageSize,
      [BE_PAGE]: 1,
      [FE_PAGE]: 1,
      isNewResponse: false,
      paginationResponse: {}
    }
  }, [bePageSize, fePageSize, paginationConfigRef, setSearchParams])

  useLayoutEffect(() => {
    const paginationResponse = paginationConfigRef.current.paginationResponse || null
    const newPaginationConfig = {
      [BE_PAGE_SIZE]: bePageSize,
      [FE_PAGE_SIZE]: fePageSize,
      [BE_PAGE]: parseInt(searchParams.get(BE_PAGE)) || 1,
      [FE_PAGE]: parseInt(searchParams.get(FE_PAGE)) || 1,
      paginationResponse
    }

    const fePageStart = (bePageSize * (newPaginationConfig[BE_PAGE] - 1)) / fePageSize + 1
    const fePageEnd = fePageStart + Math.ceil(rowsData.content.length / fePageSize) - 1
    const bePage = newPaginationConfig[BE_PAGE]
    const bePageFromPaginationResponse = parseInt(paginationResponse?.page)
    newPaginationConfig.isNewResponse = bePage === bePageFromPaginationResponse

    if (
      (bePageFromPaginationResponse &&
        bePage === bePageFromPaginationResponse &&
        fePageEnd >= fePageStart) ||
      searchParams.size === 0
    ) {
      newPaginationConfig[FE_PAGE_START] = fePageStart
      newPaginationConfig[FE_PAGE_END] = fePageEnd

      const fePage = newPaginationConfig[FE_PAGE]
      newPaginationConfig[FE_PAGE] =
        fePage && fePage >= fePageStart && fePage <= fePageEnd ? fePage : fePageStart

      setSearchParams(
        prevSearchParams => {
          prevSearchParams.set(BE_PAGE, newPaginationConfig[BE_PAGE])
          prevSearchParams.set(FE_PAGE, newPaginationConfig[FE_PAGE])
          return prevSearchParams
        },
        { replace: true }
      )
    }

    const newPaginationConfigCurrent = {
      ...paginationConfigRef.current,
      ...newPaginationConfig
    }

    if (!isEqual(paginationConfigRef.current, newPaginationConfigCurrent)) {
      paginationConfigRef.current = newPaginationConfigCurrent
    }
  }, [bePageSize, fePageSize, paginationConfigRef, rowsData.content, searchParams, setSearchParams])

  useEffect(() => {
    const paginationResponse = paginationConfigRef.current?.paginationResponse

    if (
      searchParams.get(BE_PAGE) &&
      (!paginationResponse ||
        (paginationResponse?.page &&
          paginationResponse?.page !== parseInt(searchParams.get(BE_PAGE))))
    ) {
      refreshContent()
    }
  }, [paginationConfigRef, refreshContent, searchParams])

  useEffect(() => {
    if (
      rowsData.content.length === 0 &&
      isNull(paginationConfigRef.current.paginationResponse?.page) &&
      parseInt(searchParams.get(BE_PAGE)) > 1
    ) {
      setSearchParams(
        prevSearchParams => {
          prevSearchParams.set(BE_PAGE, 1)
          prevSearchParams.set(FE_PAGE, 1)
          return prevSearchParams
        },
        { replace: true }
      )

      paginationConfigRef.current.paginationResponse = null
    }
  }, [paginationConfigRef, rowsData.content, searchParams, setSearchParams])

  return [resetPagination]
}
