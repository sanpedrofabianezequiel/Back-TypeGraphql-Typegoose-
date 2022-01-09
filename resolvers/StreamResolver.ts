import { Resolver,Query,Mutation,FieldResolver,Ctx,Arg,Root,UseMiddleware } from "type-graphql";
import {ObjectId} from 'mongodb';
import { MyContext } from "../types/MyContext";
import { User,UserModel } from "../entity/User.schema";
import { StreamModel,Stream } from "../entity/Stream.schema";
import { ObjectIdScalar } from "../schema/object-id.scalar";
import { StreamInput } from "../types/StreamInput";
import { isAuth } from "../middleware/isAuth";

@Resolver(()=>Stream)
export class StreamResolver {
    @Query(()=>Stream, {nullable:true})
    async getStream(@Arg('streamId',()=>ObjectIdScalar) streamId : ObjectId) {
        //1 find a single stream
        return StreamModel.findById(streamId);
    }

    @Query(()=> [Stream])
    async getStreams(@Ctx() ctx : MyContext){
        //2 Display all streams for the current user
        return StreamModel.find({author: ctx.res.locals.userId});
    }
    
    @Mutation(()=> Stream)
    @UseMiddleware(isAuth)
    async postAddStream(@Arg('input') streamInput : StreamInput, @Ctx() ctx:MyContext):Promise<Stream>{
        //3 create a new User's stream
        const stream =  new StreamModel({
            ...streamInput,
            author: ctx.res.locals.userId,
        } as Stream);
        await stream.save();
        return stream;
    }

    @Mutation(()=>Stream)
    @UseMiddleware(isAuth)
    async putEditStream(@Arg('input') streamInput : StreamInput, @Ctx() ctx: MyContext) : Promise<Stream>{
        const {id,title,description,url} = streamInput;
        const stream = await StreamModel.findOneAndUpdate(
            {_id:id, author:ctx.res.locals.userId},
            {title,description,url},
            {runValidators:true, new:true}
        );
        if(!stream){
            throw new Error('Stream not found');
        }
        return stream;
    }

    @Mutation(()=> Boolean)
    @UseMiddleware(isAuth)
    async deleteStream(@Arg('streamId') streamId :string ,@Ctx() ctx: MyContext ):Promise<Boolean | undefined >{
        console.log(streamId);
        console.log(ctx.res.locals.userId);
        const deleted =  await StreamModel.findByIdAndDelete({
            _id:streamId,
            author:{_id:ctx.res.locals.userId},
        });

        if(!deleted){
            throw new Error('Stream not found');
        }
        return true;
    }

    @FieldResolver()
    async author(@Root() stream: Stream) :Promise<User | null >{
        return await UserModel.findById(stream.author);
    }

}