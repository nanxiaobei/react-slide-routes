/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  cloneElement,
  createElement,
  Children,
} from 'react';
import t from 'prop-types';
import { Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * save
 */
const save = (key, init) => {
  const getRaw = () => sessionStorage.getItem(key);
  const set = (val) => sessionStorage.setItem(key, JSON.stringify(val));
  const remove = () => sessionStorage.removeItem(key);

  if (init !== undefined && getRaw() === null) set(init);

  const getVal = () => JSON.parse(getRaw());
  const setVal = (val) => (val === undefined ? remove() : set(val));

  return [getVal, setVal];
};

/**
 * useSave
 */
const useSave = (key, initVal) => {
  const initRef = useRef(initVal);
  const [getVal, setVal] = useMemo(() => save(key, initRef.current), [key]);

  const [state, setState] = useState(getVal());

  const set = useCallback(
    (val) => {
      setVal(val);
      setState(val);
    },
    [setVal]
  );

  return [state, set];
};

/**
 * styles
 */
const getCSS = (duration, timing, direction) => css`
  display: grid;
  .item {
    grid-area: 1 / 1 / 2 / 2;
  }
  .item:not(:only-child) {
    &.${direction}-enter-active, &.${direction}-exit-active {
      transition: transform ${duration}ms ${timing};
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

    // next
    .next-enter {
      transform: rotateY(180deg);
    }
    .next-enter-active {
      transform: rotateY(0);
    }
    .next-exit {
      transform: rotateY(0);
    }
    .next-exit-active {
      transform: rotateY(-180deg);
    }
  }
`;

/**
 * SlideRoutes
 */
const SlideRoutes = ({ location, animation, pathList, duration, timing, destroy, children }) => {
  const [historyList, setHistoryList] = useSave('::slide::history::', []);

  const hasPathList = useMemo(() => {
    const has = pathList?.length > 0;
    if (has && historyList) setHistoryList(undefined);
    return has;
  }, [historyList, pathList, setHistoryList]);

  const { pathname } = location;
  const prevPath = useRef(hasPathList ? pathname : historyList?.[0]);
  const move = useRef('');

  if (prevPath.current !== pathname) {
    if (hasPathList) {
      const prevIndex = pathList.indexOf(prevPath.current);
      const nextIndex = pathList.indexOf(pathname);

      if (nextIndex > prevIndex) {
        move.current = 'next';
      } else {
        move.current = 'back';
      }
    } else {
      const nextIndex = historyList.lastIndexOf(pathname);

      if (nextIndex === -1) {
        move.current = 'next';
        historyList.push(pathname);
      } else {
        move.current = 'back';
        historyList.length = nextIndex + 1;
      }

      setHistoryList([...historyList]);
    }

    prevPath.current = pathname;
  }

  useEffect(() => {
    return () => {
      setHistoryList(undefined);
    };
  }, [setHistoryList]);

  const direction = move.current;
  const CSSProps = destroy ? { timeout: duration } : { addEndListener() {} };

  return (
    <TransitionGroup
      className={`slide-routes ${animation}`}
      childFactory={(child) => cloneElement(child, { classNames: direction })}
      css={getCSS(duration, timing, direction)}
    >
      <CSSTransition key={pathname} {...CSSProps}>
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
  duration: 200,
  timing: 'ease',
  destroy: true,
};

SlideRoutes.propTypes = {
  location: t.object.isRequired,
  animation: t.oneOf(['slide', 'rotate']),
  pathList: t.array,
  duration: t.number,
  timing: t.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  destroy: t.bool,
  children: t.node,
};

export default SlideRoutes;
