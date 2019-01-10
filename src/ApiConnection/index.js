import axios from 'axios';

import methods from '../methods';


class ApiConnection {
  constructor(options={}){
    const {
      url,
      method=methods.GET,
      isFormData=false,
    } = options;

    this.url = url;
    this.method = method;
    this.isFormData = isFormData;

    this.cancelMethod = null;
  };

  call = async (data={}) => {
    data = this.request(data);
    this.cancel();

    const source = axios.CancelToken.source();

    const config = {
      url: this.url,
      method: this.method,
      cancelToken: source.token,
    };

    this.cancelMethod = source.cancel;

    if(this.isFormData){
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };

      const formData = new FormData();

      Object.entries(data).forEach(([dataKey, dataValue]) => {
        formData.append(dataKey, dataValue);
      });

      data = formData;
    }

    if (this.method === methods.GET) {
      config.params = data;
    } else {
      config.data = data;
    }

    const result = [
      null,
      null,
    ];

    try {
      result[0] = this.response(await axios(config));
    } catch (error) {
      if (!axios.isCancel(error)) {
        result[1] = this.error(error.response);
      }
    }

    this.cancelMethod = null;

    return result;
  };

  cancel = () => {
    if(this.cancelMethod !== null){
      this.cancelMethod();
      this.cancelMethod = null;
    }
  };

  request = (params) => {
    return params;
  };

  response = (response) => {
    return response.data;
  };

  error = (error=null) => {

    if(error === null){
      console.error('DEV: Runtime error');
    }

    return error;
  };
}


export default ApiConnection;