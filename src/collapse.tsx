import React, { ReactNode, useCallback, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'
import {
  ENTERED,
  ENTERING,
  EXITED,
  EXITING,
  UNMOUNTED,
} from 'react-transition-group/Transition'

type CollapseProps = React.PropsWithChildren<{
  isOpen: boolean
}>

const transitionStatusToClassHash = {
  [UNMOUNTED]: 'collapse',
  [ENTERING]: 'collapsing',
  [ENTERED]: 'collapse show',
  [EXITING]: 'collapsing',
  [EXITED]: 'collapse',
}

function getHeight(node: HTMLDivElement) {
  return node.scrollHeight
}

export const Collapse: React.FunctionComponent<CollapseProps> = ({
  children,
  isOpen,
}: CollapseProps) => {
  const [height, setHeight] = useState<number | null>(null)
  const container = useRef<HTMLDivElement>(null)

  const onEntering = useCallback(
    (node: any) => {
      setHeight(getHeight(node))
    },
    [setHeight],
  )

  const onEntered = useCallback(() => {
    setHeight(null)
  }, [setHeight])

  const onExit = useCallback(
    (node: any) => {
      setHeight(getHeight(node))
    },
    [setHeight],
  )

  const onExiting = useCallback(
    (node: any) => {
      /* eslint-disable
        @typescript-eslint/no-unused-vars,
        @typescript-eslint/naming-convention,
        */
      const unused = node.offsetHeight
      setHeight(0)
    },
    [setHeight],
  )

  return (
    <Transition
      timeout={750}
      in={isOpen}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onEntered}
    >
      {(status) => {
        const classes = transitionStatusToClassHash[status]
        const style = height === null ? undefined : { height }
        return (
          <div style={style} className={classes} ref={container}>
            {children}
          </div>
        )
      }}
    </Transition>
  )
}

type ExpandButtonProps = React.PropsWithChildren<{
  type: string
  name: ReactNode
  color?: string
  critical?: boolean
  root?: boolean
}>

export const ExpandButton: React.FunctionComponent<ExpandButtonProps> = ({
  children,
  type,
  name,
  color,
  critical,
  root,
}: ExpandButtonProps) => {
  const [isExpanded, setExpanded] = useState(true) // type === 'suite'

  return (
    <div className='d-flex'>
      <button
        className={`btn btn-sm btn-outline-info py-0 px-1 me-1 align-self-start${
          root ? ' pe-none' : ''
        }`}
        style={{ borderStyle: 'dashed', lineHeight: '1.2' }}
        type='button'
        data-bs-toggle='collapse'
        aria-expanded={isExpanded}
        onClick={() => setExpanded(!isExpanded)}
      >
        {root ? <>&nbsp;</> : isExpanded ? '-' : '+'}
      </button>

      <div className='flex-grow-1'>
        <h6 className='d-flex align-items-start ms-1'>
          {type && (
            <small className={`badge me-2 text-uppercase bg-${color}`}>{type}</small>
          )}
          {name}
          {critical && <span className='ms-2 badge bg-danger'>Critical</span>}
        </h6>
        <Collapse isOpen={isExpanded}>{children}</Collapse>
      </div>
    </div>
  )
}
ExpandButton.defaultProps = {
  color: 'info',
  critical: false,
  root: false,
}
