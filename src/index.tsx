import { useFocusRing } from '@react-aria/focus'
import { useTabList } from '@react-aria/tabs'
import { mergeProps } from '@react-aria/utils'
import { Item } from '@react-stately/collections'
import { TabListStateOptions, useTabListState } from '@react-stately/tabs'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppContext, TestNode } from './contants'
import { Loading } from './loading'
import { NavItem } from './nav-item'
import { StatisticTable } from './statistic.table'
import { TabPanel } from './tab-pane'
import { TestsTable } from './tests.table'

const fetchData = () =>
  fetch('/output.xml')
    .then((res) => res.text())
    .then((xml) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xml, 'application/xml')
      return doc
    })

const Tabs = (props: TabListStateOptions<object>) => {
  const ref = useRef<HTMLUListElement>(null)
  const state = useTabListState(props)
  const { tabListProps } = useTabList({}, state, ref)
  const { focusProps, isFocusVisible } = useFocusRing({
    within: true,
  })
  const [ready, setReady] = useState(false)
  const [activeTabStyle, setActiveTabStyle] = useState({
    width: 0,
    height: 0,
    transform: 'translateY(0)',
  })

  useEffect(() => {
    const activeTab = ref.current?.querySelector<HTMLLIElement>(
      '[role="tab"][aria-selected="true"]',
    )
    setActiveTabStyle({
      width: activeTab?.offsetWidth || 0,
      height: activeTab?.offsetHeight || 0,
      transform: `translateY(${activeTab?.offsetTop}px)`,
    })
    if (activeTab && !ready) {
      setTimeout(() => {
        setReady(true)
      }, 150)
    }
  }, [state.selectedKey])

  return (
    <div className='row min-vh-100'>
      <nav
        id='sidebarMenu'
        className='col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-end'
      >
        <div className='position-sticky pt-3'>
          <ul
            className='nav nav-pills flex-column'
            {...mergeProps(tabListProps, focusProps)}
            style={{ '--bs-nav-pills-link-active-bg': 'transparent' } as CSSProperties}
            ref={ref}
          >
            <TabSelection
              className={[
                'nav-link active',
                ready ? 'ready' : null,
                isFocusVisible ? 'focused' : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ zIndex: -1, ...activeTabStyle }}
            />
            {[...state.collection].map((item) => (
              <NavItem key={item.key} item={item} state={state} />
            ))}
          </ul>
        </div>
      </nav>

      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='tab-content'>
          <TabPanel key={state.selectedItem?.key} state={state} />
        </div>
      </main>
    </div>
  )
}

export const Main = () => {
  const [tab, setTab] = useState<string>()
  const [doc, setDoc] = useState<Document>()

  useEffect(() => {
    fetchData()
      .then(setDoc)
      .then(() => setTab('tests'))
  }, [])

  const statisticData = useMemo(() => {
    if (!doc) return []
    const list: TestNode[] = []

    const fillData = (nodeName: string, results: XPathResult) => {
      let node: Element | null = results.iterateNext() as Element
      while (node) {
        const item: TestNode = {
          nodeName,
          name: node.textContent || '',
          pass: parseInt(node.getAttribute('pass') || '0'),
          fail: parseInt(node.getAttribute('fail') || '0'),
          skip: parseInt(node.getAttribute('skip') || '0'),
          total: 0,
        }
        item.total = item.fail + item.pass + item.skip
        list.push(item)
        node = results.iterateNext() as Element
      }
    }
    fillData('total', doc.evaluate('/robot/statistics/total/stat', doc))
    fillData('tag', doc.evaluate('/robot/statistics/tag/stat', doc))
    fillData('suite', doc.evaluate('/robot/statistics/suite/stat', doc))

    return list
  }, [doc])

  const info = useMemo(() => {
    if (!doc)
      return {
        generator: null,
        generated: null,
      }

    const robot: Element = doc.evaluate('robot', doc).iterateNext() as Element
    return {
      generator: robot.getAttribute('generator'),
      generated: robot.getAttribute('generated'),
    }
  }, [doc])

  if (!doc)
    return (
      <div className='row min-vh-100'>
        <div className='col-2 mx-auto'>
          <Loading />
        </div>
      </div>
    )

  return (
    <AppContext.Provider value={doc}>
      <Tabs defaultSelectedKey='statistic'>
        <Item key='statistic' title='Statistic'>
          <h2 className='mt-3 mb-4'>Statistic</h2>

          <div className='card'>
            <StatisticTable data={statisticData} info={info} />
          </div>
        </Item>
        <Item key='tests' title='Tests metrics'>
          <h2 className='mt-3 mb-4'>Tests</h2>

          <TestsTable />
        </Item>
      </Tabs>
    </AppContext.Provider>
  )
}

const TabSelection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: var(--bs-primary) !important;
  will-change: transform, width;

  &.ready {
    transition:
      transform 150ms,
      width 100ms;
  }

  &.focused:after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 0.375rem;
    border: 1.5px solid var(--bs-primary);
    z-index: 3;
  }
`
