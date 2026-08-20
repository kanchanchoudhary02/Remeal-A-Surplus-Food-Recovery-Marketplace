// utils/generateToken.js
// Ye function ek chhoti si helper hai — kahi bhi JWT token banana ho, isko call karo.

import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  // jwt.sign(payload, secret, options)
  // payload: token ke andar kya store karna hai (yaha sirf user ka ID)
  // secret: ek secret key jo sirf server ko pata hai (isi se token verify hota hai)
  // expiresIn: token kitne time baad automatically invalid ho jayega
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;