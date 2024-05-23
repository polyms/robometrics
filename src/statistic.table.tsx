import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useMemo } from 'react'

import { TestNode } from './contants'

type StatisticTableProps = {
  data: TestNode[]
  info: {
    generator: string | null
    generated: string | null
  }
}

export const StatisticTable: React.FunctionComponent<StatisticTableProps> = ({
  data,
  info,
}: StatisticTableProps) => {
  const columns = useMemo<Array<ColumnDef<TestNode>>>(
    () => [
      {
        header: 'Type',
        accessorKey: 'nodeName',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Total',
        accessorKey: 'total',
      },
      {
        header: 'Pass',
        accessorKey: 'pass',
      },
      {
        header: 'Fail',
        accessorKey: 'fail',
      },
    ],
    [],
  )

  const { getRowModel, getHeaderGroups } = useReactTable({
    columns,
    data,
    initialState: {
      grouping: ['nodeName'],
      expanded: {
        'nodeName:tag': true,
        'nodeName:suite': true,
        'nodeName:total': true,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className='table-responsive m-1'>
      <table className='table mb-0'>
        <caption className='px-2 small'>{`${info.generator} - ${info.generated}`}</caption>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th key={header.id} colSpan={header.colSpan}>
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
                    key={cell.id}
                    className={
                      row.getIsExpanded()
                        ? 'table-primary text-primary text-uppercase fs-5 fw-bold'
                        : ''
                    }
                  >
                    {cell.getIsGrouped() ? (
                      <>
                        <button
                          onClick={row.getToggleExpandedHandler()}
                          style={{
                            cursor: row.getCanExpand() ? 'pointer' : 'normal',
                          }}
                        >
                          {row.getIsExpanded() ? '👇' : '👉'}{' '}
                        </button>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())} (
                        {row.subRows.length})
                      </>
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
  )
}
