import { TabPane } from './tab-pane';
import { NavItem } from './nav-item';
import { StatisticTable } from './statistic.table';

const fetchData = () =>
  fetch('/output.xml')
    .then((res) => res.text())
    .then((xml) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      return doc;
    });

const Main = () => {
  const [tab, setTab] = React.useState('home');
  const [doc, setDoc] = React.useState<Document>();

  React.useEffect(() => {
    fetchData().then(setDoc);
  }, []);

  const statisticData = React.useMemo(() => {
    if (!doc) return [];
    const list = [];

    const fillData = (nodeName, results) => {
      let node: Element = results.iterateNext();
      while (node) {
        const item = {
          nodeName,
          name: node.textContent,
          pass: parseInt(node.getAttribute('pass')),
          fail: parseInt(node.getAttribute('fail')),
          skip: parseInt(node.getAttribute('skip')) || 0
        };
        item.total = item.fail + item.pass + item.skip;
        list.push(item);
        node = results.iterateNext();
      }
    };
    fillData(
      'total',
      doc.evaluate(
        '/robot/statistics/total/stat',
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      )
    );
    fillData(
      'tag',
      doc.evaluate(
        '/robot/statistics/tag/stat',
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      )
    );
    fillData(
      'suite',
      doc.evaluate(
        '/robot/statistics/suite/stat',
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      )
    );

    return list;
  }, [doc]);

  const info = React.useMemo(() => {
    if (!doc) return {};
    // debugger;
    const totalNode: Element = doc.evaluate(
      '/robot/statistics/total/stat',
      doc,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    const node: Element = totalNode.iterateNext();
    const total = {
      name: node.textContent,
      pass: parseInt(node.getAttribute('pass')),
      fail: parseInt(node.getAttribute('fail')),
      skip: parseInt(node.getAttribute('skip')) || 0
    };
    total.total = total.fail + total.pass + total.skip;
    // const generator :Element = doc.evaluate('robot//@generator', doc).iterateNext();
    const robot: Element = doc.evaluate('robot', doc).iterateNext();
    return {
      total,
      generator: robot.getAttribute('generator'),
      generated: robot.getAttribute('generated')
    };
  }, [doc]);

  if (!doc) return null;

  return (
    <div className="row min-vh-100">
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
        <div className="position-sticky pt-3">
          <ul className="nav flex-column">
            <NavItem activeTab={tab} tab="statistic" setTab={setTab}>
              Statistic
            </NavItem>
            <NavItem activeTab={tab} tab="suite" setTab={setTab}>
              Suite metrics
            </NavItem>
          </ul>
        </div>
      </nav>

      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="tab-content">
          <TabPane activeTab={tab} tab="statistic">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <h2>Statistic</h2>
              {/* <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group me-2">
              <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
              <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
              <span data-feather="calendar" />
              This week
            </button>
          </div> */}
            </div>

            <StatisticTable data={statisticData} info={info} />
          </TabPane>
          <TabPane activeTab={tab} tab="suite">
            ...
          </TabPane>
        </div>
      </main>
    </div>
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
