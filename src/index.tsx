import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { AppContext, TestNode } from './contants';
import { Loading } from './loading';
import { NavItem } from './nav-item';
import { StatisticTable } from './statistic.table';
import { TabPane } from './tab-pane';
import { TestsTable } from './tests.table';

const fetchData = () =>
  fetch('/output.xml')
    .then((res) => res.text())
    .then((xml) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      return doc;
    });

const Main = () => {
  const [tab, setTab] = useState<string>();
  const [doc, setDoc] = useState<Document>();

  useEffect(() => {
    fetchData()
      .then(setDoc)
      .then(() => setTab('tests'));
  }, []);

  const statisticData = useMemo(() => {
    if (!doc) return [];
    const list: TestNode[] = [];

    const fillData = (nodeName: string, results: XPathResult) => {
      let node: Element | null = results.iterateNext() as Element;
      while (node) {
        const item: TestNode = {
          nodeName,
          name: node.textContent || '',
          pass: parseInt(node.getAttribute('pass') || '0'),
          fail: parseInt(node.getAttribute('fail') || '0'),
          skip: parseInt(node.getAttribute('skip') || '0'),
          total: 0
        };
        item.total = item.fail + item.pass + item.skip;
        list.push(item);
        node = results.iterateNext() as Element;
      }
    };
    fillData('total', doc.evaluate('/robot/statistics/total/stat', doc));
    fillData('tag', doc.evaluate('/robot/statistics/tag/stat', doc));
    fillData('suite', doc.evaluate('/robot/statistics/suite/stat', doc));

    return list;
  }, [doc]);

  const info = React.useMemo(() => {
    if (!doc)
      return {
        generator: null,
        generated: null
      };

    const robot: Element = doc.evaluate('robot', doc).iterateNext() as Element;
    return {
      generator: robot.getAttribute('generator'),
      generated: robot.getAttribute('generated')
    };
  }, [doc]);

  if (!doc)
    return (
      <div className="row min-vh-100">
        <div className="col-2 mx-auto">
          <Loading />
        </div>
      </div>
    );

  return (
    <AppContext.Provider value={doc}>
      <div className="row min-vh-100">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div className="position-sticky pt-3">
            <ul className="nav nav-pills flex-column">
              <NavItem activeTab={tab} tab="statistic" setTab={setTab}>
                Statistic
              </NavItem>
              <NavItem activeTab={tab} tab="tests" setTab={setTab}>
                Tests metrics
              </NavItem>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="tab-content">
            <TabPane activeTab={tab} tab="statistic">
              <h2 className="mt-3 mb-4">Statistic</h2>

              <StatisticTable data={statisticData} info={info} />
            </TabPane>
            <TabPane activeTab={tab} tab="tests">
              <h2 className="mt-3 mb-4">Tests</h2>

              <TestsTable />
            </TabPane>
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
};

const domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(Main), domContainer);

// (function () {
//   feather.replace();

//   // Graphs
//   const ctx = document.getElementById('myChart');
//   // eslint-disable-next-line no-unused-vars
//   const myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: [
//         'Sunday',
//         'Monday',
//         'Tuesday',
//         'Wednesday',
//         'Thursday',
//         'Friday',
//         'Saturday',
//       ],
//       datasets: [{
//         data: [
//           15339,
//           21345,
//           18483,
//           24003,
//           23489,
//           24092,
//           12034,
//         ],
//         lineTension: 0,
//         backgroundColor: 'transparent',
//         borderColor: '#007bff',
//         borderWidth: 4,
//         pointBackgroundColor: '#007bff',
//       }],
//     },
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: false,
//           },
//         }],
//       },
//       legend: {
//         display: false,
//       },
//     },
//   });
// }());
