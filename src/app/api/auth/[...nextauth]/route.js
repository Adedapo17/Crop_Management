import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';


const secret = process.env.SECRET;


const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_ID,
            clientSecret:process.env.GOOGLE_SECRET
        }),secret
    ],
     secret: process.env.NEXTAUTH_SECRET,
})

export {handler as GET, handler as POST}
