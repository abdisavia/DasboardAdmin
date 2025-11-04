import { NextRequest,NextResponse } from "next/server";
import axios, {AxiosResponse} from "axios";


export async function GET(req: NextRequest) {
    try {
        const body = req.nextUrl.searchParams;
        console.log(body);
        let url="";
        if (body) {
            if (body.has("page")) {
                url=url.concat(`?page=${body.get("page")}`)
            } else if(body.has("search")) {
                url=url.concat(`?search=${body.get("search")}`)
            } 
        }
        
        let res: AxiosResponse = await axios.get(`${process.env.API_URL}/products${url}`, {
            headers: {
                "Content-Type":"application/json"
            }
        });


        return Response.json(res.data);
    } catch (e) {
        console.log(e);
        return Response.json(e);
    }
}