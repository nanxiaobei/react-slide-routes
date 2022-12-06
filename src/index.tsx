import {
  Children,
  cloneElement,
  createRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import {
  createRoutesFromElements,
  matchRoutes,
  Navigate,
  Route,
  UNSAFE_RouteContext,
  useLocation,
  useRoutes,
} from 'react-router-dom';
import type { NavigateProps, RouteObject, RouteProps } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { css } from '@emotion/react';

type Direction = 'forward' | 'back' | 'undirected';
type RouteElement = ReactElement<RouteProps, typeof Route>;
type ChildElement = RouteElement | ReactElement<NavigateProps, typeof Navigate>;
type RouteItem = Required<RouteObject> & {
  element: ReactElement & { ref: RefObject<HTMLDivElement> };
};

const getTransformStyles = (transformFn: string, max: string) => `
  // back
  & > .back-enter {
    transform: ${transformFn}(-${max});
  }
  & > .back-enter-active {
    transform: ${transformFn}(0);
  }
  & > .back-exit {
    transform: ${transformFn}(0);
  }
  & > .back-exit-active {
    transform: ${transformFn}(${max});
  }

  // forward
  & > .forward-enter {
    transform: ${transformFn}(${max});
  }
  & > .forward-enter-active {
    transform: ${transformFn}(0);
  }
  & > .forward-exit {
    transform: ${transformFn}(0);
  }
  & > .forward-exit-active {
    transform: ${transformFn}(-${max});
  }
`;

const getTransitionGroupCss = (
  duration: number,
  timing: string,
  direction: Direction
) => css`
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
    ${getTransformStyles('translateX', '100%')}
  }

  &.vertical-slide {
    overflow: hidden;
    ${getTransformStyles('translateY', '100%')}
  }

  &.rotate {
    perspective: 2000px;
    & > .item {
      backface-visibility: hidden;
    }
    ${getTransformStyles('rotateY', '180deg')}
  }
`;

const isRouteElement = (element: ReactNode): element is RouteElement => {
  return isValidElement(element) && element.type === Route;
};

// from useRoutes:
// https://github.com/remix-run/react-router/blob/f3d3e05ec00c6950720930beaf74fecbaf9dc5b6/packages/react-router/lib/hooks.tsx#L302
const useNextPath = (pathname: string = '') => {
  const { matches: parentMatches } = useContext(UNSAFE_RouteContext);
  const routeMatch = parentMatches[parentMatches.length - 1];
  const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : '/';
  return parentPathnameBase === '/'
    ? pathname
    : pathname.slice(parentPathnameBase.length) || '/';
};

const getMatch = (routes: RouteItem[], pathname: string) => {
  const matches = matchRoutes(routes, pathname);
  if (matches === null) {
    throw new Error(`Route ${pathname} does not match`);
  }

  const index = routes.findIndex((route) => {
    return matches.some((match) => match.route === route);
  });
  return { index, route: routes[index] };
};

export type SlideRoutesProps = {
  animation?: 'slide' | 'vertical-slide' | 'rotate';
  duration?: number;
  timing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  destroy?: boolean;
  children: ChildElement | (ChildElement | undefined | null)[];
  compare?: (a: RouteItem, b: RouteItem) => number;
};

const SlideRoutes = (props: SlideRoutesProps) => {
  const {
    animation = 'slide',
    duration = 200,
    timing = 'ease',
    destroy = true,
    compare,
    children,
  } = props;

  // routes
  const routeElements = Children.map(children, (child) => {
    if (!isRouteElement(child)) {
      return child;
    }

    const { element, ...restProps } = child.props;
    if (!element) {
      return child;
    }

    const nodeRef = createRef<HTMLDivElement>();
    const newElement = (
      <div className="item" ref={nodeRef}>
        {element}
      </div>
    );
    return { ...child, props: { ...restProps, element: newElement } };
  });

  const routes = createRoutesFromElements(routeElements) as RouteItem[];
  if (compare) {
    routes.sort(compare);
  }

  const location = useLocation();
  const routeList = useRoutes(routes, location);

  // direction
  const nextPath = useNextPath(location.pathname);
  const prevPath = useRef<string | null>(null);
  const direction = useRef<Direction>('undirected');

  const nextMatch = getMatch(routes, nextPath);

  if (prevPath.current && prevPath.current !== nextPath) {
    const prevMatch = getMatch(routes, prevPath.current);
    const indexDiff = nextMatch.index - prevMatch.index;

    if (indexDiff > 0) {
      direction.current = 'forward';
    } else if (indexDiff < 0) {
      direction.current = 'back';
    } else if (indexDiff === 0) {
      direction.current = 'undirected';
    }
  }

  prevPath.current = nextPath;

  // props
  const childFactory = useCallback(
    (child: ReactElement<CSSTransitionProps>) =>
      cloneElement(child, { classNames: direction.current }),
    []
  );

  const cssTransitionProps = useMemo(
    () => (destroy ? { timeout: duration } : { addEndListener() {} }),
    [destroy, duration]
  );

  return (
    <TransitionGroup
      className={`slide-routes ${animation}`}
      childFactory={childFactory}
      css={getTransitionGroupCss(duration, timing, direction.current)}
    >
      <CSSTransition
        key={nextMatch.route.path ?? nextMatch.index}
        nodeRef={nextMatch.route.element.ref}
        {...cssTransitionProps}
      >
        {routeList}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default SlideRoutes;
