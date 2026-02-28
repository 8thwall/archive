---
id: limits-and-quotas
sidebar_position: 4
---

# Limits and Quotas

The following limits and quotas currently apply to back-end functions:

## Route Limits

* Max Routes per module: 32
* Max Routes per project: 64

:::note
Each backend function counts as 1 route attached to the underlying gateway for your app. Each
Proxy route also counts towards this limit.
:::

## Function Timeout

Backend functions are limited to a **maximum execution time of 10 seconds**. If you exceed this limit,
the function will time out with an error.

## Package Support

NPM package installation is currently not supported. At this time you have access to all Node.js
core modules. 