# babel-plugin-react-data-testid

[![Build Status](https://travis-ci.com/akameco/babel-plugin-react-data-testid.svg?branch=master)](https://travis-ci.com/akameco/babel-plugin-react-data-testid)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-BADGE:END -->

> ## Example

#### in

```
const Foo = () =>
  <Bar>
    <div>
  </Bar>
```

#### out

```
const Foo = () =>
  <Bar data-test-id="Foo-Bar">
    <div data-test-id="Foo-Bar-div">
  </Bar>
```

## Useful with styled-components

#### in

```
const Wrapper = styled.div`...`

const Bar = styled.div`...`

const Foo = () =>
  <Wrapper>
    <Bar>
  </Wrapper>
```

#### out

```
const Wrapper = styled.div`...`

const Bar = styled.div`...`

const Foo = () =>
  <Wrapper data-test="Foo-Wrapper">
    <Bar data-test="Foo-Wrapper-Bar">
  </Wrapper>
```

## Install

`yarn add davidgustys/babel-plugin-react-add-data-attribute`

or

`npm install davidgustys/babel-plugin-react-add-data-attribute`

## Usage

in .babelrc

```
"plugins": [
  "davidgustys/babel-plugin-react-add-data-attribute",
  ...
```
