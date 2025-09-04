import { TokenPayload } from "@/types/jwt.types";
import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
