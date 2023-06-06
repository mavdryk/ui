import { LIST_TUNING_STRATEGY, MAX_SELECTOR_CRITERIA } from '../../../../constants'

export const selectOptions = {
  strategies: [
    {
      label: 'Grid',
      id: 'grid'
    },
    {
      label: 'Random',
      id: 'random'
    },
    {
      label: 'List',
      id: LIST_TUNING_STRATEGY
    },
    {
      label: 'Custom',
      id: 'custom'
    }
  ],
  criteria: [
    { label: 'Min', id: 'min' },
    { label: 'Max', id: MAX_SELECTOR_CRITERIA }
  ],
  stopCondition: [
    { label: '>', id: 'more' },
    { label: '<', id: 'less' }
  ]
}
