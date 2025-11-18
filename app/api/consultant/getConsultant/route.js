import Consultant from '@/models/consultantModel';
import databaseConnection from '@/lib/dbConfig';
import { NextResponse } from 'next/server';
import Availability from '@/models/availabilityModel'
export async function GET(request){
    try {
        databaseConnection();
        const id = request.headers.get('x-user-id')
        if(!id){
            return NextResponse.json(
                {error:"Id is required"},
                {status:400}
            )
        }
        const consultant = await Consultant.findOne({consultantId:id}).populate({path:"availability"}).exec()
        if(!consultant){
            return NextResponse.json({message:"Consultant not existed"},{success:204});
        }
        return NextResponse.json(
            {message:"Consultant Fetched Successfully",consultant,success:true},
            {status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error:"Error in getting Consultant , Internal Server Error"},
            {status:500}
        )
    }
}