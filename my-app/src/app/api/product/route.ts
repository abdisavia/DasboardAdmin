import axios from "axios";
import { DataTable } from "@/app/product/page";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const urlParams = req.nextUrl.searchParams;
        

        if (!urlParams) {
            throw new Error("ID tidak tersedia diurl");
        }
        
        if (!urlParams.has("id")) {
            throw new Error("ID tidak tersedia diurl");
        }
        let srchParams = `?id=${urlParams.get("id")}`

        let result:AxiosResponse = await axios.get(`${process.env.API_URL}/${srchParams}`, {
            headers: {
                "Content-Type":"application/json"
            }
        })

        return NextResponse.json(result);
    } catch (e) {
        console.log(e);
        if (e instanceof Error) {
            return NextResponse.json({
                error:e.message
            },{status:400})
        }
    }

}
export async function POST(req: NextRequest) {
    try {
        const dataBody = await req.json();

        if (!dataBody) {
            throw new Error("Data tidak tersedia");
        }
        
        let result: AxiosResponse = await axios.post(`${process.env.API_URL}/product`, {
            body: {
                product_title: dataBody.product_title,
                product_description: dataBody.product_description,
                product_image: dataBody.product_image,
                product_category: dataBody.product_category,
                product_price: String(dataBody.product_price) 
        }
        }, {
            headers: {
                "Content-Type":"application/json"
            }
        })

        return NextResponse.json(result.data);
        
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({
                error:e.message
            },{status:400})
        }
    }

}
export async function PUT(req: NextRequest) {
    try {
        const dataBody = await req.json();

        console.log(dataBody);
        if (!dataBody) {
            throw new Error("Data tidak tersedia");
        }

        let result: AxiosResponse = await axios.put(`${process.env.API_URL}/product`, {
            product_title: dataBody.product_title,
            product_description: dataBody.product_description,
            product_image: dataBody.product_image,
            product_category: dataBody.product_category,
            product_id:dataBody.product_id,
            product_price: String(dataBody.product_price),
        }, {
            headers: {
                "Content-type":"application/json"
            }
        })
        
        return NextResponse.json(result.data);

    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({
                error:e.message
            }, {status:400})
        }
    }
}
export async function DELETE(req: NextRequest, {}) {
    try {
        


    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({
                error:e.message
            }, {status:400})
        }
    }
}