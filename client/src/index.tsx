/* eslint-disable */
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { HelmetProvider } from "react-helmet-async";

const client = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <CookiesProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
