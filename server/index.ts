import './env';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { createSchema } from '../schema';
import createSession from '../session';

const port =  process.env.PORT || 3000;

async function createServer(){
    
    try {
        //1 create mongoose connecton
        await createSession();
        //2 create express server
        const app =  express();

        const corsOptions = {
            origin:true,
            credentials:true
        }
        app.use(cors(corsOptions));

        //use JSON request
        app.use(express.json());

        const schema = await createSchema();
       // console.log(schema);
        //3 create GrapqQL server
        const apolloServer =  new ApolloServer({
            schema:schema,
            context: ({req,res})=>({req,res}),
            introspection:true,
            //enable GraphQL playground
            /*playground : {
                setting:{
                    'request.credentials':'include',
                }
            }*/
        })

        await apolloServer.start();


        apolloServer.applyMiddleware({app, cors:corsOptions})

        //start the server
        app.listen({port}, ()=>{
            console.log(`Server is running at  http://localhost:${port}${apolloServer.graphqlPath}`)
        })
    } catch (error) {
        console.log(error)
    }
}


createServer();