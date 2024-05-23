import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { intervalToDuration } from 'date-fns'
import React, { useMemo, useState } from 'react'

import { STATUS, STATUS_COLORS, SuiteNode, useAppContext } from './contants'
import { formatDate, formatDuration, parseDate } from './datetime'
import { Log } from './log'

const getSuiteInfo = (el: Element) => {
  const status = el.lastElementChild
  const result: SuiteNode = {
    name: el.getAttribute('name') as string,
    id: el.getAttribute('id') as string,
    status: status?.getAttribute('status') || 'NULL',
    startTime: parseDate(status?.getAttribute('starttime')) as Date,
    endTime: parseDate(status?.getAttribute('endtime')) as Date,
  }

  return result
}

export const TestsTable: React.FunctionComponent = () => {
  const doc = useAppContext()
  const [logId, setLogId] = useState<string>()

  const data = useMemo(() => {
    if (!doc) return []

    const suite = doc.evaluate('/robot/suite', doc)
    const list = []
    let node: Element = suite.iterateNext() as Element

    while (node) {
      const item = getSuiteInfo(node)

      const subRows = []
      const subSuite = doc.evaluate(`/robot/suite[@id='${item.id}']/suite`, doc)
      let subNode = subSuite.iterateNext() as Element
      while (subNode) {
        subRows.push(getSuiteInfo(subNode))
        subNode = subSuite.iterateNext() as Element
      }
      if (subRows.length > 0) item.subRows = subRows
      list.push(item)
      node = suite.iterateNext() as Element
    }

    return list
  }, [doc])

  const columns = useMemo<Array<ColumnDef<SuiteNode, any>>>(
    () => [
      {
        id: 'expander',
        size: 30,
        header: ({ table: { getIsAllRowsExpanded, toggleAllRowsExpanded } }) => (
          <span onClick={() => toggleAllRowsExpanded()}>
            {getIsAllRowsExpanded() ? '👇' : '👉'}
          </span>
        ),
        // cell: ({ row }) =>
        //   // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        //   // to build the toggle for expanding a row
        //   row.canExpand ? (
        //     <span
        //       {...row.getToggleRowExpandedProps({
        //         className: `ms-${row.depth * 2}`,
        //       })}
        //     >
        //       {row.isExpanded ? '👇' : '👉'}
        //     </span>
        //   ) : null,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row, getValue }: CellContext<SuiteNode, string>) => (
          <a
            href={`#${row?.original.id}`}
            className='link-info'
            onClick={() => setLogId(row?.original.id)}
          >
            {getValue()}
          </a>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <span className={`fw-bold text-${STATUS_COLORS[getValue() as STATUS]}`}>
            {getValue()}
          </span>
        ),
      },
      {
        header: 'Elapsed',
        accessorFn: (row: SuiteNode) =>
          formatDuration(
            intervalToDuration({
              start: new Date(row.startTime),
              end: new Date(row.endTime),
            }),
          ),
      },
      {
        header: 'Start / End',
        minSize: 300,
        cell: ({ row }) => (
          <small>
            {formatDate(row.original.startTime)}
            <br />
            {formatDate(row.original.endTime)}
          </small>
        ),
      },
    ],
    [setLogId],
  )

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    initialState: {
      // grouping: ['name'],
      // expanded: {
      //   'nodeName:tag': true,
      //   'nodeName:suite': true,
      //   'nodeName:total': true
      // }
    },
    getExpandedRowModel: getExpandedRowModel(),
    // getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.subRows,
  })

  return (
    <>
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ minWidth: `${header.getSize()}px` }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      // className={row.isExpanded ? 'fw-bold' : ''}
                      key={cell.id}
                    >
                      {cell.getIsGrouped() ? (
                        <button
                          onClick={row.getToggleExpandedHandler()}
                          style={{
                            cursor: row.getCanExpand() ? 'pointer' : 'normal',
                          }}
                        >
                          {row.getIsExpanded() ? '👇' : '👉'}{' '}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())} (
                          {row.subRows.length})
                        </button>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* <Log path={`//suite[@id="s1"]`} /> */}
      {logId && <Log root path={`//suite[@id="${logId}"]`} />}
    </>
  )
}
