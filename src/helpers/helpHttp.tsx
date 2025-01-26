const helpHttp = () => {

  const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {

    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const controller = new AbortController();
    options.signal = controller.signal;
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    if (!options.body) delete options.body;
    else options.body = JSON.stringify(options.body);

    setTimeout(() => controller.abort(), 5000); // 5sec

    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return res.json() as Promise<T>;
      } else {
        return Promise.reject({
          err: true,
          status: res.status || "00",
          statusText: res.statusText || "Ocurrió un error en la petición",
        });
      }
    } catch (err) {
      return err
    }
  };

  const get = <T>(url: string, options: RequestInit = {}): Promise<T> => customFetch(url, options);

  const post = <T>(url: string, options: RequestInit = {}): Promise<T> => {
    options.method = "POST";
    return customFetch(url, options);
  };

  const put = <T>(url: string, options: RequestInit = {}): Promise<T> => {
    options.method = "PUT";
    return customFetch(url, options);
  };

  const del = <T>(url: string, options: RequestInit = {}): Promise<T> => {
    options.method = "DELETE";
    return customFetch(url, options);
  };

  return {
    get,
    post,
    put,
    del
  };
};

export {helpHttp};