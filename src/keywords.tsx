import React, { useMemo } from 'react'

import { ExpandButton } from './collapse'
import { STATUS_COLORS, useAppContext } from './contants'
import { formatDateFrom } from './datetime'

type KeywordsProps = {
  path: string
}

export const Keywords: React.FunctionComponent<KeywordsProps> = ({
  path,
}: KeywordsProps) => {
  const doc = useAppContext()

  const data = useMemo(() => {
    const result = doc.evaluate(path, doc)
    const list = []
    let node = result.iterateNext() as Element

    while (node) {
      const item = {
        id: 0,
        name: node.getAttribute('name') as string,
        type: node.getAttribute('type'),
        library: node.getAttribute('library'),
        status: node.lastElementChild?.getAttribute(
          'status',
        ) as keyof typeof STATUS_COLORS,
        startTime: formatDateFrom(
          node.lastElementChild?.getAttribute('starttime') as string,
        ),
        endTime: formatDateFrom(node.lastElementChild?.getAttribute('endtime') as string),
        arguments: [] as string[],
        assigns: [] as string[],
        msgs: [] as any[],
        path: '',
        color: '',
        doc: '' as string | null | undefined,
      }
      item.id = list.length
      item.path = `${path}[${list.length}]`
      item.color = STATUS_COLORS[item.status]

      if (item.library) {
        item.doc = node.firstElementChild?.textContent
      }

      const assigns = doc.evaluate(`${path}/assign/var`, doc)
      let ass = assigns.iterateNext()
      while (ass) {
        if (ass.textContent) item.assigns.push(ass.textContent)
        ass = assigns.iterateNext()
      }

      const args = doc.evaluate(`${path}/arguments/arg`, doc)
      let arg = args.iterateNext()
      while (arg) {
        if (arg.textContent) item.arguments.push(arg.textContent)
        arg = args.iterateNext()
      }

      const msgs = doc.evaluate(`${path}[${list.length + 1}]/msg`, doc)
      let msg = msgs.iterateNext() as any
      while (msg) {
        item.msgs.push({
          id: `${path}__msg__${item.msgs.length}`,
          timestamp: formatDateFrom(msg.getAttribute('timestamp') as string),
          html: msg.getAttribute('html') === 'true',
          level: msg.getAttribute('level') as string,
          content: msg.textContent,
        })
        msg = msgs.iterateNext()
      }

      list.push(item)

      node = result.iterateNext() as Element
    }

    return list
  }, [doc, path])

  return data.map((x) => (
    <div key={`${path}__${x.id}`}>
      <ExpandButton
        type={x.type || ''}
        name={
          <>
            {x.library && (
              <small className='text-muted fw-normal align-self-end'>{x.library}.</small>
            )}
            {x.name}
          </>
        }
      >
        <dl className={`row border-start border-5 border-${x.color}`}>
          <div className='col-auto'>
            <dt>Status</dt>
            <dd
              className={`fw-bold text-${STATUS_COLORS[x.status as keyof typeof STATUS_COLORS]}`}
            >
              {x.status}
            </dd>
          </div>
          <div className='col-auto'>
            <dt>Start time</dt>
            <dd>{x.startTime}</dd>
          </div>
          <div className='col-auto'>
            <dt>End time</dt>
            <dd>{x.endTime}</dd>
          </div>

          {x.doc && <div className='fst-italic mt-3'>{x.doc}</div>}

          {!!x.arguments.length && (
            <div>
              <span className='fw-bold'>Arguments: </span>
              {x.arguments.join(', ')}
            </div>
          )}
          {!!x.assigns.length && (
            <div>
              <span className='fw-bold'>Assigns: </span>
              {x.arguments.join(', ')}
            </div>
          )}
        </dl>

        <table className='table table-sm table-hover table-borderless'>
          <tbody>
            {x.msgs.map((msg: any) => (
              <tr key={msg.id} id={msg.id}>
                <td className='text-nowrap' style={{ width: '1%' }}>
                  {msg.timestamp}
                </td>
                <td
                  className={`fw-bold text-${STATUS_COLORS[msg.level as keyof typeof STATUS_COLORS]}`}
                >
                  {msg.level}
                </td>
                {msg.html ? (
                  <td dangerouslySetInnerHTML={{ __html: msg.content }} />
                ) : (
                  <td>{msg.content}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Keywords path={`${x.path}/kw`} />
      </ExpandButton>
    </div>
  ))
}
