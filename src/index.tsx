import { css } from '@emotion/react';
import { useMemo, useRef, cloneElement, Children, isValidElement, useContext } from 'react';
import type { ReactElement } from 'react';
import { useLocation, useRoutes, createRoutesFromChildren, matchRoutes, UNSAFE_RouteContext } from 'react-router-dom';
import type { RouteObject, RouteProps, NavigateProps } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Direction = 'forward' | 'back' | null;

const sign2direction = new Map<number, Direction>([[-1, 'back'], [0, null], [1, 'forward']]);

const getCss = (duration: number, timing: string, direction: Direction) => css`
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

// yoinked from useRoutes’ code:
// https://github.com/remix-run/react-router/blob/f3d3e05ec00c6950720930beaf74fecbaf9dc5b6/packages/react-router/lib/hooks.tsx#L302
const useRelPath = (pathname: string = '') => {
  const { matches: parentMatches } = useContext(UNSAFE_RouteContext);
  const routeMatch = parentMatches[parentMatches.length - 1];
  const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : '/';
  return parentPathnameBase === '/'
    ? pathname
    : pathname.slice(parentPathnameBase.length) || '/';
}

const findRouteIndex = (routes: RouteObject[], pathname: string): number => {
  const matches = matchRoutes(routes, pathname);
  if (matches === null) throw new Error(`Route ${pathname} does not match`)
  return routes.findIndex((route) => matches.some((match) => route === match.route))
}

type ChildElement = ReactElement<RouteProps> | ReactElement<NavigateProps>;

export type SlideRoutesProps = {
  animation?: 'slide' | 'vertical-slide' | 'rotate';
  duration?: number;
  timing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  destroy?: boolean;
  children: ChildElement | (ChildElement | undefined | null)[];
};

const SlideRoutes = (props: SlideRoutesProps) => {
  const {
    animation = 'slide',
    duration = 200,
    timing = 'ease',
    destroy = true,
    children,
  } = props;

  const location = useLocation();
  const relPath = useRelPath(location.pathname);

  const prevRelPath = useRef<string | null>(null);
  const direction = useRef<Direction>(null);

  const cssProps = useMemo(
    () => (destroy ? { timeout: duration } : { addEndListener() {} }),
    [destroy, duration]
  );

  const routeList = useMemo(() => {
    return Children.map(children, (child) => {
      if (!child || !isValidElement(child)) {
        return child;
      }
      if ('replace' in child.props && child.props.replace === true) {
        return child;
      }
      const { element, ...restProps } = child.props as RouteProps;
      if (!element) {
        return child;
      }
      const newElement = <div className="item">{element}</div>;
      return { ...child, props: { ...restProps, element: newElement } };
    });
  }, [children]);
  
  const routes = useMemo(() => createRoutesFromChildren(routeList), [routeList]);
  const routesElement = useRoutes(routes, location);

  if (prevRelPath.current && prevRelPath.current !== relPath) {
    const prevIndex = findRouteIndex(routes, prevRelPath.current);
    const nextIndex = findRouteIndex(routes, relPath);
    direction.current = sign2direction.get(Math.sign(nextIndex - prevIndex))!;
  }
  prevRelPath.current = relPath;

  return (
    <TransitionGroup
      className={`slide-routes ${animation}`}
      childFactory={(child) =>
        cloneElement(child, { classNames: direction.current })
      }
      css={getCss(duration, timing, direction.current)}
    >
      <CSSTransition key={relPath} {...cssProps}>
        {routesElement}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default SlideRoutes;
