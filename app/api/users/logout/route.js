import { NextResponse } from 'next/server';
export async function POST(request){
    try {
        const response=NextResponse.json({success:true,status:200,message:'Successfully Logout'})
        response.cookies.set("token","",{httpOnly:true,expires:new Date(0)});
        return response;
    } catch (error) {
        console.log("Error in Logout Handler ",error);
        return NextResponse.json(
            {error:"Logout Failed , Internal Server Error"},
            {status:500}
        )
    }
}