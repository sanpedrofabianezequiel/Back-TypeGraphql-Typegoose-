import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import {ObjectId} from 'mongodb'
import path from 'path';  
import { AuthResolver } from '../resolvers/AuthResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { StreamResolver } from '../resolvers/StreamResolver';
import { TypegooseMiddleware } from "../middleware/typegoose";
import { ObjectIdScalar } from "./object-id.scalar";

//build TypeGraphQL executable Schema
export  async function createSchema (): Promise<GraphQLSchema>{
    const schema = await buildSchema({
        //1.add all typescript resolvers
        
        resolvers: [UserResolver,AuthResolver,StreamResolver],
        emitSchemaFile: path.resolve(__dirname,'schema.gql'),
        //2 use document converting middlerware
        globalMiddlewares: [TypegooseMiddleware],
        //3 use ObjectId scalar mapping
        scalarsMap: [{type:ObjectId,scalar:ObjectIdScalar}],
        validate:false
    });
    return schema
}
export default createSchema;