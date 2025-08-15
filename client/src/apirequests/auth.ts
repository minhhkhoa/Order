import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,

  //- goi toi api login cua BE
  severNextLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),

  //- nextClient goi toi nextServer
  clientNextLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),

  //- goi toi api logout cua BE
  severNextLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),

  //- nextClient goi toi nextServer
  clientNextLogout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),

  serverNextRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),

  async clientNextRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
};

export default authApiRequest;

/*
  Luồng login của nó sẽ làm như sau:
    1. NextClient gọi login lên nextServer
    2. NextServer gọi login lên BE
    3. BE trả access_token + refresh_token về cho nextServer và nextServer sẽ lưu thông tin vào cookie và nó tiếp tục trả thông tin về cho nextClient
    4. NextClient lại lưu thông tin đó vào localStorage để sau tiện lấy ra để truyền vào header
*/
