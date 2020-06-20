import React, { useRef } from 'react';
import { Switch } from 'react-router-dom';
import t from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.less';

/**
 * save
 */
const save = (key, initVal) => {
  const getVal = () => JSON.parse(sessionStorage.getItem(key));
  const setVal = (val) => sessionStorage.setItem(key, JSON.stringify(val));
  if (getVal() === null) setVal(initVal);
  const get = () => {
    const val = getVal();
    return val === null ? undefined : val;
  };
  const set = (val) => {
    const newVal = typeof val === 'function' ? val(get()) : val;
    setVal(newVal);
  };
  return [get, set];
};

/**
 * history
 */
const [getPaths, setPaths] = save('::slide::history::', []);
let prevPath = getPaths()[0];
let direction;

/**
 * SlideRoutes
 */
const SlideRoutes = ({ location, time: timeout = 200, destroy = true, children }) => {
  const CSSProps = useRef(destroy ? { timeout } : { addEndListener() {} });

  const { pathname } = location;
  if (prevPath !== pathname) {
    prevPath = pathname;

    setPaths((stack) => {
      const lastIndex = stack.lastIndexOf(pathname);

      if (lastIndex === -1) {
        direction = 'next';
        stack.push(pathname);
      } else {
        direction = 'back';
        stack.length = lastIndex + 1;
      }

      return stack;
    });
  }

  return (
    <TransitionGroup
      className="slide-routes"
      childFactory={(child) => React.cloneElement(child, { classNames: direction })}
    >
      <CSSTransition {...CSSProps.current} key={location.pathname}>
        <div className="slide">
          <Switch location={location}>{children}</Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

SlideRoutes.propTypes = {
  location: t.object,
  time: t.string,
  destroy: t.bool,
  children: t.node,
};

export default SlideRoutes;
