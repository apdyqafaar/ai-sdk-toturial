
import { schema } from "../db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {createAuthMiddleware} from "better-auth/api"
import { normalizeName } from "./utils";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/drizzle";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema:schema
    }),
secret: process.env.AUTH_SECRET!,
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            accessType:"offline",
            prompt:"select_account consent",
        }, 
        
    },
  
    emailAndPassword:{
        enabled:true,
        minPasswordLength:5,
        maxPasswordLength:20,
        autoSignIn:false
    },


    // hooks
    hooks:{
        before:createAuthMiddleware(async(ctx)=>{
            if(ctx.path=="/signup"){

                const name=normalizeName(ctx.body.name as string)
                return {
                    context:{
                    ...ctx,
                    body:{
                        ...ctx.body,
                        name
                    }
                }
            }
            }
        })
    },
    session:{
        expiresIn:60 * 60 * 24 * 7
    },

      plugins: [nextCookies()] ,
});

export type ErrorCode= keyof typeof auth.$ERROR_CODES | "UNKOWN"