import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { ILoginUser, loginUser } from "../utills/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PacmanLoader from "react-spinners/PacmanLoader";

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  width: 350px;
  height: 75vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const Box = styled.div`
  background-color: ${(props) => props.theme.containerColor};
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 0;
  border-radius: 1px;
  border: 1px solid ${(props) => props.theme.borderLine};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const SvgLogoText = styled.svg`
  fill: ${(props) => props.theme.textColor};
  width: 175px;
`;

export const SignUpText = styled.span`
  color: ${(props) => props.theme.blue.lightBlue};
  font-weight: 400;
`;
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 16px 0px;
  padding: 0 40px;
`;
export const InputContainer = styled.div`
  border-radius: 3px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderLine};
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  position: relative;
`;
export const LoginInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  height: 30px;
  padding: 0 8px;
  border-radius: 3px;
`;
export const LoginBtn = styled.button<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? props.theme.blue.middleBlue : props.theme.blue.darkBlue};
  color: ${(props) => props.theme.textColor};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
  margin: 15px 0;
  border-radius: 5px;
  font-weight: 500;

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;
export const ErrorText = styled.p`
  color: ${(props) => props.theme.red};
  font-weight: 400;
`;

export const PasswordVisibleBtn = styled.button.attrs({ type: "button" })`
  background-color: transparent;
  border: none;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  position: absolute;
  right: 0;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.textLightColor};
  }
`;

interface IForm {
  email: string;
  password: string;
}
export interface IPasswordType {
  type: string;
  visible: boolean;
}
export default function Login() {
  const formSchema = yup.object({
    email: yup
      .string()
      .required("이메일을 입력해주세요")
      .email("이메일 형식이 아닙니다."),
    password: yup
      .string()
      .required("비밀번호를 입력해주세요")
      .min(8, "최소 8자 이상 가능합니다")
      .max(15, "최대 15자 까지만 가능합니다"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setFocus,
  } = useForm<IForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(formSchema),
  });
  const queryClient = useQueryClient();
  const [loginRequestData, setLoginRequestData] = useState<String>("");
  const [passwordType, setPasswordType] = useState<IPasswordType>({
    type: "password",
    visible: false,
  });
  const loginUserMutation = useMutation(
    (userInfo: ILoginUser) => loginUser(userInfo),
    {
      onSuccess: (data) => {
        if (data.loginSuccess) {
          queryClient.invalidateQueries("LoginSuccess");
          setLoginRequestData("");
        } else {
          setLoginRequestData(data.message);
        }
      },
    }
  );
  useEffect(() => {
    const firstError = (
      Object.keys(errors) as Array<keyof typeof errors>
    ).reduce<keyof typeof errors | null>((field, a) => {
      const fieldKey = field as keyof typeof errors;
      return !!errors[fieldKey] ? field : a;
    }, null);
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);
  const onSubmit = (data: IForm) => {
    const info = {
      email: data.email,
      password: data.password,
    };
    loginUserMutation.mutate(info);
  };

  const handlePasswordType = () => {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: "text", visible: true };
      }
      return { type: "password", visible: false };
    });
  };
  return (
    <Wrapper>
      <Helmet>
        <title>로그인﹒Instagram</title>
        {/* meta태그 SEO 검색엔진 */}
      </Helmet>
      <Container>
        <Box style={{ height: 400 }}>
          <SvgLogoText
            className="logoText"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 34.86"
          >
            <path d="M6.32,0.12C3.81,1.17,1.04,4.15,0.17,7.88c-1.11,4.73,3.5,6.73,3.87,6.07c0.44-0.77-0.83-1.03-1.09-3.49 C2.62,7.3,4.1,3.76,5.95,2.21c0.34-0.29,0.33,0.11,0.33,0.86c0,1.33-0.07,13.26-0.07,15.75c0,3.37-0.14,4.43-0.39,5.49 c-0.25,1.07-0.66,1.79-0.35,2.06c0.34,0.31,1.82-0.43,2.67-1.62c1.02-1.43,1.38-3.14,1.44-5c0.08-2.24,0.07-5.8,0.08-7.83 c0-1.86,0.03-7.31-0.03-10.59C9.61,0.52,7.38-0.32,6.32,0.12L6.32,0.12L6.32,0.12z M95.63,15.89c-0.08,1.75-0.47,3.12-0.95,4.09 c-0.93,1.87-2.87,2.45-3.69-0.24c-0.45-1.46-0.47-3.91-0.15-5.96c0.33-2.08,1.24-3.66,2.76-3.51 C95.1,10.41,95.79,12.33,95.63,15.89L95.63,15.89L95.63,15.89z M70.46,26.76c-0.02,2.91-0.48,5.46-1.46,6.2 c-1.39,1.05-3.27,0.26-2.88-1.86c0.34-1.88,1.97-3.8,4.34-6.14C70.46,24.96,70.47,25.49,70.46,26.76L70.46,26.76L70.46,26.76z M70.08,15.88c-0.08,1.6-0.5,3.2-0.95,4.1c-0.93,1.87-2.88,2.45-3.69-0.24c-0.55-1.84-0.42-4.22-0.15-5.72 c0.35-1.95,1.21-3.75,2.76-3.75C69.55,10.27,70.29,11.92,70.08,15.88L70.08,15.88L70.08,15.88z M55.5,15.85 c-0.09,1.69-0.42,3.1-0.95,4.13c-0.96,1.86-2.85,2.45-3.69-0.24c-0.6-1.93-0.4-4.57-0.15-6c0.37-2.12,1.3-3.61,2.76-3.47 C54.96,10.42,55.69,12.33,55.5,15.85L55.5,15.85L55.5,15.85z M122.32,17.82c-0.37,0-0.53,0.38-0.67,1.01 c-0.48,2.2-0.98,2.7-1.63,2.7c-0.72,0-1.37-1.09-1.54-3.27c-0.13-1.72-0.11-4.87,0.06-8.02c0.03-0.65-0.14-1.28-1.88-1.91 c-0.75-0.27-1.83-0.67-2.37,0.63c-1.52,3.68-2.12,6.6-2.26,7.78c-0.01,0.06-0.08,0.07-0.1-0.07c-0.09-0.95-0.29-2.68-0.31-6.3 c0-0.71-0.15-1.31-0.94-1.8c-0.51-0.32-2.04-0.89-2.6-0.21c-0.48,0.55-1.04,2.03-1.61,3.79c-0.47,1.43-0.8,2.39-0.8,2.39 s0.01-3.85,0.01-5.31c0-0.55-0.38-0.73-0.49-0.77c-0.51-0.15-1.52-0.4-1.95-0.4c-0.53,0-0.66,0.3-0.66,0.73 c0,0.06-0.08,5.07-0.08,8.58c0,0.15,0,0.32,0,0.5c-0.29,1.61-1.24,3.8-2.28,3.8c-1.03,0-1.52-0.92-1.52-5.09 c0-2.44,0.07-3.5,0.11-5.26c0.02-1.02,0.06-1.8,0.06-1.97c-0.01-0.54-0.95-0.82-1.38-0.92c-0.44-0.1-0.82-0.14-1.12-0.12 c-0.42,0.02-0.72,0.3-0.72,0.68c0,0.2,0,0.59,0,0.59c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.47-3.2-0.05-4.43,1.67 c-0.98,1.37-1.57,2.92-1.8,5.15c-0.17,1.63-0.11,3.28,0.19,4.68c-0.36,1.58-1.04,2.22-1.78,2.22c-1.08,0-1.86-1.76-1.77-4.79 c0.06-2,0.46-3.4,0.9-5.43c0.19-0.86,0.03-1.32-0.34-1.75c-0.35-0.4-1.09-0.6-2.16-0.35c-0.76,0.18-1.85,0.37-2.84,0.52 c0,0,0.06-0.24,0.11-0.66c0.26-2.21-2.15-2.03-2.91-1.33c-0.46,0.42-0.77,0.92-0.89,1.81c-0.19,1.42,0.97,2.09,0.97,2.09 c-0.38,1.74-1.31,4.01-2.27,5.65c-0.51,0.88-0.91,1.53-1.42,2.23c0-0.26,0-0.52,0-0.77c-0.01-3.66,0.04-6.53,0.06-7.57 c0.02-1.02,0.06-1.78,0.06-1.95c-0.01-0.4-0.24-0.55-0.72-0.74c-0.43-0.17-0.93-0.28-1.45-0.32C70.5,8.24,70.1,8.59,70.11,9 c0,0.08,0,0.56,0,0.56c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.46-3.2-0.05-4.43,1.67c-0.98,1.37-1.62,3.29-1.8,5.13 c-0.17,1.72-0.14,3.17,0.09,4.4c-0.25,1.23-0.96,2.52-1.77,2.52c-1.03,0-1.62-0.92-1.62-5.09c0-2.44,0.07-3.5,0.11-5.26 c0.02-1.02,0.06-1.8,0.06-1.97c-0.01-0.54-0.95-0.82-1.38-0.92c-0.46-0.11-0.85-0.14-1.15-0.12c-0.4,0.03-0.68,0.39-0.68,0.65v0.62 c-0.54-0.85-1.42-1.45-2-1.62c-1.56-0.46-3.19-0.05-4.43,1.67c-0.81,1.12-1.46,2.36-1.8,5.11c-0.1,0.79-0.14,1.54-0.13,2.23 c-0.32,1.97-1.75,4.25-2.91,4.25c-0.68,0-1.33-1.32-1.33-4.14c0-3.76,0.23-9.1,0.27-9.62c0,0,1.47-0.02,1.76-0.03 c0.73-0.01,1.4,0.01,2.38-0.04c0.49-0.02,0.96-1.79,0.46-2c-0.23-0.1-1.85-0.19-2.5-0.2c-0.54-0.01-2.05-0.12-2.05-0.12 s0.14-3.55,0.17-3.92c0.03-0.31-0.38-0.47-0.61-0.57c-0.56-0.24-1.07-0.35-1.67-0.48c-0.83-0.17-1.2,0-1.27,0.69 c-0.11,1.06-0.17,4.16-0.17,4.16c-0.61,0-2.68-0.12-3.28-0.12c-0.56,0-1.17,2.42-0.39,2.45c0.9,0.03,2.46,0.06,3.49,0.1 c0,0-0.05,5.44-0.05,7.11c0,0.18,0,0.35,0,0.52c-0.57,2.97-2.58,4.57-2.58,4.57c0.43-1.96-0.45-3.44-2.04-4.69 c-0.58-0.46-1.74-1.33-3.03-2.29c0,0,0.75-0.74,1.41-2.22c0.47-1.05,0.49-2.25-0.66-2.52c-1.9-0.44-3.48,0.96-3.94,2.45 c-0.36,1.16-0.17,2.02,0.54,2.91c0.05,0.06,0.11,0.13,0.17,0.2c-0.43,0.83-1.02,1.94-1.52,2.81c-1.39,2.4-2.44,4.3-3.23,4.3 c-0.63,0-0.63-1.93-0.63-3.74c0-1.56,0.11-3.9,0.21-6.32c0.03-0.8-0.37-1.26-1.04-1.67c-0.41-0.25-1.28-0.75-1.78-0.75 c-0.76,0-2.93,0.1-4.99,6.06c-0.26,0.75-0.77,2.12-0.77,2.12l0.04-7.16c0-0.17-0.09-0.33-0.29-0.44c-0.35-0.19-1.27-0.57-2.1-0.57 c-0.39,0-0.59,0.18-0.59,0.55L12.57,19.8c0,0.85,0.02,1.84,0.11,2.28c0.08,0.43,0.22,0.79,0.39,1s0.36,0.37,0.68,0.44 c0.3,0.06,1.93,0.27,2.02-0.35c0.1-0.75,0.11-1.56,0.96-4.58c1.33-4.7,3.08-6.99,3.89-7.8c0.14-0.14,0.31-0.15,0.3,0.08 c-0.04,1.03-0.16,3.6-0.24,5.79c-0.22,5.85,0.84,6.94,2.36,6.94c1.16,0,2.8-1.16,4.56-4.08c1.1-1.82,2.16-3.61,2.93-4.9 c0.53,0.49,1.13,1.02,1.73,1.59c1.39,1.32,1.85,2.57,1.54,3.76c-0.23,0.91-1.1,1.84-2.65,0.93c-0.45-0.27-0.65-0.47-1.1-0.77 c-0.24-0.16-0.62-0.21-0.84-0.04c-0.58,0.44-0.91,1-1.1,1.68c-0.18,0.67,0.49,1.03,1.18,1.34c0.6,0.27,1.89,0.51,2.71,0.54 c3.2,0.11,5.77-1.55,7.56-5.81c0.32,3.68,1.68,5.77,4.05,5.77c1.58,0,3.17-2.04,3.86-4.05c0.2,0.82,0.49,1.53,0.87,2.13 c1.82,2.89,5.36,2.27,7.13-0.19c0.55-0.76,0.63-1.03,0.63-1.03c0.26,2.31,2.12,3.12,3.19,3.12c1.2,0,2.43-0.56,3.29-2.51 c0.1,0.21,0.21,0.41,0.33,0.6c1.82,2.89,5.36,2.26,7.13-0.19c0.08-0.11,0.16-0.22,0.22-0.31l0.05,1.52c0,0-1.01,0.93-1.63,1.5 c-2.74,2.51-4.82,4.42-4.97,6.63c-0.2,2.83,2.1,3.88,3.83,4.02c1.84,0.15,3.42-0.87,4.39-2.3c0.85-1.25,1.41-3.95,1.37-6.62 c-0.02-1.07-0.04-2.42-0.06-3.88c0.96-1.12,2.04-2.53,3.04-4.18c1.09-1.8,2.25-4.22,2.85-6.1c0,0,1.01,0.01,2.09-0.06 c0.35-0.02,0.45,0.05,0.38,0.3c-0.08,0.31-1.36,5.27-0.19,8.58c0.8,2.26,2.62,2.99,3.69,2.99c1.26,0,2.46-0.95,3.11-2.36 c0.08,0.16,0.16,0.31,0.25,0.45c1.82,2.89,5.34,2.26,7.13-0.19c0.4-0.55,0.63-1.03,0.63-1.03c0.38,2.4,2.25,3.14,3.31,3.14 c1.11,0,2.17-0.46,3.02-2.48c0.04,0.89,0.09,1.62,0.18,1.85c0.05,0.14,0.37,0.32,0.6,0.4c1.02,0.38,2.05,0.2,2.44,0.12 c0.27-0.05,0.47-0.27,0.5-0.82c0.07-1.45,0.03-3.88,0.47-5.68c0.74-3.03,1.42-4.21,1.75-4.79c0.18-0.33,0.39-0.38,0.4-0.04 c0.02,0.7,0.05,2.75,0.33,5.5c0.21,2.03,0.49,3.22,0.7,3.6c0.61,1.08,1.37,1.13,1.99,1.13c0.39,0,1.21-0.11,1.14-0.8 c-0.04-0.34,0.03-2.41,0.75-5.4c0.47-1.95,1.26-3.71,1.55-4.35c0.11-0.24,0.15-0.05,0.15-0.01c-0.06,1.34-0.19,5.73,0.35,8.13 c0.74,3.25,2.89,3.62,3.63,3.62c1.59,0,2.9-1.21,3.34-4.41C122.95,18.42,122.79,17.82,122.32,17.82L122.32,17.82L122.32,17.82z M122.32,17.82L122.32,17.82L122.32,17.82L122.32,17.82z" />
          </SvgLogoText>
          <LoginForm onSubmit={handleSubmit(onSubmit)}>
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            <InputContainer>
              <LoginInput
                {...register("email")}
                placeholder="전화번호, 사용자 이름 또는 이메일"
              />
            </InputContainer>
            {errors.password && (
              <ErrorText>{errors.password.message}</ErrorText>
            )}
            <InputContainer>
              <LoginInput
                {...register("password")}
                placeholder="비밀번호"
                type={passwordType.type}
                autoComplete="off"
              />
              <PasswordVisibleBtn onClick={handlePasswordType}>
                {passwordType.visible ? (
                  <span>숨기기</span>
                ) : (
                  <span>비밀번호 표시</span>
                )}
              </PasswordVisibleBtn>
            </InputContainer>
            <LoginBtn disabled={!(isValid && isDirty)}>
              {loginUserMutation.isLoading ? (
                <PacmanLoader color="white" size="5px" />
              ) : (
                "로그인"
              )}
            </LoginBtn>
            {loginUserMutation.isSuccess && (
              <div>
                <ErrorText style={{ textAlign: "center" }}>
                  {loginRequestData}
                </ErrorText>
              </div>
            )}
          </LoginForm>
        </Box>
        <Box style={{ height: 63, flexDirection: "row" }}>
          계정이 없으신가요? &nbsp;
          <Link to="/register">
            <SignUpText>가입하기</SignUpText>
          </Link>
        </Box>
        <Box style={{ backgroundColor: "transparent", border: "none" }}></Box>
      </Container>
    </Wrapper>
  );
}
