import { UserModel } from "../entity/User.schema";
import { Arg, Mutation, Resolver } from "type-graphql";
import { AuthInput } from "../types/AuthInput";
import { UserResponse } from "../types/UserResponse";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
   

   @Resolver()
   export class AuthResolver {
       @Mutation(()=>UserResponse)
       async postRegister(@Arg('input') {email,password}:AuthInput):Promise <UserResponse>{
           //1- Chec for an existing email
           const existingUser =  await UserModel.findOne({email});

           if(existingUser){
               throw new Error('Email already in use');
           }

           //2- Create a new user with a hash password
           const hashedPassword = await bcrypt.hashSync(password,10);
           const user =  new UserModel({email,password:hashedPassword});
           await user.save();

           //3 store user id on the token payload

           const payload = {
               id: user.id,
           }

           const token = jwt.sign(payload,process.env.SESSION_SECRET  || '123456',{expiresIn: '4h'});
           
           return {user,token};
       }


       @Mutation(()=>UserResponse)
       async postLogin(@Arg('input') {email,password}:AuthInput):Promise <UserResponse>{
           //1- Chec for an existing email
           const existingUser =  await UserModel.findOne({email});

           if(!existingUser){
               throw new Error('Email not found');
           }

           //2- check if password is valid 
           const valid = await bcrypt.compareSync(password, existingUser!.password);
           if(!valid){
               throw new Error('Invalid login');
           }

           //3 store user id on token payload

           const payload = {
               id: existingUser!.id,
           }

           const token = jwt.sign(payload,process.env.SESSION_SECRET  || '123456');
           
           return {user:existingUser!,token};
       }
   }