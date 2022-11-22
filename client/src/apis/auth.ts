import type { SuccessResponse } from '@@types/apis/response';

import { API_URL } from '@constants/url';
import axios from 'axios';

export interface SignUpRequest {
  id: string;
  nickname: string;
  password: string;
}

export interface SignUpResult {
  message: string;
}

type SignUp = (fields: SignUpRequest) => Promise<SuccessResponse<SignUpResult>>;

export const signUp: SignUp = ({ id, nickname, password }) => {
  const endPoint = `${API_URL}/api/user/auth/signup`;

  return axios
    .post(endPoint, { id, nickname, password })
    .then((response) => response.data);
};

export interface SignInRequest {
  id: string;
  password: string;
}

export interface SignInResult {
  _id: string;
  accessToken: string;
}

type SignIn = (fields: SignInRequest) => Promise<SuccessResponse<SignInResult>>;

export const signIn: SignIn = ({ id, password }) => {
  const endPoint = `${API_URL}/api/user/auth/signin`;

  return axios
    .post(endPoint, { id, password })
    .then((response) => response.data);
};
// 액세스 토큰으로 다시 유저 정보 요청해야함
// _id, id(이메일), nickname, status, profileUrl, description

// TODO: 유저 api로 분리하기
export const getMyInfo = () =>
  axios.get(`${API_URL}/api/user/auth/me`).then((res) => res.data);

export interface ReissueTokenResult {
  accessToken: string;
}

type ReissueToken = () => Promise<SuccessResponse<ReissueTokenResult>>;

export const reissueToken: ReissueToken = () => {
  const endPoint = `${API_URL}/api/user/auth/refresh`;

  return axios
    .post(endPoint, {}, { withCredentials: true })
    .then((response) => {
      return response.data;
    });
};
