/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef, useMemo, cloneElement } from 'react';
import t from 'prop-types';
import { Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * useSave
 */
const useSave = (key, initVal) => {
  const initRef = useRef(initVal);

  return useMemo(() => {
    const get = () => JSON.parse(sessionStorage.getItem(key));
    const setVal = (val) => sessionStorage.setItem(key, JSON.stringify(val));
    const removeVal = () => sessionStorage.removeItem(key);

    const init = initRef.current;
    if (init !== undefined && get() === null) setVal(init);

    const set = (val) => {
      const newVal = typeof val === 'function' ? val(get()) : val;
      newVal === undefined ? removeVal() : setVal(newVal);
    };

    return [get, set];
  }, [key]);
};

/**
 * styles
 */
const getCSS = (time, type, direction) => css`
  display: grid;
  overflow: hidden;
  > * {
    grid-area: 1 / 1 / 2 / 2;
  }
  > *:not(:only-child) {
    &.${direction}-enter-active, &.${direction}-exit-active {
      transition: transform ${time}ms ${type};
    }
  }

  // back
  .back-enter {
    transform: translateX(-100%);
  }
  .back-enter-active {
    transform: translateX(0);
  }
  .back-exit {
    transform: translateX(0);
  }
  .back-exit-active {
    transform: translate(100%);
  }

  // next
  .next-enter {
    transform: translateX(100%);
  }
  .next-enter-active {
    transform: translateX(0);
  }
  .next-exit {
    transform: translateX(0);
  }
  .next-exit-active {
    transform: translateX(-100%);
  }
`;

/**
 * SlideRoutes
 */
const SlideRoutes = ({ location, time, type, destroy, children }) => {
  const [getPathList, setPathList] = useSave('::slide::history::', []);
  const prevPath = useRef(getPathList()[0]);
  const move = useRef('');

  const { pathname } = location;
  if (prevPath.current !== pathname) {
    prevPath.current = pathname;

    setPathList((pathList) => {
      const index = pathList.lastIndexOf(pathname);

      if (index === -1) {
        move.current = 'next';
        pathList.push(pathname);
      } else {
        move.current = 'back';
        pathList.length = index + 1;
      }

      return pathList;
    });
  }

  useEffect(() => {
    return () => {
      setPathList();
    };
  }, [setPathList]);

  const direction = move.current;
  const CSSProps = destroy ? { timeout: time } : { addEndListener() {} };

  return (
    <TransitionGroup
      className="slide-routes"
      childFactory={(child) => cloneElement(child, { classNames: direction })}
      css={getCSS(time, type, direction)}
    >
      <CSSTransition key={pathname} {...CSSProps}>
        <Switch location={location}>{children}</Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

SlideRoutes.defaultProps = {
  time: 200,
  type: 'ease',
  destroy: true,
};

SlideRoutes.propTypes = {
  location: t.object.isRequired,
  time: t.number,
  type: t.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  destroy: t.bool,
  children: t.node,
};

export default SlideRoutes;
