# react-slide-routes 🏄‍♂️

The easiest way to slide React routes

[![npm](https://img.shields.io/npm/v/react-slide-routes.svg?style=flat-square)](https://www.npmjs.com/package/react-slide-routes)
[![npm](https://img.shields.io/npm/dt/react-slide-routes?style=flat-square)](https://www.npmtrends.com/react-slide-routes)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-slide-routes?style=flat-square)](https://bundlephobia.com/result?p=react-slide-routes)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react?style=flat-square)](https://github.com/facebook/react)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react-router?style=flat-square)](https://github.com/ReactTraining/react-router)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/react-slide-routes?style=flat-square)](https://github.com/nanxiaobei/react-slide-routes/blob/master/LICENSE)

## Fit

`react-router` version >=4.0.0 and <6.0.0

## Add

```shell script
yarn add react-slide-routes

# or

npm install react-slide-routes
```

## Use

```jsx
import SlideRoutes from 'react-slide-routes';
import { Route, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  return (
    <SlideRoutes location={location}>
      <Route path="/" component={Home} exact />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </SlideRoutes>
  );
};
```

## Live

[Play a live demo here → 🤳](https://codesandbox.io/s/react-slide-routes-bnzlu)

![live](live.gif)

## API

| Prop        | Type      | Required | Default    | Description                                                                                           |
| ----------- | --------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `location`  | `object`  | yes      | `location` | `location` from `react-router-dom`, required                                                          |
| `animation` | `string`  |          | `'slide'`  | Animation effect type, `'slide'` or `'rotate'`                                                        |
| `pathList`  | `array`   |          |            | Pre-defined `location.pathname` list, useful when with a incoming url, you want to "back" to some url |
| `duration`  | `number`  |          | `200`      | `transition-duration` in `ms`                                                                         |
| `timing`    | `string`  |          | `'ease'`   | `transition-timing-function`, one of `'ease'` `'ease-in'` `'ease-out'` `'ease-in-out'` `'linear'`     |
| `destroy`   | `boolean` |          | `true`     | If `false`, the passed page will still exits in dom, only invisible                                   |

## FAQ

### How `animation` prop works?

Default is `'slide'` type, there is another `'rotate'` type. You can just try the amazing rotating animation effect by passing `animation="rotate"`.

### How `pathList` prop works?

By default, the incoming URL is the earliest URL, and the subsequent pushed URL is "forward".

For example, if `'/b'` is the initial entry URL, then push `'/a'`, and `'/a'` will be "forward".

However, if URLs has an order, when push `'/a'`, expected to "back" to `'/a'`, not "forward", then you can pass `pathList={['/a', '/b']}`

## License

[MIT License](https://github.com/nanxiaobei/react-slide-routes/blob/master/LICENSE) © [nanxiaobei](https://mrlee.me/)
