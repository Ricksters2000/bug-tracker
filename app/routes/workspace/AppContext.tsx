import React from 'react';
import {UserPublic} from '~/server/db/userDb';

export type AppContextValue = {
  currentUser: UserPublic;
}

export const AppContext = React.createContext<AppContextValue | null>(null)

export const useAppContext = (): AppContextValue => {
  const appContext = React.useContext(AppContext)
  if (!appContext) throw new Error(`Unexpected no value defined for app context`)
  return appContext
}