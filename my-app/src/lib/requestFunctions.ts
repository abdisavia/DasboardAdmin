import axios, { AxiosResponse } from "axios";
import React from "react";
import { CreateProductType } from "@/components/Modal";
import { useRouter } from "next/router";

export async function GetAllData(token:string ,type?: string, data?: string, setLoading?:React.Dispatch<React.SetStateAction<boolean>>) {
    try {
        
        if (!setLoading) {
            throw new Error("fungsi set useState wajib di masukkan");
        }

        console.log("rendered")
    
        if (!token) {
            throw new Error("token tidak tersedia");
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
                "Content-Type": "application/json",
                Authorization: `${token}`
            }
        });
        
        console.log(product_dat);
        if (product_dat.status != 200) {
            setLoading(false);
            return;
        }
        return product_dat;
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.toLowerCase().includes("token tidak tersedia")) {
                // window.location.href = "/login"
                return Promise.reject(e.message);
            }
            return Promise.reject(e);
        }
    }
}

export async function createProductData(token:string,data: CreateProductType) {
    try {
        if (!data) {
            throw new Error("Data untuk membuat produk baru tidak tersedia");
            
        }

        let result = await axios.post(`/api/product`, data, {
            headers: {
                "Content-type": "application/json",
                Authorization:token
            }
        })

        return result;

    } catch (e) {
        
    }
}


export async function updateProductData(token:string,data: CreateProductType) {
    try {
        if (!data) {
            throw new Error("Data untuk memperbarui data produk tidak tersedia")
        }

        let result = await axios.put("/api/product", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization:token
            }
        })

        return result;
        

    } catch (e) {
        console.log(e);
    }
}
