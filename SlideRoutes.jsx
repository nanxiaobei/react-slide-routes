import React, { useRef } from 'react';
import t from 'prop-types';
import { Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
 * styles
 */
const getStyles = ({ duration, effect, direction }) => css`
  display: grid;
  margin-left: -32px;
  margin-right: -32px;
  overflow: hidden;
  .slide {
    padding-left: 32px;
    padding-right: 32px;
    grid-area: 1 / 1 / 2 / 2;
    &:empty,
    &:empty ~ .slide {
      transform: translateX(0);
      transition: none;
    }
  }
  .${direction}-enter-active, .${direction}-exit-active {
    transition: transform ${duration}ms ${effect};
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
 * route history
 */
const [getPaths, setPaths] = save('::slide::history::', []);
let prevPath = getPaths()[0];
let direction;

/**
 * SlideRoutes
 */
const SlideRoutes = ({ location, duration, effect, destroy, children }) => {
  const CSSProps = useRef(destroy ? { timeout: duration } : { addEndListener() {} });

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
      css={getStyles({ duration, effect, direction })}
    >
      <CSSTransition {...CSSProps.current} key={location.pathname}>
        <div className="slide">
          <Switch location={location}>{children}</Switch>
        </div>
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
