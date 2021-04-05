(function (reactTransitionGroup, reactTable) {
  'use strict';

  var TabPane=function(a){var b=a.tab,c=a.activeTab,d=a.children;return/*#__PURE__*/React.createElement(reactTransitionGroup.CSSTransition,{classNames:{enter:"active",enterDone:"active show",appear:"active"},timeout:150,in:b===c},/*#__PURE__*/React.createElement("div",{className:"tab-pane fade",role:"tabpanel"},d))};

  var NavItem=function(a){var b=a.tab,c=a.activeTab,d=a.children,e=a.setTab;return/*#__PURE__*/React.createElement("li",{className:"nav-item"},/*#__PURE__*/React.createElement("a",{className:"nav-link"+(b===c?" active":""),"aria-current":"page",href:"#"+b,onClick:function onClick(){return e(b)}},d))};

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var StatisticTable=function(a){var b=a.data,c=a.info,d=React.useMemo(function(){return [{Header:"Type",accessor:"nodeName"},{Header:"Name",accessor:"name"},{Header:"Total",accessor:"total"},{Header:"Pass",accessor:"pass"},{Header:"Fail",accessor:"fail"}]},[]),e=reactTable.useTable({columns:d,data:b,initialState:{groupBy:["nodeName"],expanded:{"nodeName:tag":!0,"nodeName:suite":!0,"nodeName:total":!0}}},reactTable.useSortBy,reactTable.useGroupBy,reactTable.useExpanded),f=e.getTableProps,g=e.getTableBodyProps,h=e.headerGroups,i=e.rows,j=e.prepareRow,k=i.slice(0,20);return/*#__PURE__*/React.createElement("div",{className:"table-responsive"},/*#__PURE__*/React.createElement("table",_extends({className:"table"},f()),/*#__PURE__*/React.createElement("caption",null,c.generator+" - "+c.generated),/*#__PURE__*/React.createElement("thead",{className:"table-light"},h.map(function(a){return/*#__PURE__*/React.createElement("tr",a.getHeaderGroupProps(),a.headers.map(function(a){return/*#__PURE__*/ (// Add the sorting props to control sorting. For this example
  // we can add them into the header props
  React.createElement("th",a.getHeaderProps(a.getSortByToggleProps()),a.render("Header"),/*#__PURE__*/React.createElement("span",null,a.isSorted?a.isSortedDesc?/*#__PURE__*/React.createElement("span",{className:"fa-sort-up"}):/*#__PURE__*/React.createElement("span",{className:"fa-sort-down"}):"")))}))})),/*#__PURE__*/React.createElement("tbody",g(),k.map(function(a){return j(a),/*#__PURE__*/React.createElement("tr",a.getRowProps(),a.cells.map(function(b){return/*#__PURE__*/React.createElement("td",_extends({className:a.isExpanded?"table-secondary text-uppercase fs-5 fw-bold":""},b.getCellProps()),b.isAggregated?b.render("Aggregated"):b.isPlaceholder?null:b.render("Cell"))}))}))))};

  var fetchData=function(){return fetch("/output.xml").then(function(a){return a.text()}).then(function(a){var b=new DOMParser,c=b.parseFromString(a,"application/xml");return c})},Main=function(){var a=React.useState("home"),b=a[0],c=a[1],d=React.useState(),e=d[0],f=d[1];React.useEffect(function(){fetchData().then(f);},[]);var g=React.useMemo(function(){if(!e)return [];var a=[],b=function(b,c){for(var d,e=c.iterateNext();e;)d={nodeName:b,name:e.textContent,pass:parseInt(e.getAttribute("pass")),fail:parseInt(e.getAttribute("fail")),skip:parseInt(e.getAttribute("skip"))||0},d.total=d.fail+d.pass+d.skip,a.push(d),e=c.iterateNext();};return b("total",e.evaluate("/robot/statistics/total/stat",e,null,XPathResult.ANY_TYPE,null)),b("tag",e.evaluate("/robot/statistics/tag/stat",e,null,XPathResult.ANY_TYPE,null)),b("suite",e.evaluate("/robot/statistics/suite/stat",e,null,XPathResult.ANY_TYPE,null)),a},[e]),h=React.useMemo(function(){if(!e)return {};// debugger;
  var a=e.evaluate("/robot/statistics/total/stat",e,null,XPathResult.ANY_TYPE,null),b=a.iterateNext(),c={name:b.textContent,pass:parseInt(b.getAttribute("pass")),fail:parseInt(b.getAttribute("fail")),skip:parseInt(b.getAttribute("skip"))||0};c.total=c.fail+c.pass+c.skip;// const generator :Element = doc.evaluate('robot//@generator', doc).iterateNext();
  var d=e.evaluate("robot",e).iterateNext();return {total:c,generator:d.getAttribute("generator"),generated:d.getAttribute("generated")}},[e]);return e?/*#__PURE__*/React.createElement("div",{className:"row min-vh-100"},/*#__PURE__*/React.createElement("nav",{id:"sidebarMenu",className:"col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"},/*#__PURE__*/React.createElement("div",{className:"position-sticky pt-3"},/*#__PURE__*/React.createElement("ul",{className:"nav flex-column"},/*#__PURE__*/React.createElement(NavItem,{activeTab:b,tab:"statistic",setTab:c},"Statistic"),/*#__PURE__*/React.createElement(NavItem,{activeTab:b,tab:"suite",setTab:c},"Suite metrics")))),/*#__PURE__*/React.createElement("main",{className:"col-md-9 ms-sm-auto col-lg-10 px-md-4"},/*#__PURE__*/React.createElement("div",{className:"tab-content"},/*#__PURE__*/React.createElement(TabPane,{activeTab:b,tab:"statistic"},/*#__PURE__*/React.createElement("div",{className:"d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3"},/*#__PURE__*/React.createElement("h2",null,"Statistic")),/*#__PURE__*/React.createElement(StatisticTable,{data:g,info:h})),/*#__PURE__*/React.createElement(TabPane,{activeTab:b,tab:"suite"},"...")))):null},domContainer=document.querySelector("#root");ReactDOM.render(React.createElement(Main),domContainer);

}(ReactTransitionGroup, ReactTable));
//# sourceMappingURL=robot.js.map
