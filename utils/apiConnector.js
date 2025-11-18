import axios from 'axios'

export const axiosInstance = axios.create({});

export const apiConnector = (method,url,body,headers) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: body ? body:null,
        headers: headers ? headers:{"Content-Type":"application/json"}
    });
}