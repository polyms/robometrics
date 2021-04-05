import { useTable, useSortBy, useGroupBy, useExpanded } from 'react-table';
import { TestNode } from './contants';

type StatisticTableProps = {
  data: TestNode[];
  info: TestNode;
};

export const StatisticTable: React.FunctionComponent<StatisticTableProps> = ({
  data,
  info
}: StatisticTableProps) => {
  const columns = React.useMemo(
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
        groupBy: ['nodeName'],
        expanded: {
          'nodeName:tag': true,
          'nodeName:suite': true,
          'nodeName:total': true
        }
      }
    },
    useSortBy,
    useGroupBy,
    useExpanded
  );

  const firstPageRows = rows.slice(0, 20);

  return (
    <div className="table-responsive">
      <table className="table" {...getTableProps()}>
        <caption>{`${info.generator} - ${info.generated}`}</caption>
        <thead className="table-light">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="fa-sort-up" />
                      ) : (
                        <span className="fa-sort-down" />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    className={
                      row.isExpanded
                        ? 'table-secondary text-uppercase fs-5 fw-bold'
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
