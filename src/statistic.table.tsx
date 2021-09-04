import React, { useMemo } from 'react';
import {
  Column,
  useExpanded,
  useGroupBy,
  useSortBy,
  useTable
} from 'react-table';
import { TestNode } from './contants';

type StatisticTableProps = {
  data: TestNode[];
  info: {
    generator: string | null;
    generated: string | null;
  };
};

export const StatisticTable: React.FunctionComponent<StatisticTableProps> = ({
  data,
  info
}: StatisticTableProps) => {
  const columns = useMemo<Array<Column<TestNode>>>(
    () => [
      {
        Header: 'Type',
        accessor: 'nodeName'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Total',
        accessor: 'total'
      },
      {
        Header: 'Pass',
        accessor: 'pass'
      },
      {
        Header: 'Fail',
        accessor: 'fail'
      }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          groupBy: ['nodeName'],
          expanded: {
            'nodeName:tag': true,
            'nodeName:suite': true,
            'nodeName:total': true
          }
        }
      },
      useGroupBy,
      useSortBy,
      useExpanded
    );

  return (
    <div className="table-responsive">
      <table className="table mb-0" {...getTableProps()}>
        <caption className="px-2 small">{`${info.generator} - ${info.generated}`}</caption>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? '👇' : '👉') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    className={
                      row.isExpanded
                        ? 'table-primary text-primary text-uppercase fs-5 fw-bold'
                        : ''
                    }
                    {...cell.getCellProps()}
                  >
                    {cell.isAggregated
                      ? cell.render('Aggregated')
                      : cell.isPlaceholder
                      ? null
                      : cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
