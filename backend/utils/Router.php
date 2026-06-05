<?php

declare(strict_types=1);

namespace Backend\Utils;

final class Router
{
    private array $routes = [];

    public function get(string $path, $handler, array $middleware = []): void
    {
        $this->add('GET', $path, $handler, $middleware);
    }

    public function post(string $path, $handler, array $middleware = []): void
    {
        $this->add('POST', $path, $handler, $middleware);
    }

    public function put(string $path, $handler, array $middleware = []): void
    {
        $this->add('PUT', $path, $handler, $middleware);
    }

    public function patch(string $path, $handler, array $middleware = []): void
    {
        $this->add('PATCH', $path, $handler, $middleware);
    }

    public function delete(string $path, $handler, array $middleware = []): void
    {
        $this->add('DELETE', $path, $handler, $middleware);
    }

    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);
        $uri = '/' . ltrim((string) $uri, '/');
        if ($uri !== '/') {
            $uri = rtrim($uri, '/');
        }

        foreach ($this->routes[$method] ?? [] as $route) {
            $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . rtrim($pattern, '/') . '/?$#';

            if (!preg_match($pattern, $uri, $matches)) {
                continue;
            }

            $params = array_filter($matches, static fn ($k) => is_string($k), ARRAY_FILTER_USE_KEY);

            foreach ($route['middleware'] as $mw) {
                $mw($method, $uri, $params);
            }

            $handler = $route['handler'];
            if (is_array($handler) && count($handler) === 2 && is_string($handler[0])) {
                $controller = new $handler[0]();
                $methodName = $handler[1];
                $controller->$methodName($params);
                return;
            }

            $handler($params);
            return;
        }

        Response::error('Endpoint not found', 404);
    }

    private function add(string $method, string $path, $handler, array $middleware): void
    {
        $this->routes[$method][] = [
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware,
        ];
    }
}
