import { NextRequest,NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import { redirect, RedirectType } from "next/navigation";


export async function GET(req: NextRequest) {
    try {
        const body = req.nextUrl.searchParams;
        console.log(body);
        let url = "";
        let token = req.headers.get("Authorization");
        if (!token) {
            throw new Error("Unauthorize");
        }
        if (body) {
            if (body.has("page")) {
                url=url.concat(`?page=${body.get("page")}`)
            } else if(body.has("search")) {
                url=url.concat(`?search=${body.get("search")}`)
            } 
        }
        
        let res: AxiosResponse = await axios.get(`${process.env.API_URL}/products${url}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        });

        if (!res.data.is_success) {
            throw new Error(res.data.data);
        }

        return Response.json(res.data);
    } catch (e) {
        console.log(e);
        if (e instanceof Error) {
            if (e.message.toLowerCase().includes("invalid token")) {
                // redirect("/login",RedirectType.replace);
                return Response.json(e.message);
            }
        }
        return Response.json(e);
    }
}