import { useTab } from '@react-aria/tabs'
import { TabListState } from '@react-stately/tabs'
import { Node } from '@react-types/shared'
import { useRef } from 'react'

export const NavItem = ({ item, state }: NavItemProps) => {
  const { key, rendered } = item
  const ref = useRef<HTMLAnchorElement>(null)
  const { tabProps, isSelected } = useTab({ key }, state, ref)

  return (
    <li className='nav-item'>
      <a
        {...tabProps}
        className={`nav-link${isSelected ? ' active' : ''}`}
        aria-current='page'
        href={`#${key}`}
        ref={ref}
      >
        {rendered}
      </a>
    </li>
  )
}

// ======================================================================================

type NavItemProps = {
  item: Node<object>
  state: TabListState<object>
}
