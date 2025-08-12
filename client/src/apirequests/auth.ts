import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
  //- goi toi api login cua BE
  severNextLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),
  clientNextLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;

/*
  Luồng login của nó sẽ làm như sau:
    1. NextClient gọi login lên nextServer
    2. NextServer gọi login lên BE
    3. BE trả access_token + refresh_token về cho nextServer và nextServer sẽ lưu thông tin vào cookie và nó tiếp tục trả thông tin về cho nextClient
    4. NextClient lại lưu thông tin đó vào localStorage để sau tiện lấy ra để truyền vào header
*/
