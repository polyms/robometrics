import intervalToDuration from 'date-fns/intervalToDuration';
import React, { useMemo, useState } from 'react';
import {
  CellProps,
  Column,
  HeaderProps,
  useExpanded,
  useSortBy,
  useTable
} from 'react-table';
import { STATUS_COLORS, SuiteNode, TestNode, useAppContext } from './contants';
import { formatDate, formatDuration, parseDate } from './datetime';
import { Log } from './log';

const getSuiteInfo = (el: Element) => {
  const status = el.lastElementChild;
  const result: SuiteNode = {
    name: el.getAttribute('name') as string,
    id: el.getAttribute('id') as string,
    status: status?.getAttribute('status') || 'NULL',
    startTime: parseDate(status?.getAttribute('starttime')) as Date,
    endTime: parseDate(status?.getAttribute('endtime')) as Date
  };

  return result;
};

export const TestsTable: React.FunctionComponent = () => {
  const doc = useAppContext();
  const [logId, setLogId] = useState<string>();

  const data = useMemo(() => {
    if (!doc) return [];

    const suite = doc.evaluate('/robot/suite', doc);
    const list = [];
    let node: Element = suite.iterateNext() as Element;

    while (node) {
      const item = getSuiteInfo(node);

      const subRows = [];
      const subSuite = doc.evaluate(
        `/robot/suite[@id='${item.id}']/suite`,
        doc
      );
      let subNode = subSuite.iterateNext() as Element;
      while (subNode) {
        subRows.push(getSuiteInfo(subNode));
        subNode = subSuite.iterateNext() as Element;
      }
      if (subRows.length > 0) item.subRows = subRows;
      list.push(item);
      node = suite.iterateNext() as Element;
    }

    return list;
  }, [doc]);

  const columns = useMemo<Array<Column<SuiteNode>>>(
    () => [
      {
        id: 'expander',
        Header: ({
          getToggleAllRowsExpandedProps,
          isAllRowsExpanded
        }: React.PropsWithChildren<HeaderProps<SuiteNode>>) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '👇' : '👉'}
          </span>
        ),
        Cell: ({ row }: CellProps<TestNode>) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                className: `ms-${row.depth * 2}`
              })}
            >
              {row.isExpanded ? '👇' : '👉'}
            </span>
          ) : null
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }: CellProps<TestNode>) => (
          <a
            href={`#${row?.original.id}`}
            className="link-info"
            onClick={() => setLogId(row?.original.id)}
          >
            {value}
          </a>
        )
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: CellProps<TestNode>) => (
          <span className={`fw-bold text-${STATUS_COLORS[value]}`}>
            {value}
          </span>
        )
      },
      {
        Header: 'Elapsed',
        accessor: (row: SuiteNode) =>
          formatDuration(
            intervalToDuration({
              start: row.startTime,
              end: row.endTime
            })
          )
      },
      {
        Header: 'Start / End',
        accessor: (row: SuiteNode) => (
          <small>
            {formatDate(row.startTime)}
            <br />
            {formatDate(row.endTime)}
          </small>
        )
      }
    ],
    [setLogId]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: {
        // groupBy: ['nodeName'],
        // expanded: {
        //   'nodeName:tag': true,
        //   'nodeName:suite': true,
        //   'nodeName:total': true
        // }
      }
    },
    useSortBy,
    useExpanded
  );

  return (
    <>
      <div className="table-responsive">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '👇'
                          : '👉'
                        : ''}
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
                      // className={row.isExpanded ? 'fw-bold' : ''}
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

      {/* <Log path={`//suite[@id="s1"]`} /> */}
      {logId && <Log root path={`//suite[@id="${logId}"]`} />}
    </>
  );
};
