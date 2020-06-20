# react-slide-routes

The easiest way to slide React routes

[![npm](https://img.shields.io/npm/v/react-slide-routes.svg?style=flat-square)](https://www.npmjs.com/package/react-slide-routes)
[![npm](https://img.shields.io/npm/dt/react-slide-routes?style=flat-square)](https://www.npmtrends.com/react-slide-routes)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-slide-routes?style=flat-square)](https://bundlephobia.com/result?p=react-slide-routes)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react?style=flat-square)](https://github.com/facebook/react)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react-router?style=flat-square)](https://github.com/ReactTraining/react-router)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/react-slide-routes?style=flat-square)](https://github.com/nanxiaobei/react-slide-routes/blob/master/LICENSE)

## Fit

`react-router` version `>=4.0.0` & `<6.0.0`

## Start

```shell script
yarn add react-slide-routes
# or
npm install react-slide-routes
```

## Use

```jsx
import SlideRoutes from 'react-slide-routes';
import { BrowserRouter, Route, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  return (
    <BrowserRouter>
      <SlideRoutes location={location}>
        <Route path="/" render={() => <div>Home</div>} />
        <Route path="/about" render={() => <div>About</div>} />
        <Route path="/contact" render={() => <div>Contact</div>} />
      </SlideRoutes>
    </BrowserRouter>
  );
};
```

## Live

[See a live demo here]()

## Props

| Prop     | Type      | Required | Default    | Description                                                                                                 |
| -------- | --------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| location | `object`  | √        | `location` | `location` from `react-router-dom`, required                                                                |
| time     | `number`  |          | `200`      | Time of transition duration in millisecond, when set, css rules is also needed, see below                   |
| destroy  | `boolean` |          | `true`     | If `false`, the passed route dom is still exist, just invisible, and `time` prop will be invalid, see below |

## CSS

```css
/* If set prop `time={500}`, css rest is also need to add */
.slide-routes [class$='-active'] {
  transition: transform 500ms;
}

/* If set prop `destroy={false}`, `time` prop will be invalid, use css to change transition duration */
.slide-routes [class$='-active'] {
  transition: transform 1s;
}

/* All css rules for animation */
.slide-routes {
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
```

## License

[MIT License](https://github.com/nanxiaobei/react-slide-routes/blob/master/LICENSE) © [nanxiaobei](https://mrlee.me/)
