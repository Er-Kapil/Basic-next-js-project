import Video from "@/models/Video";
import { authOptions } from "@/utils/auth";
import { connectTODatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { IVideo } from "@/models/Video";

export async function GET(){
    try {
        await connectTODatabase();
        const videos =await Video.find({}).sort({createdAt:-1}).lean()

        if(!videos || videos.length === 0){
            return NextResponse.json([],{status:200})
        }

        return NextResponse.json(videos,{status:200});
    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Failed to fetch videos"},{status:500})
    }
}

export async function POST(request:NextRequest){
    try {
        const session =  await getServerSession(authOptions)

        if(!session){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            )
        }

        await connectTODatabase();
        const body:IVideo = await request.json()

        if(
            !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error:"Missing required fields"},
                {status:400}
            )
        }

        const videoData = {
            ...body,
            controls:body?.controls??true,
            transformations:{
                height:1920,
                width:1080,
                quality:body.transformations?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData)

        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json({error:"Failed to create video"},{status:500})
    }
}