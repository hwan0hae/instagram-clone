import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    containerColor: string;
    textColor: string;
    textLightColor: string;
    menuColor: string;
    red: string;
    containerLine: string;
    borderLine: string;
    blue: {
      darkBlue: string;
      lightBlue: string;
      middleBlue: string;
    };
  }
}
