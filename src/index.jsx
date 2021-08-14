/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useMemo, useRef, cloneElement, createElement, Children } from 'react';
import t from 'prop-types';
import { Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const getCss = (duration, timing, direction) => css`
  display: grid;

  .item {
    grid-area: 1 / 1 / 2 / 2;

    &:not(:only-child) {
      &.${direction}-enter-active, &.${direction}-exit-active {
        transition: transform ${duration}ms ${timing};
      }
    }
  }

  &.slide {
    overflow: hidden;

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
      transform: translateX(100%);
    }

    // forward
    .forward-enter {
      transform: translateX(100%);
    }
    .forward-enter-active {
      transform: translateX(0);
    }
    .forward-exit {
      transform: translateX(0);
    }
    .forward-exit-active {
      transform: translateX(-100%);
    }
  }

  &.vertical-slide {
    overflow: hidden;

    // back
    .back-enter {
      transform: translateY(-100%);
    }
    .back-enter-active {
      transform: translateY(0);
    }
    .back-exit {
      transform: translateY(0);
    }
    .back-exit-active {
      transform: translateY(100%);
    }

    // forward
    .forward-enter {
      transform: translateY(100%);
    }
    .forward-enter-active {
      transform: translateY(0);
    }
    .forward-exit {
      transform: translateY(0);
    }
    .forward-exit-active {
      transform: translateY(-100%);
    }
  }

  &.rotate {
    perspective: 2000px;

    .item {
      backface-visibility: hidden;
    }

    // back
    .back-enter {
      transform: rotateY(-180deg);
    }
    .back-enter-active {
      transform: rotateY(0);
    }
    .back-exit {
      transform: rotateY(0);
    }
    .back-exit-active {
      transform: rotateY(180deg);
    }

    // forward
    .forward-enter {
      transform: rotateY(180deg);
    }
    .forward-enter-active {
      transform: rotateY(0);
    }
    .forward-exit {
      transform: rotateY(0);
    }
    .forward-exit-active {
      transform: rotateY(-180deg);
    }
  }
`;

const SlideRoutes = ({ location, animation, pathList, duration, timing, destroy, children }) => {
  const cssProps = useMemo(() => {
    return destroy ? { timeout: duration } : { addEndListener() {} };
  }, [destroy, duration]);

  const { pathname } = location;
  const hasMount = useRef(false);
  const prevPath = useRef();

  const selfList = useRef();
  const selfKey = '::slide::history::';

  const direction = useRef('');

  if (!hasMount.current) {
    // 初始化
    hasMount.current = true;

    if (pathList.length > 0) {
      prevPath.current = pathname;
    } else {
      const cacheList = sessionStorage.getItem(selfKey);
      if (!cacheList) {
        selfList.current = [pathname];
        prevPath.current = pathname;
        sessionStorage.setItem(selfKey, JSON.stringify(selfList.current));
      } else {
        selfList.current = JSON.parse(cacheList);
        prevPath.current = selfList.current[selfList.current.length - 1];
      }
    }
  } else {
    // 更新
    if (prevPath.current !== pathname) {
      if (pathList.length > 0) {
        const prevIndex = pathList.indexOf(prevPath.current);
        const nextIndex = pathList.indexOf(pathname);
        direction.current = prevIndex < nextIndex ? 'forward' : 'back';
      } else {
        const nextIndex = selfList.current.lastIndexOf(pathname);

        if (nextIndex === -1) {
          direction.current = 'forward';
          selfList.current.push(pathname);
        } else {
          direction.current = 'back';
          selfList.current.length = nextIndex + 1;
        }

        sessionStorage.setItem(selfKey, JSON.stringify(selfList.current));
      }

      prevPath.current = pathname;
    }
  }

  return (
    <TransitionGroup
      className={`slide-routes ${animation}`}
      childFactory={(child) => cloneElement(child, { classNames: direction.current })}
      css={getCss(duration, timing, direction.current)}
    >
      <CSSTransition key={pathname} {...cssProps}>
        <Switch location={location}>
          {Children.map(children, (child) => {
            if (!child) return child;

            const { render, component, ...restProps } = child.props;
            const element = render ? render() : createElement(component);
            if (element.props.replace === true) return child;

            const newRender = () => <div className="item">{element}</div>;
            return { ...child, props: { ...restProps, render: newRender } };
          })}
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

SlideRoutes.defaultProps = {
  animation: 'slide',
  pathList: [],
  duration: 200,
  timing: 'ease',
  destroy: true,
};

SlideRoutes.propTypes = {
  location: t.object.isRequired,
  animation: t.oneOf(['slide', 'vertical-slide', 'rotate']),
  pathList: t.array,
  duration: t.number,
  timing: t.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  destroy: t.bool,
  children: t.node,
};

export default SlideRoutes;
