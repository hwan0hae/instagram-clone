import { Helmet } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import Router from "./pages/Router";
import { darkTheme, lightTheme } from "./theme";
import { isDarkAtom } from "./utills/atoms";
import { ScrollToTop } from "./utills/utill";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: -apple-system,'system-ui',"SegoeUI", Roboto, Arial, Helvetica, sans-serif;
  line-height: 18px;  
  font-size: 14px;
  background-color: ${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor}
}
a {
  text-decoration:none;
  color:inherit;
}
div {
  text-decoration: none solid rgb(38,38,38);
}
span{
  /* color:${(props) => props.theme.textColor} */
}
input{
  :focus {outline:0.5px solid ${(props) => props.theme.textColor}}
}
`;

function App() {
  const isDarkMode = useRecoilValue(isDarkAtom);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Helmet>
        <title>Instagram</title>
        <meta
          name="description"
          content="Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family."
        />
        {/* meta태그 SEO 검색엔진 */}
      </Helmet>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* <ScrollToTop /> */}
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
