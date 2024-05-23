import { useTabPanel } from '@react-aria/tabs'
import { TabListState } from '@react-stately/tabs'
import { useRef } from 'react'

export const TabPanel = ({
  state,
  // ...props
}: TabPaneProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { tabPanelProps } = useTabPanel({}, state, ref)

  return (
    // <CSSTransition
    //   classNames={{
    //     enter: 'active',
    //     enterDone: 'active show',
    //     appear: 'active',
    //   }}
    //   timeout={150}
    //   in={tab === activeTab}
    //   nodeRef={ref}
    // >
    <div
      {...tabPanelProps}
      ref={ref}
      className='tab-pane fade show active'
      role='tabpanel'
    >
      {state.selectedItem?.props.children}
    </div>
    // </CSSTransition>
  )
}

// ======================================================================================

type TabPaneProps = {
  state: TabListState<object>
}
