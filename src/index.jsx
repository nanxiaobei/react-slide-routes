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
const getCss = ({ duration, effect, direction }) => css`
  display: grid;
  overflow: hidden;
  > * {
    grid-area: 1 / 1 / 2 / 2;
  }
  > *:not(:only-child) {
    &.${direction}-enter-active, &.${direction}-exit-active {
      transition: transform ${duration}ms ${effect};
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
const SlideRoutes = ({ location, duration, effect, destroy, children }) => {
  const [getPathList, setPathList] = useSave('::slide::history::', []);
  const prevPath = useRef(getPathList()[0]);
  let direction = '';

  const { pathname } = location;
  if (prevPath.current !== pathname) {
    prevPath.current = pathname;

    setPathList((pathList) => {
      const index = pathList.lastIndexOf(pathname);

      if (index === -1) {
        direction = 'next';
        pathList.push(pathname);
      } else {
        direction = 'back';
        pathList.length = index + 1;
      }

      return pathList;
    });
  }

  const CSSProps = destroy ? { timeout: duration } : { addEndListener() {} };

  useEffect(() => {
    return () => {
      setPathList();
    };
  }, [setPathList]);

  return (
    <TransitionGroup
      className="slide-routes"
      childFactory={(child) => cloneElement(child, { classNames: direction })}
      css={getCss({ duration, effect, direction })}
    >
      <CSSTransition key={pathname} {...CSSProps}>
        <Switch location={location}>{children}</Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

SlideRoutes.defaultProps = {
  duration: 200,
  effect: 'ease',
  destroy: true,
};

SlideRoutes.propTypes = {
  location: t.object.isRequired,
  duration: t.number,
  effect: t.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  destroy: t.bool,
  children: t.node,
};

export default SlideRoutes;
