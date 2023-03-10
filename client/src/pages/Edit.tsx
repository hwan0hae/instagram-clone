import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { onProfileImgClickedAtom, userAtom } from "../utills/atoms";
import { Wrapper } from "./Home";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorText } from "./Login";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Helmet } from "react-helmet-async";
import { IModify, modify } from "../utills/api";
import ImgUpload from "../components/layout/ImgUpload/ImgUpload";

const Container = styled.div`
  margin-top: 30px;
  border: 1px solid ${(props) => props.theme.borderLine};
  border-radius: 3px;
  width: 748px;
  height: 900px;
  background-color: ${(props) => props.theme.containerColor};

  @media screen and (min-width: 1250px) {
    width: calc(100%-244px);
    margin-left: 244px;
  }
`;
const ProfileBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 16px;
`;
const ProfileImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;

  cursor: pointer;
`;
const ProfileText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 3px;
  color: ${(props) => props.theme.textColor};
`;
const ProfileBtn = styled.button`
  font-size: 14px;
  font-weight: 600;
  background-color: transparent;
  color: ${(props) => props.theme.blue.darkBlue};
  border: none;
  padding: 0;
  text-align: start;

  cursor: pointer;
`;

const FormBox = styled.form``;
const SubBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 16px;
`;
const SubTitleBox = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 30%;
  margin-top: 6px;
  padding: 0 32px;
`;
const SubTitle = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;
const ContentBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
`;
const ContentInput = styled.input`
  background-color: transparent;
  border: 1px solid #555555;
  border-radius: 3px;
  height: 32px;
  padding: 0 10px;
  color: ${(props) => props.theme.textColor};
`;
const ContentText = styled.div`
  margin: 8px 0;
  font-size: 0.75rem;
  color: ${(props) => props.theme.textLightColor};
  font-weight: 400;
`;
const TextArea = styled.textarea`
  padding: 6px 10px;
  color: ${(props) => props.theme.textColor};
  border: 1px solid #555555;
  background-color: transparent;
  border-radius: 3px;
  height: 60px;
`;
const FormSubmitBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 32px;
`;
const FormSubmitBtn = styled.button<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? props.theme.blue.middleBlue : props.theme.blue.darkBlue};
  color: ${(props) => props.theme.textColor};
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  border-radius: 8px;

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;

interface IForm {
  name: string;
  id: string;
  introduction: string;
}

function Edit() {
  const user = useRecoilValue(userAtom);

  const formSchema = yup.object({
    name: yup.string().required("이름을 입력해주세요"),
    id: yup
      .string()
      .required("아이디를 입력해주세요")
      .min(5, "최소 5자 이상 가능합니다")
      .max(20, "최대 20자 까지만 가능합니다"),
    introduction: yup.string().max(100, "최대 100자 까지만 가능합니다"),
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
    defaultValues: {
      name: user?.name,
      id: user?.id,
      introduction: user?.introduction,
    },
  });
  const [registerRequestData, setRegisterRequestData] = useState<String>("");
  const setOnProfileImgClicked = useSetRecoilState<boolean>(
    onProfileImgClickedAtom
  );
  const modifyMutation = useMutation(
    (modifyInfo: IModify) => modify(modifyInfo),
    {
      onSuccess: (data) => {
        if (data.success) {
          setRegisterRequestData("");
          alert(data.message);
        } else {
          setRegisterRequestData(data.message);
        }
      },
    }
  );

  const onSubmit = (data: IForm) => {
    const info = {
      name: data.name,
      id: data.id,
      introduction: data.introduction,
    };
    modifyMutation.mutate(info);
  };

  useEffect(() => {
    const firstError = (
      Object.keys(errors) as Array<keyof typeof errors>
    ).reduce<keyof typeof errors | null>((field, a) => {
      const fieldKey = field as keyof typeof errors;
      console.log(`field:${field},a:${a}`);
      return !!errors[fieldKey] ? field : a;
    }, null);
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  return (
    <Wrapper>
      <Helmet>
        <title>프로필 편집﹒Instagram</title>
        {/* meta태그 SEO 검색엔진 */}
      </Helmet>
      <Container>
        <ProfileBox>
          <SubTitleBox>
            <ProfileImg
              src={user?.profileImage}
              onClick={() => setOnProfileImgClicked(true)}
            />
          </SubTitleBox>
          <ContentBox>
            <ProfileText>{user?.id}</ProfileText>
            <ProfileBtn onClick={() => setOnProfileImgClicked(true)}>
              프로필 사진 바꾸기
            </ProfileBtn>
          </ContentBox>
        </ProfileBox>
        <FormBox onSubmit={handleSubmit(onSubmit)}>
          <SubBox>
            <SubTitleBox>
              <SubTitle>이름</SubTitle>
            </SubTitleBox>
            <ContentBox>
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

              <ContentInput {...register("name")} placeholder="성명" />
              <ContentText>
                사람들이 이름, 별명 또는 비즈니스 이름 등 회원님의 알려진 이름을
                사용하여 회원님의 계정을 찾을 수 있도록 도와주세요.
              </ContentText>
              <ContentText>
                이름은 14일 안에 두 번만 변경할 수 있습니다.
              </ContentText>
            </ContentBox>
          </SubBox>
          <SubBox>
            <SubTitleBox>
              <SubTitle>사용자 이름</SubTitle>
            </SubTitleBox>
            <ContentBox>
              {errors.id && <ErrorText>{errors.id.message}</ErrorText>}
              <ContentInput {...register("id")} placeholder="사용자 이름" />
              <ContentText>
                대부분의 경우 이후 14일 동안 사용자 이름을 다시 {user?.id}(으)로
                변경할 수 있습니다.
              </ContentText>
            </ContentBox>
          </SubBox>
          <SubBox>
            <SubTitleBox>
              <SubTitle>소개</SubTitle>
            </SubTitleBox>
            {errors.introduction && (
              <ErrorText>{errors.introduction.message}</ErrorText>
            )}
            <ContentBox>
              <TextArea
                {...register("introduction")}
                placeholder="자기 소개"
                maxLength={100}
              />
            </ContentBox>
          </SubBox>

          {modifyMutation.isSuccess && (
            <div>
              <ErrorText style={{ textAlign: "center" }}>
                {registerRequestData}
              </ErrorText>
            </div>
          )}
          <FormSubmitBox>
            <FormSubmitBtn disabled={!(isValid && isDirty)}>제출</FormSubmitBtn>
          </FormSubmitBox>
        </FormBox>
      </Container>
      <ImgUpload />
    </Wrapper>
  );
}

export default Edit;
