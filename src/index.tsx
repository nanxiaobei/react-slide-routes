import { css } from '@emotion/react';
import { useMemo, useRef, cloneElement, useContext, RefObject, Children, createRef, isValidElement, ReactNode } from 'react';
import type { ReactElement } from 'react';
import { useLocation, useRoutes, createRoutesFromElements, matchRoutes, UNSAFE_RouteContext, Route, Navigate } from 'react-router-dom';
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

const cssTransitions = (cssFunc: string, max: string) => `
  // back
  & > .back-enter {
    transform: ${cssFunc}(-${max});
  }
  & > .back-enter-active {
    transform: ${cssFunc}(0);
  }
  & > .back-exit {
    transform: ${cssFunc}(0);
  }
  & > .back-exit-active {
    transform: ${cssFunc}(${max});
  }

  // forward
  & > .forward-enter {
    transform: ${cssFunc}(${max});
  }
  & > .forward-enter-active {
    transform: ${cssFunc}(0);
  }
  & > .forward-exit {
    transform: ${cssFunc}(0);
  }
  & > .forward-exit-active {
    transform: ${cssFunc}(-${max});
  }
`;
  
const getCss = (duration: number, timing: string, direction: Direction) => css`
  display: grid;

  & > .item {
    grid-area: 1 / 1 / 2 / 2;

    &:not(:only-child) {
      &.${direction}-enter-active, &.${direction}-exit-active {
        transition: transform ${duration}ms ${timing};
      }
    }
  }

  &.slide {
    overflow: hidden;
    ${cssTransitions('translateX', '100%')}
  }

  &.vertical-slide {
    overflow: hidden;
    ${cssTransitions('translateY', '100%')}
  }

  &.rotate {
    perspective: 2000px;
    & > .item {
      backface-visibility: hidden;
    }
    ${cssTransitions('rotateY', '180deg')}
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

type RouteElement = ReactElement<RouteProps, typeof Route>;
type NavigateElement = ReactElement<NavigateProps, typeof Navigate>;
type ChildElement = RouteElement | NavigateElement;
const isRouteElement = (e: ReactNode): e is RouteElement => isValidElement(e) && e.type === Route;

export type SlideRoutesProps = {
  animation?: 'slide' | 'vertical-slide' | 'rotate';
  compare?(a: RouteObject, b: RouteObject): -1|0|1;
  duration?: number;
  timing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  destroy?: boolean;
  children: ChildElement | (ChildElement | undefined | null)[];
};

const SlideRoutes = (props: SlideRoutesProps) => {
  const {
    animation = 'slide',
    compare = null,
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

  const nodeRefs: RefObject<HTMLDivElement>[] = [];
  const routeElements = Children.map(children, (child) => {
    if (!isRouteElement(child)) {
      return child;
    }
    const { element, ...restProps } = child.props;
    if (!element) {
      return child;
    }
    const nodeRef = createRef<HTMLDivElement>();
    nodeRefs.push(nodeRef);
    const newElement = <div className="item" ref={nodeRef}>{element}</div>;
    return { ...child, props: { ...restProps, element: newElement } };
  })!;
  const routeObjects = createRoutesFromElements(routeElements);
  const routesElement = useRoutes(routeObjects, location);

  const routes = routeObjects.map<RouteRef>((route, i) => ({ route, nodeRef: nodeRefs[i] }));
  if (compare) {
    routes.sort((a, b) => compare(a.route, b.route));
  }

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
