"use client";
import { useContext, useState } from "react";
import type { FormProps, FormItemProps, ModalProps } from "antd"; 
import { Button, Checkbox, Col, Form, Input, Row, Modal } from "antd";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import * as z from "zod";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useAuth } from "@/lib/AuthContex";



export type FieldType = {
    email: string;
    password: string;
}

const { success, error } = Modal;

const showSuccess = (title:string,message:string, func?:ModalProps["onOk"], funcCancel?:ModalProps["onCancel"]) => (
    success({
        title: title,
        icon:<CheckCircleFilled />,
        content: message,
        onOk: func? func :() => { window.location.href = "/product"},
        onCancel: funcCancel? funcCancel : () => { }
    })
)

const showError = (title: string, message: string, func?:ModalProps["onOk"]) => {
    error({
        title: title,
        icon: <CloseCircleFilled />,
        content:message,
        onOk: func? func : () => { }
    })
}



const rulesEmail: FormItemProps<FieldType>["rules"] = [{
    required: true,
    message:"Harap masukkan email!"
}, {
    validator: (_, value) => {
        const emailSchema = z.email("email tidak valid!")
        const result = emailSchema.safeParse(value);
        if (!result.success) {
            const emailError = z.treeifyError(result.error);
            let error = emailError.errors[0]
            if (emailError) return Promise.reject(error);
        };

        return Promise.resolve()        
    }
}]
const rulesPassword: FormItemProps<FieldType>["rules"] = [{
    required: true,
    message:"Harap masukkan Password!"
}, {
    validator: (_, value) => {
        const passwordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka")
        const result = passwordSchema.safeParse(value);
        if (!result.success) {
            const passwordError = z.treeifyError(result.error);
            let error = passwordError.errors[0]
            if (passwordError) return Promise.reject(error);
        };

        return Promise.resolve()        
    }
}]

export default function Login() {
    
    const onFinish: FormProps<FieldType>["onFinish"] = async (value) => {
        try {
            const result = await signInWithEmailAndPassword(auth, value.email, value.password);
            showSuccess("Sukses","Login berhasil selanjutnya anda akan diarahkan ke halaman Product");
        } catch (e) {
            showError("Gagal","Uupss... Sepertinya kamu salah input email/password");
            
        }
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (value) => {
        console.log("failed: " + value);
    };
    return (
            <main style={{ 
                display: "flex",
                height: "100vh",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:"#279fcb"
            }}>
                <Form
                    name="basic"
                    labelCol={{ span:5}}
                    wrapperCol={{ span: 24 }}
                    style={{
                        maxWidth: 900,
                        width: "500px",
                        padding: "20px 20px",
                        borderRadius: "20px",
                        boxShadow:"0px 0px 10px 0px gray",
                        color: "white",
                        backgroundColor:"white"
                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item<FieldType>
                        layout="vertical"
                        label="Email"
                        name="email"
                        rules={rulesEmail}
                        >
                        <Input/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        layout="vertical"
                        label="Password"
                        name="password"
                        rules={rulesPassword}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            >
                            Login
                        </Button>
                    </Form.Item>            
                </Form>
            </main>
    )
    
}