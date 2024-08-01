# Optimization cases for web application

导致用户卡顿的场景

- Timing
  - networking (dns, cache...)
  - scripting
  - rendering (upon both)
- Resources
  - networking (resource size)
  - CPU & memory -> stale

## Networking

- Backend: CDN, DNS (prefetch...), cache, http2/3
- Frontend: Service worker, ssr/ssg, reducing resouces size (code tree shaking, modern image/video format), lazyload
- Design: Loading hint, skeleton

## Rendering

- Offscreen canvas, GPU acceleration(transform)

## Scripting

- Web Worker, web-assembly
