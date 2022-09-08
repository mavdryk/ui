import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../constants'
import { getParsedResource } from '../../utils/resources'
import { isNil } from 'lodash'
import { storePathTypes } from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'

export const comboboxSelectList = [
  {
    className: 'path-type-store',
    label: 'MLRun store',
    id: MLRUN_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-v3io',
    label: 'V3IO',
    id: V3IO_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-s3',
    label: 'S3',
    id: S3_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-http',
    label: 'HTTP',
    id: HTTP_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-https',
    label: 'HTTPS',
    id: HTTPS_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-az',
    label: 'Azure storage',
    id: AZURE_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-gs',
    label: 'Google storage',
    id: GOOGLE_STORAGE_INPUT_PATH_SCHEME
  }
]

export const pathTips = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]:
    'artifacts/my-project/my-artifact:my-tag" or "artifacts/my-project/my-artifact@my-uid',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}

export const pathPlaceholders = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]: 'artifacts/my-project/my-artifact:my-tag',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}

export const comboboxFieldsInitialState = {
  projects: [],
  artifacts: [],
  artifactsReferences: [],
  featureVectors: [],
  featureVectorsReferences: [],
  comboboxMatches: [],
  inputStorePathTypeEntered: false,
  inputProjectPathEntered: false,
  inputProjectItemPathEntered: false,
  inputProjectItemReferencePathEntered: false,
  storePathType: '',
  project: ''
}

export const isPathInputInvalid = (pathInputType, pathInputValue) => {
  const valueIsNotEmpty = pathInputValue?.trim().length > 0
  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return valueIsNotEmpty &&
        /^(artifacts|feature-vectors)\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/.test(pathInputValue)
        ? false
        : 'This field is invalid'
    case HTTP_STORAGE_INPUT_PATH_SCHEME:
    case HTTPS_STORAGE_INPUT_PATH_SCHEME:
    case V3IO_INPUT_PATH_SCHEME:
    case AZURE_STORAGE_INPUT_PATH_SCHEME:
    case GOOGLE_STORAGE_INPUT_PATH_SCHEME:
    case S3_INPUT_PATH_SCHEME:
      return valueIsNotEmpty && pathInputValue.split('/')?.[1]?.length > 0
        ? false
        : 'This field is invalid'
    default:
      return valueIsNotEmpty ? false : 'This field is invalid'
  }
}

export const handleStoreInputPathChange = (fieldInfo, fieldInfoPath, setFieldValue, value) => {
  const pathItems = value.split('/')
  const [projectItem, projectItemReference] = getParsedResource(pathItems[2])
  const projectItems = fieldInfo[pathItems[0] === 'artifacts' ? 'artifacts' : 'featureVectors']
  const projectItemIsEntered = projectItems.find(project => project.id === projectItem)
  const projectItemsReferences =
    fieldInfo[pathItems[0] === 'artifacts' ? 'artifactsReferences' : 'featureVectorsReferences']
  const projectItemReferenceIsEntered = projectItemsReferences.find(
    projectItemRef => projectItemRef.id === projectItemReference
  )
  const isInputStorePathTypeValid = storePathTypes.some(type => type.id.startsWith(pathItems[0]))

  setFieldValue(`${fieldInfoPath}`, {
    ...fieldInfo,
    artifacts: isNil(pathItems[2]) && fieldInfo.artifacts.length > 0 ? [] : fieldInfo.artifacts,
    artifactsReferences: projectItemReference ? fieldInfo.artifactsReferences : [],
    featureVectors:
      isNil(pathItems[2]) && fieldInfo.featureVectors.length > 0 ? [] : fieldInfo.featureVectors,
    featureVectorsReferences: projectItemReference ? fieldInfo.featureVectorsReferences : [],
    inputProjectItemPathEntered: Boolean(projectItemIsEntered),
    inputProjectItemReferencePathEntered: Boolean(projectItemReferenceIsEntered),
    inputProjectPathEntered: isInputStorePathTypeValid && typeof pathItems[2] === 'string',
    inputStorePathTypeEntered: isInputStorePathTypeValid && typeof pathItems[1] === 'string',
    project: pathItems[1] ?? fieldInfo.project,
    projectItem: projectItem ?? fieldInfo.projectItem,
    projectItemReference: projectItemReference ?? fieldInfo.projectItemReference,
    storePathType: pathItems[0] ?? fieldInfo.storePathType
  })
}

export const generateComboboxMatchesList = (
  artifacts,
  artifactsReferences,
  featureVectors,
  featureVectorsReferences,
  inputProjectItemPathEntered,
  inputProjectItemReferencePathEntered,
  inputProjectPathEntered,
  inputStorePathTypeEntered,
  project,
  projectItem,
  projectItemReference,
  projects,
  storePathType
) => {
  if (!inputStorePathTypeEntered) {
    return storePathTypes.some(type => type.id.startsWith(storePathType)) ? storePathTypes : []
  } else if (!inputProjectPathEntered && storePathTypes.some(type => type.id === storePathType)) {
    return projects.filter(proj => proj.id.startsWith(project))
  } else if (!inputProjectItemPathEntered) {
    const selectedStorePathType = storePathType
    const projectItems =
      selectedStorePathType === 'artifacts'
        ? artifacts
        : selectedStorePathType === 'feature-vectors'
        ? featureVectors
        : null

    return projectItems ? projectItems.filter(projItem => projItem.id.startsWith(projectItem)) : []
  } else if (!inputProjectItemReferencePathEntered) {
    const selectedStorePathType = storePathType
    const projectItemsReferences =
      selectedStorePathType === 'artifacts'
        ? artifactsReferences
        : selectedStorePathType === 'feature-vectors'
        ? featureVectorsReferences
        : null

    return projectItemsReferences
      ? projectItemsReferences.filter(projectItem =>
          projectItem.id.startsWith(projectItemReference)
        )
      : []
  } else {
    return []
  }
}
