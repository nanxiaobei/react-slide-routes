import { css, jsx } from '@emotion/react';
import { useMemo, useRef, cloneElement, Children, ReactElement } from 'react';
import t from 'prop-types';
import { useLocation, useRoutes, createRoutesFromChildren, matchRoutes, RouteObject } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Direction = 'forward' | 'back'

const getCss = (
  duration: SlideRoutesProps['duration'],
  timing: SlideRoutesProps['timing'],
  direction: Direction,
) => css`
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

const findRouteIndex = (routes: RouteObject[], pathname: string): number => {
  const matches = matchRoutes(routes, pathname);
  if (matches === null) throw new Error(`Route ${pathname} does not match`)
  return routes.findIndex((route) => matches.some((match) => route === match.route))
}

const SlideRoutes = ({ animation, duration, timing, destroy, children }: SlideRoutesProps) => {
  const location = useLocation();
  const { pathname } = location;

  const prevPath = useRef<string>();
  const direction = useRef<Direction>();

  const routeList = useMemo(() => {
    return Children.map(children, (child) => {
      if (!child) return child;

      const { element, ...restProps } = child.props;
      if (!element || element.props.replace === true) return child;

      const newElement = <div className="item">{element}</div>;
      return { ...child, props: { ...restProps, element: newElement } };
    });
  }, [children]);

  const routes = useMemo(() => createRoutesFromChildren(routeList), [routeList]);
  const routesElement = useRoutes(routes, location);
  
  if (prevPath.current && prevPath.current !== pathname) {
    const prevIndex = findRouteIndex(routes, prevPath.current);
    const nextIndex = findRouteIndex(routes, pathname);
    direction.current = prevIndex < nextIndex ? 'forward' : 'back';
  }
  prevPath.current = pathname;

  const cssProps = useMemo(
    () => (destroy ? { timeout: duration } : { addEndListener() {} }),
    [destroy, duration]
  );

  return (
    <TransitionGroup
      className={`slide-routes ${animation}`}
      childFactory={(child) => cloneElement(child, { classNames: direction.current })}
      css={getCss(duration, timing, direction.current!)}
    >
      <CSSTransition key={pathname} {...cssProps}>
        {routesElement}
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
} as const;

SlideRoutes.propTypes = {
  animation: t.oneOf(['slide', 'vertical-slide', 'rotate'] as SlideRoutesProps['animation'][]),
  duration: t.number,
  timing: t.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] as SlideRoutesProps['timing'][]),
  destroy: t.bool,
  children: t.element,
} as const;

export interface SlideRoutesProps {
  animation: 'slide' | 'vertical-slide' | 'rotate',
  duration: number,
  timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear',
  destroy: boolean,
  children: ReactElement[],
};

export default SlideRoutes;
