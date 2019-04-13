import axios from 'axios';

import methods from '../methods';


class ApiConnection {
  constructor(options={}){
    const {
      url,
      method=methods.GET,
    } = options;

    this.__url = url;
    this.__method = method;

    this.__cancelMethod = null;
  };

  call = async (data={}) => {
    const requestData = this.request(data);
    const requestHeaders = this.requestHeaders(data);
    this.cancel();

    const source = axios.CancelToken.source();

    const config = {
      url: this.__url,
      method: this.__method,
      cancelToken: source.token,
      headers: requestHeaders,
    };

    this.__cancelMethod = source.cancel;

    if (this.method === methods.GET) {
      config.params = requestData;
    } else {
      config.data = requestData;
    }

    const result = [
      null,
      null,
    ];

    try {
      result[0] = this.response(await axios(config));
    } catch (error) {
      if (!axios.isCancel(error)) {
        result[1] = this.error(error);
      }
    }

    this.__cancelMethod = null;

    return result;
  };

  cancel = () => {
    if(this.__cancelMethod !== null){
      this.__cancelMethod();
      this.__cancelMethod = null;
    }
  };

  request = (data) => {
    return data;
  };

  requestHeaders = (data) => {
    return {};
  };

  response = (response) => {
    return response;
  };

  error = (error) => {
    return error;
  };
}


export default ApiConnection;