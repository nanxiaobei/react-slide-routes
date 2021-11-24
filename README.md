# react-slide-routes 🏄‍♂️

The easiest way to slide React routes

[![npm](https://img.shields.io/npm/v/react-slide-routes.svg?style=flat-square)](https://www.npmjs.com/package/react-slide-routes)
[![npm](https://img.shields.io/npm/dt/react-slide-routes?style=flat-square)](https://www.npmtrends.com/react-slide-routes)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-slide-routes?style=flat-square)](https://bundlephobia.com/result?p=react-slide-routes)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react?style=flat-square)](https://github.com/facebook/react)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/react-slide-routes/peer/react-router?style=flat-square)](https://github.com/remix-run/react-router)
[![GitHub](https://img.shields.io/github/license/nanxiaobei/react-slide-routes?style=flat-square)](https://github.com/nanxiaobei/react-slide-routes/blob/main/LICENSE)

## Fit

React Router v6

> For React Router v5, please use `react-slide-routes@1.1.0`

## Add

```shell script
yarn add react-slide-routes

# or

npm i react-slide-routes
```

## Use

```jsx
import SlideRoutes from 'react-slide-routes';
import { Route } from 'react-router-dom';

const App = () => (
  <SlideRoutes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </SlideRoutes>
);
```

## Live

[Play a live demo here → 🤳](https://codesandbox.io/s/react-slide-routes-bnzlu)

![live](live.gif)

## API

| Prop        | Type      | Required | Default   | Description                                                                                              |
| ----------- | --------- | -------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `animation` | `string`  |          | `'slide'` | Animation effect type, `'slide'`, `'vertical-slide'`, or `'rotate'`                                      |
| `pathList`  | `array`   |          | `[]`      | Pre-defined `pathname` list, useful when enter a url, you want to "back" to some url (default "forward") |
| `duration`  | `number`  |          | `200`     | `transition-duration` in `ms`                                                                            |
| `timing`    | `string`  |          | `'ease'`  | `transition-timing-function`, one of `'ease'` `'ease-in'` `'ease-out'` `'ease-in-out'` `'linear'`        |
| `destroy`   | `boolean` |          | `true`    | If `false`, prev page will still exits in dom, just invisible                                            |

## License

[MIT License](https://github.com/nanxiaobei/react-slide-routes/blob/main/LICENSE) © [nanxiaobei](https://lee.so/)

## Pitiless Ads

If you use WeChat, please try "**FUTAKE**". It's a WeChat mini app for your inspiration moments. 🌈

![FUTAKE](https://s3.jpg.cm/2021/04/22/TDQuS.png)
