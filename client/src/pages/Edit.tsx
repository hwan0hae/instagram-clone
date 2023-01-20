import React from "react";
import styled from "styled-components";
import { Wrapper } from "./Home";

const Container = styled.div`
  margin-top: 30px;
  border: 1px solid ${(props) => props.theme.borderLine};
  border-radius: 3px;
  width: 748px;
  height: 900px;
`;
function Edit() {
  return (
    <Wrapper>
      <Container></Container>
    </Wrapper>
  );
}

export default Edit;
