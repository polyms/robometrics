import { createContext, useContext } from 'react';

export type TestNode = {
  nodeName: string;
  name: string;
  pass: number;
  fail: number;
  skip: number;
  total: number;
};

export type SuiteNode = {
  id: string;
  name: string;
  status: string;
  startTime: Date;
  endTime: Date;
  subRows?: SuiteNode[];
};

export const STATUS_COLORS = {
  WARN: 'warning',
  INFO: 'info',
  PASS: 'success',
  FAIL: 'danger'
};

export const AppContext = createContext<Document | null>(null);
export const useAppContext = (): Document => useContext(AppContext) as Document;
