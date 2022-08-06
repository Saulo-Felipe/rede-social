import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { GetServerSidePropsContext } from "next/types";
import { parseCookies } from "nookies";


const createConnection = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  headers: {
    "Access-Control-Allow-Origin": String(process.env.NEXT_PUBLIC_SERVER_URL),
  }
});

createConnection.interceptors.request.use(config => {
  // const { "app-token": token } = parseCookies();
  // if (token) {
  //   config.headers["app-token"] = token;
  // }
  if (config.data?.logout) {
    if (typeof document !== undefined) {
      alert("Conexão perdida. Faça login novamente");
      window.location.pathname = "/auth/login";      
    }
  }
  return config;
})

export function api(ctx?: GetServerSidePropsContext) { // For server side
  let token;

  if (ctx) {
    const cookies = parseCookies(ctx);
    token = cookies["app-token"];

  } else {
    const cookies = parseCookies();
    token = cookies["app-token"];    
  }

  createConnection.defaults.headers["app-token"] = token || "";

  return createConnection;
}


// const service = new Service(api());

// service.register({
//   onRequest(config: AxiosRequestConfig) {    
//     console.log("sending header: ", config.headers);
//     return config;
//   },
//   onResponse(response: AxiosResponse) {
//     try {
//       let resp = JSON.parse(response.data);
  
//       if (resp?.logout) {
//         console.log("redirecionando")
//         return window.location.pathname = "/auth/login";
//       }
  
//       return response;

//     } catch(e) {
//       alert("Erro no servidor.");
//       console.log(e);
//     }
//   }
// });


