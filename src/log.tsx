import React from 'react';
import { ExpandButton } from './collapse';
import { STATUS_COLORS, useAppContext } from './contants';
import { formatDateFrom } from './datetime';
import { Keywords } from './keywords';

type LogProps = {
  path: string;
  root?: boolean;
};

export const Log: React.FunctionComponent<LogProps> = ({
  path,
  root
}: LogProps) => {
  const doc = useAppContext();

  const data = React.useMemo(() => {
    const result = doc.evaluate(path, doc);
    const list = [];

    let node = result.iterateNext() as Element;
    while (node) {
      const item = {
        id: node.getAttribute('id') as string,
        type: node.nodeName,
        name: node.getAttribute('name') as string,
        status: node.lastElementChild?.getAttribute('status') as string,
        startTime: formatDateFrom(
          node.lastElementChild?.getAttribute('starttime') as string
        ),
        endTime: formatDateFrom(
          node.lastElementChild?.getAttribute('endtime') as string
        ),
        critical: node.lastElementChild?.getAttribute('critical') === 'yes',
        tags: [],
        color: 'info'
      };

      item.path = path.replace('[@id]', `[@id="${item.id}"]`);

      if (item.type !== 'suite') {
        item.color = STATUS_COLORS[item.status];
      }

      const tags = doc.evaluate(`${path}/tags/tag`, doc);
      const tag = tags.iterateNext() as Element;
      while (tag) {
        item.tags.push(tag.textContent);
        tag = tags.iterateNext() as string;
      }

      list.push(item);

      node = result.iterateNext() as Element;
    }

    return list;
  }, [doc, path]);

  return data.map((x) => (
    <div className={x.type === 'suite' ? 'mt-4' : ''} key={x.id}>
      <ExpandButton
        type={x.type}
        name={x.name}
        color={x.color}
        critical={x.critical}
        root={root}
      >
        <dl className={`row border-start border-5 border-${x.color}`}>
          <div className="col-auto">
            <dt>Status</dt>
            <dd className={`fw-bold text-${STATUS_COLORS[x.status]}`}>
              {x.status}
            </dd>
          </div>
          <div className="col-auto">
            <dt>Start time</dt>
            <dd>{x.startTime}</dd>
          </div>
          <div className="col-auto">
            <dt>End time</dt>
            <dd>{x.endTime}</dd>
          </div>
          {!!x.tags.length && (
            <div>
              <span className="fw-bold">Tags: </span>
              {x.tags.join(', ')}
            </div>
          )}
        </dl>

        <Log path={`${x.path}/*[@id]`} />
        <Keywords path={`${x.path}/kw`} />
      </ExpandButton>
    </div>
  ));
};
Log.defaultProps = {
  root: false
};
