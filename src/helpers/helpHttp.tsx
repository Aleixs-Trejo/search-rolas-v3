export function helpHttp() {
  interface RequestOptions<TBody = unknown> {
    method?: string;
    headers?: Record<string, string>;
    body?: TBody;
    signal?: AbortSignal;
  }

  interface CustomError {
    err: boolean;
    status: string | number;
    statusText: string;
  }

  function customFetch<TResponse, TBody = unknown>(
    endpoint: string,
    options: RequestOptions<TBody>
  ): Promise<TResponse | CustomError> {
    const defaultHeaders: Record<string, string> = {
      accept: "application/json",
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || "GET";

    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body) as unknown as TBody;
    }

    setTimeout(() => {
      controller.abort();
    }, 10000); // 10 seconds

    return fetch(endpoint, options as RequestInit)
      .then((res) =>
        res.ok
          ? (res.json() as Promise<TResponse>)
          : Promise.reject({
              err: true,
              status: res.status || "00",
              statusText: res.statusText || "Ocurrió un error en la petición",
            })
      )
      .catch((err) => err);
  }

  function get<TResponse>(
    url: string,
    options: RequestOptions = {}
  ): Promise<TResponse | CustomError> {
    return customFetch<TResponse>(url, options);
  }

  function post<TResponse, TBody = unknown>(
    url: string,
    options: RequestOptions<TBody> = {}
  ): Promise<TResponse | CustomError> {
    options.method = "POST";
    return customFetch<TResponse, TBody>(url, options);
  }

  function put<TResponse, TBody = unknown>(
    url: string,
    options: RequestOptions<TBody> = {}
  ): Promise<TResponse | CustomError> {
    options.method = "PUT";
    return customFetch<TResponse, TBody>(url, options);
  }

  function del<TResponse, TBody = unknown>(
    url: string,
    options: RequestOptions<TBody> = {}
  ): Promise<TResponse | CustomError> {
    options.method = "DELETE";
    return customFetch<TResponse, TBody>(url, options);
  }

  return {
    get,
    post,
    put,
    del,
  };
}