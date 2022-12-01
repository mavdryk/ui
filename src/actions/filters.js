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
import {
  ARTIFACT_OTHER_TYPE,
  DATASET_TYPE,
  MODEL_TYPE,
  REMOVE_FILTERS,
  SET_FILTERS,
  SET_FILTER_PROJECT_OPTIONS,
  SET_FILTER_TAG_OPTIONS
} from '../constants'

const filtersActions = {
  getFilterTagOptions: (fetchTags, projectName, category) => dispatch => {
    const fetchTagsArguments = {
      project: projectName,
      category
    }
    const fetchTagsPromise = [ARTIFACT_OTHER_TYPE, MODEL_TYPE, DATASET_TYPE].includes(category)
      ? dispatch(fetchTags(fetchTagsArguments)).unwrap()
      : fetchTags(fetchTagsArguments)

    return fetchTagsPromise.then(({ data }) =>
      dispatch(filtersActions.setFilterTagOptions([...new Set(data.tags)]))
    )
  },
  removeFilters: () => ({
    type: REMOVE_FILTERS
  }),
  setFilters: filters => ({
    type: SET_FILTERS,
    payload: filters
  }),
  setFilterTagOptions: options => {
    const filteredOptions = options.filter(option => option)

    return {
      type: SET_FILTER_TAG_OPTIONS,
      payload: filteredOptions
    }
  },
  setFilterProjectOptions: options => ({
    type: SET_FILTER_PROJECT_OPTIONS,
    payload: options
  })
}

export default filtersActions
