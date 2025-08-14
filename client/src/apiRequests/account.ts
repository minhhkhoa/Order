import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accoutApiRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
};

export default accoutApiRequest;
