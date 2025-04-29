<div align="center">
<p><a href="https://kee.so/" target="_blank"><img src="https://i.imgur.com/x5SRUoo.png" alt="kee.so" /></a></p>

Create now ➫ [🔗 kee.so](https://kee.so/)

</div>

---

# react-slide-routes 🏄‍♂️

The easiest way to slide React routes

[![npm](https://img.shields.io/npm/v/react-slide-routes.svg?style=flat-square)](https://www.npmjs.com/package/react-slide-routes)
[![npm](https://img.shields.io/npm/dt/react-slide-routes?style=flat-square)](https://www.npmtrends.com/react-slide-routes)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-slide-routes?style=flat-square)](https://bundlephobia.com/result?p=react-slide-routes)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react?style=flat-square)](https://github.com/facebook/react)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react-router?style=flat-square)](https://github.com/remix-run/react-router/tree/main/packages/react-router)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/react-slide-routes?style=flat-square)](https://github.com/nanxiaobei/react-slide-routes/blob/main/LICENSE)

---

<img src="live.gif" alt="live" height="320" />

## Fit

React Router v6

> For React Router v5, please use [`react-slide-routes@1.1.0`](https://github.com/nanxiaobei/react-slide-routes/blob/367ff0dfa94c9ff3234fc55493c27e3a53996ccd/README.md) and note that the usage is different.

## Add

```shell script
pnpm add react-slide-routes
# or
yarn add react-slide-routes
# or
npm i react-slide-routes
```

## Use

```jsx
import { Route } from 'react-router-dom';
import SlideRoutes from 'react-slide-routes';

const App = () => (
  <SlideRoutes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </SlideRoutes>
);
```

[![Edit react-slide-routes](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-slide-routes-bnzlu?fontsize=14&hidenavigation=1&theme=dark)

## API

| Prop        | Type       | Required | Default   | Description                                                                                                                                                                                                                       |
| ----------- | ---------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animation` | `string`   |          | `'slide'` | Animation effect type, `'slide'`, `'vertical-slide'`, or `'rotate'`                                                                                                                                                               |
| `duration`  | `number`   |          | `200`     | `transition-duration` in `ms`                                                                                                                                                                                                     |
| `timing`    | `string`   |          | `'ease'`  | `transition-timing-function`, one of `'ease'` `'ease-in'` `'ease-out'` `'ease-in-out'` `'linear'`                                                                                                                                 |
| `destroy`   | `boolean`  |          | `true`    | If `false`, prev page will still exits in dom, just invisible                                                                                                                                                                     |
| `compare`   | `function` |          | -         | Function to sort the routes' order (defaults to the definition order). `compare` will be used to `routes.sort((a, b) => compare(a, b))`, `routes` is the param to [`useRoutes`](https://reactrouter.com/en/main/hooks/use-routes) |

## License

[MIT License](https://github.com/nanxiaobei/react-slide-routes/blob/main/LICENSE) © [nanxiaobei](https://lee.so/)
