import { Position, Toaster, Intent } from '@blueprintjs/core';

import * as types from '../constants/ActionTypes'

const DEFAULT_TIMEOUT = 2000;

export default function toasterReducer(toaster = {}, action) {
  switch (action.type) {
    // Setup initial toaster
    case types.SETUP_TOASTER:
      return action.toaster

    // Article
    case types.SAVE_ARTICLE + '_FULFILLED':
      toaster.show({
        message: 'Article saved!',
        intent: Intent.SUCCESS,
        timeout: DEFAULT_TIMEOUT
      })
      break
    case types.SAVE_ARTICLE + '_REJECTED':
      toaster.show({
        message: 'Article could not be saved',
        intent: Intent.DANGER,
        timeout: DEFAULT_TIMEOUT
      })
      break
  }
  return toaster
}