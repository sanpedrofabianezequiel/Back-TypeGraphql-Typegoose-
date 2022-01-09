import { prop as Property, getModelForClass} from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field,ObjectType } from "type-graphql";

@ObjectType({description:'UserDescription'})
export class User {
    @Field(()=>String)
    readonly _id:ObjectId | string;

    @Field()
    @Property({required:true})
    email:string;

    @Property({required:true})
    password:string;
}

export const UserModel =  getModelForClass(User);