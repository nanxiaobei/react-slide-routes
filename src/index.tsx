import { css } from '@emotion/react';
import { useMemo, useRef, cloneElement, Children, isValidElement, useContext, createRef, RefObject } from 'react';
import type { ReactElement } from 'react';
import { useLocation, useRoutes, createRoutesFromElements, matchRoutes, UNSAFE_RouteContext } from 'react-router-dom';
import type { RouteObject, RouteProps, NavigateProps } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Direction = 'forward' | 'back' | 'undirected';

const getDirection = (prevIndex: number, nextIndex: number): Direction => {
  switch (Math.sign(nextIndex - prevIndex) as (-1|0|1)) {
    case -1: return 'back';
    case 0: return 'undirected';
    case 1: return 'forward';
  }
}
  
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

type RouteRef = { route: RouteObject, nodeRef: RefObject<HTMLDivElement> }

const findRoute = (routes: RouteRef[], pathname: string) => {
  const matches = matchRoutes(routes.map(({route}) => route), pathname);
  if (matches === null) throw new Error(`Route ${pathname} does not match`);
  const index = routes.findIndex(({route}) => matches.some((match) => route === match.route));
  return { index, nodeRef: routes[index].nodeRef };
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
  const direction = useRef<Direction>('undirected');

  const cssProps = useMemo(
    () => (destroy ? { timeout: duration } : { addEndListener() {} }),
    [destroy, duration]
  );

  const routes: RouteRef[] = useMemo(() => {
    const nodeRefs: RefObject<HTMLDivElement>[] = [];
    const routeElements = Children.map(children, (child) => {
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
      const nodeRef = createRef<HTMLDivElement>();
      nodeRefs.push(nodeRef);
      const newElement = <div className="item" ref={nodeRef}>{element}</div>;
      return { ...child, props: { ...restProps, element: newElement } };
    })!;
    const routeObjects = createRoutesFromElements(routeElements);
    return routeObjects.map((route, i) => ({ route, nodeRef: nodeRefs[i] }));
  }, [children]);

  const routesElement = useRoutes(routes.map(({route}) => route), location);

  const next = findRoute(routes, relPath);
  if (prevRelPath.current && prevRelPath.current !== relPath) {
    const prev = findRoute(routes, prevRelPath.current);
    direction.current = getDirection(prev.index, next.index);
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
      <CSSTransition key={relPath} nodeRef={next.nodeRef} {...cssProps}>
        {routesElement}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default SlideRoutes;
