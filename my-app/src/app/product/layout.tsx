"use client";
import { Button, Layout, Menu } from "antd";
import React, { Suspense } from "react";
import { Image, List } from "antd";
import type { GetProp, MenuProps } from "antd";
import { ApiOutlined, HomeOutlined, ProductOutlined } from "@ant-design/icons";
import Loading from "./loading";
import { useAuth } from "@/lib/AuthContex";



const { Sider, Header, Footer, Content } = Layout;

const LayoutStyle = {
    height: "100vh"
}

const SiderStyle = {
    padding: "0px 5px",
    marginLeft: "auto",
    marginRight: "auto",
}

const ContentStyle:React.CSSProperties = {
    padding: "20px",
    overflowY:"auto"
}

const HeaderStyle = {
    padding: "20px",
    paddingTop:"0px",
    margin:"0px",
    color: "white",
    // border:"2px solid black"
}

const FooterStyle = {
    padding:"20px"
}

const MenuStyle = {
    backgroundColor:"transparent",
    color:"white",
    width:"100%"
}

type MenuItem = GetProp<MenuProps, "items">[number];



export default function LayoutProductPage({
    children
}: {
    children:React.ReactNode
}) {
    const auth = useAuth()
    const menuItems: MenuItem[] = [
        {
            key: "1",
            label:(<a href="/">Dashboard</a>),
            icon: <HomeOutlined />
        },
        {
            key: "2",
            label:(<a href="product/">Products</a>),
            icon: <ProductOutlined />
        }, {
            key: "3",
            label: (<a onClick={() => {
                auth.logout()
                window.location.href = "/login"
            }}>Logout</a>),
            icon: <ApiOutlined />,
            danger:true
        }
    ]
    
    return (
        <Layout style={LayoutStyle}>
                <Sider style={SiderStyle} theme="dark">
                    <Image width={"100%"} style={{ padding:"20px" }} src="/images/Logo.png" alt="Logo PT. Summit Global Technology"></Image>
                    <Menu
                        style={MenuStyle}
                        theme="dark"
                        mode="vertical"
                        defaultSelectedKeys={["2"]}
                        items={menuItems}
                    />
                </Sider>
                <Layout>
                    <Header style={HeaderStyle}>Hello, {auth?.user?.email}</Header>
                    <Content style={ContentStyle}>{children}</Content>
                </Layout>
        </Layout>
    )
}