import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import LanternChoice from "../../components/irumiWrite/lanternColorChoice";
import axios from "axios";
import BackBtn from "../../components/common/backBtn/BackBtn";
import { API } from "../../api/axios";
import MyDetail from "../fortune/MyDetail";

function IrumiWrite() {
  const [selectedColor, setSelectedColor] = useState("1");
  const [userWish, setUserWish] = useState("");
  const [userWishContent, setUserWishContent] = useState(""); // 사용자의 소원을 저장할 상태 변수
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [dataToShare, setDataToShare] = useState([]);

  // 뒤로 가기 버튼 클릭 핸들러

  // 사용자가 입력한 닉네임 관련 함수
  const handleUserWishChange = event => {
    const content = event.target.value;
    // 공백 제거
    const trimmedContent = content.replace(/\s/g, "");
    if (trimmedContent.length <= 10) {
      setUserWish(trimmedContent);
      // 상태 변수 업데이트
      // setFormData({ ...formData, nickname: trimmedContent });
    }
  };

  //사용자가 입력한 소원 내용 관련 함수
  const handleUserWishContent = event => {
    const content = event.target.value;
    // 글자수가 100자를 초과하지 않도록 제한
    if (content.length <= 100) {
      setUserWishContent(content);
      // 상태 변수 업데이트
      // setFormData({ ...formData, content: content });
    }
  };

  //비밀번호 관련 함수
  const handlePasswordChange = event => {
    const inputValue = event.target.value;
    if (/^[0-9]*$/.test(inputValue)) {
      setPassword(inputValue);
      // setFormData({ ...formData, password: inputValue });
    }
  };

  // 비밀번호 보여주기 토글 함수
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 색상 선택 핸들러
  const handleColorChange = color => {
    setSelectedColor(color); // 선택한 숫자로 업데이트
    // setFormData({ ...formData, lanternColor: color }); // 숫자로 업데이트
  };

  // 제출 버튼 클릭 핸들러
  const handleSubmit = async () => {
    // 모든 필수 입력 필드가 채워져 있는지 확인
    if (
      userWish.trim() === "" ||
      userWishContent.trim() === "" ||
      password.trim() === ""
    ) {
      // 필수 입력 필드 중 하나라도 비어 있다면 알림을 표시하고 제출하지 않음
      alert("모든 부분을 입력해주세요 :)");
      return;
    }

    // 비밀번호가 4자리가 아닌 경우 제출을 중지하고 경고 메시지를 표시
    if (password.length !== 4) {
      alert("비밀번호를 4자리로 입력해주세요!");
      return;
    }

    // 콘솔에 데이터 출력
    console.log("보내는 데이터:", {
      nickname: userWish,
      content: userWishContent,
      password: password,
      lanternColor: selectedColor
    });

    //쿠키로 정보 받아오는 뭐 그런 지피티 코드인데 쓰레기같음
    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    const csrfToken = getCookie("csrftoken");

    try {
      const response = await API.post(
        "/api/lanterns",
        {
          nickname: userWish,
          content: userWishContent,
          lanternColor: selectedColor,
          password: password,
          light_bool: false
        },
        {
          //여기도 쿠키헤던데 무용지물인듯
          headers: {
            "X-CSRFToken": csrfToken
          }
        }
      );
      // 서버 응답 처리
      if (response.status === 200) {
        // 성공적으로 제출되면 포춘 페이지로 이동
        // window.location.href = "/fortune";
        window.location.href = `/fortune/${response.data.id}`;
        // console.log(response.data.id);
        console.log("됐닥");
      } else {
        // window.location.href = "/fortune";
        window.location.href = `/fortune/${response.data.id}`;
        console.log(response.data.id);
        console.log("됐닥");
      }
    } catch (error) {
      // 오류 처리
      console.log("안됐단다", error);

      if (error.response) {
        // 서버에서 응답이 왔지만 오류 응답인 경우
        console.log("오류 응답 데이터:", error);
      } else if (error.request) {
        // 서버로 요청을 보냈지만 응답을 받지 못한 경우
        console.log("요청이 응답을 받지 못했습니다.");
      } else {
        // 요청을 보내기 전에 발생한 오류
        console.error("오류 메시지:", error.message);
      }
    }
  };

  return (
    <S.IrumiWriteWrapper>
      {/* <S.BackBtnBox onClick={handleBackClick}>
        <BackBtn />
      </S.BackBtnBox> */}
      <S.Header>
        <BackBtn />
        <LanternChoice
          selectedColor={selectedColor}
          setSelectedColor={handleColorChange} // 컬러 선택 핸들러 전달
          value={selectedColor}
        />
      </S.Header>

      <S.wishContent>
        <S.wishBgImg img src={`/write_${selectedColor}.svg`} />

        <S.Textarea>
          <S.TextareaName>닉네임</S.TextareaName>

          <S.NameInput
            value={userWish}
            onChange={handleUserWishChange}
            placeholder="최대 10자, 공백은 사용불가합니다."
          />
          <S.TextareaContent>소원 내용</S.TextareaContent>
          <S.ContentInput
            value={userWishContent}
            onChange={handleUserWishContent}
            placeholder="100자 이내로 작성해주세요."
          />
          <S.WritePw>
            <S.WritePwLetter>비밀번호</S.WritePwLetter>
            <S.PasswordInput
              placeholder="숫자 4자리"
              minLength={4}
              maxLength={4}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              required
              inputMode="numeric"
            />
            <S.ShowPasswordIcon onClick={toggleShowPassword}>
              <img
                src={showPassword ? "/write_pw_open.png" : "/write_pw_un.png"}
                alt={showPassword ? "보임" : "숨김"}
              />
            </S.ShowPasswordIcon>
          </S.WritePw>
        </S.Textarea>
        <S.SubmitBtn onClick={handleSubmit}>연등 달기</S.SubmitBtn>
      </S.wishContent>
    </S.IrumiWriteWrapper>
  );
}

export default IrumiWrite;
