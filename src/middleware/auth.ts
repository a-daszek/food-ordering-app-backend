import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  //we want to add custom properties to the express request
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get the access token from the authorization header that's in the request
  const { authorization } = req.headers; //destructuring the authorization field from the headers inside the body of our parse function
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  //get the token from the authorization string
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.sendStatus(401);
    }
    //appending information about the user who is trying to make the request to the actual request object itself because
    //this | request object will get passed on to the handler that is in myusercontroller.ts file, which is called updatecurrentuser,
    //     v
    //so by adding these things to the request it makes it easier to manage the business logic
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next(); //we finished the middleware, do your thing next ;)
  } catch (error) {
    return res.sendStatus(401);
  }
};
