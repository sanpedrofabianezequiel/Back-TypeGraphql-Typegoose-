import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field,ObjectType } from "type-graphql";
import { /*UserModel,*/ User } from './User.schema';
import { Ref } from "types/Ref";


@ObjectType({description:'Stream description'})
export class Stream {
    @Field(()=>String)
    readonly _id : ObjectId | string;

    @Field()
    @Property({required:true})
    title:string;

    @Field()
    @Property({required:true})
    description:string;

    @Field()
    @Property({required:true})
    url:string;

    @Field(()=>User)
    @Property({ref: User,required:true})
    author: Ref<User>;
}

export const StreamModel =  getModelForClass(Stream);