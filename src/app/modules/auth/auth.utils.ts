/* eslint-disable @typescript-eslint/no-explicit-any */
// import jwt from "jsonwebtoken";

// export const createToken = (
//   jwtPayload: { email: string; role: string },
//   secret: string,
//   expiresIn: string,
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };

import jwt, { SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: any,
): string => {
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(jwtPayload, secret, options);
};
