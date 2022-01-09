  import { MiddlewareFn } from "type-graphql";
  import { MyContext } from "../types/MyContext";
  import jwt from 'jsonwebtoken';

  const APP_SECRET = process.env.SESSION_SECRET  || '123456';

  export const isAuth : MiddlewareFn<MyContext> = async ( {context} ,next )=>{
      const authorization =  context.req.headers['authorization'];
      try {
        const token =  authorization?.replace('Bearer ', '');
        const user  =  jwt.verify(token!, APP_SECRET) as any;
        console.log(token);
        console.log(user);
        context.res.locals.userId = user.id;
        return next();   
      } catch (error) {
          console.log(error);
          throw new Error(error.message);
      }
  }