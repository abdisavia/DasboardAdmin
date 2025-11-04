import axios, { AxiosResponse } from "axios";
import React from "react";
import { Product } from "./dataInterface";
import { CreateProductType } from "@/app/product/page";

export async function GetAllData(type?: string, data?: string, setLoading?:React.Dispatch<React.SetStateAction<boolean>>) {
        
    if (!setLoading) {
        throw new Error("fungsi set useState wajib di masukkan");
    }
    
    let url = "";
    if (type === "search") {
        url = `/api/products?search=${data}`
    } else if (type === "page") {
        if (data !== "") {
            url = `/api/products?page=${data}`
        }
    } else {
        url = `/api/products`
    }

    const product_dat:AxiosResponse = await axios.get(url, {
        headers: {
            "Content-Type":"application/json"
        }
    });

    if (product_dat.status != 200) {
        setLoading(false);
        return;
    }
    return product_dat;
}

export async function createProductData(data: CreateProductType) {
    try {
        if (!data) {
            throw new Error("Data untuk membuat produk baru tidak tersedia");
        }

        let result = await axios.post(`/api/product`, data, {
            headers: {
                "Content-type":"application/json"
            }
        })

        return result;

    } catch (e) {
        
    }
}


export async function updateProductData(data: CreateProductType) {
    try {
        if (!data) {
            throw new Error("Data untuk memperbarui data produk tidak tersedia")
        }

        let result = await axios.put("/api/product", data, {
            headers: {
                "Content-Type":"application/json"
            }
        })

        return result;
        

    } catch (e) {
        console.log(e);
    }
}
