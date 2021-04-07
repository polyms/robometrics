import React from 'react';

type NavItemProps = React.PropsWithChildren<{
  tab: string;
  activeTab: string | undefined;
  setTab: (tab: string) => void;
}>;

export const NavItem: React.FunctionComponent<NavItemProps> = ({
  tab,
  activeTab,
  children,
  setTab
}: NavItemProps) => (
  <li className="nav-item">
    <a
      className={`nav-link${tab === activeTab ? ' active' : ''}`}
      aria-current="page"
      href={`#${tab}`}
      onClick={() => setTab(tab)}
    >
      {children}
    </a>
  </li>
);
