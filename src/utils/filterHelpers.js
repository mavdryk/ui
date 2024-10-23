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

import { has, isEqual } from 'lodash'
import { filtersInitialState, setAllFiltersValues } from '../reducers/filtersReducer'
import { DATES_FILTER, FILTER_MENU, FILTER_MENU_MODAL } from '../constants'
import { CUSTOM_RANGE_DATE_OPTION } from './datePicker.util'

export const saveFilters = (dispatch, setSearchParams, filters = {}) => {
  let newSearchParams = {}

  setSearchParams?.(
    prevSearchParams => {
      for (const [parameterName, parameterValue] of Object.entries(filters.value ?? {})) {
        if (
          (has(filtersInitialState, [FILTER_MENU, filters.name, 'initialValues', parameterName]) &&
            !isEqual(
              filtersInitialState[FILTER_MENU][filters.name].initialValues[parameterName],
              parameterValue
            )) ||
          (has(filtersInitialState, [
            FILTER_MENU_MODAL,
            filters.name,
            'initialValues',
            parameterName
          ]) &&
            !isEqual(
              filtersInitialState[FILTER_MENU_MODAL][filters.name].initialValues[parameterName],
              parameterValue
            ))
        ) {
          if (parameterName === DATES_FILTER) {
            prevSearchParams.set(
              parameterName,
              parameterValue.initialSelectedOptionId === CUSTOM_RANGE_DATE_OPTION
                ? parameterValue.value.map(date => new Date(date).getTime()).join('-')
                : parameterValue.initialSelectedOptionId
            )
          } else {
            prevSearchParams.set(parameterName, parameterValue)
          }
        } else {
          prevSearchParams.delete(parameterName)
        }
      }

      newSearchParams = prevSearchParams

      return prevSearchParams
    },
    { replace: true }
  )

  dispatch(setAllFiltersValues(filters))

  return newSearchParams
}
