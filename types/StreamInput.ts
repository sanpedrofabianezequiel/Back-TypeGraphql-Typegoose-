import { InputType,Field } from "type-graphql";
import {ObjectId} from 'mongodb';
import { Stream } from "entity/Stream.schema";

@InputType()
export class StreamInput implements Partial<Stream> {
    @Field(()=>String,{nullable:true})
    id?:ObjectId;

    @Field(()=>String)
    title: string;

    @Field(()=>String,{nullable:true})
    description?: string | undefined;


    @Field(()=>String)
    url:string;
}