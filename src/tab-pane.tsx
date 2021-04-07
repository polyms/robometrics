import React from 'react';
import { CSSTransition } from 'react-transition-group';

type TabPaneProps = React.PropsWithChildren<{
  tab: string;
  activeTab: string | undefined;
}>;

export const TabPane: React.FunctionComponent<TabPaneProps> = ({
  tab,
  activeTab,
  children
}: TabPaneProps) => (
  <CSSTransition
    classNames={{
      enter: 'active',
      enterDone: 'active show',
      appear: 'active'
    }}
    timeout={150}
    in={tab === activeTab}
  >
    <div className="tab-pane fade" role="tabpanel">
      {children}
    </div>
  </CSSTransition>
);
