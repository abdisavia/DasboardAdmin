"use client";
import { DataTable } from "@/app/product/page";
import { GetProp, UploadProps, UploadFile, MenuProps, InputNumberProps } from "antd";
import { Modal, Row, Col, Upload, Typography, Input, InputNumber, Dropdown } from "antd";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined, PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { ModalFuncProps } from "antd";
import { createProductData,updateProductData } from "@/lib/requestFunctions";
import { useAuth } from "@/lib/AuthContex";

interface ModalUpdateCreateProps {
    title: string,
    open: boolean,
    changeStatus: React.Dispatch<React.SetStateAction<boolean>>,
    selectedData?: DataTable
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export type CreateProductType = {
    product_id?:string,
    product_title: string,
    product_image?: string,
    product_description: string,
    product_price: number,
    product_category:string
}

const { Title } = Typography;

export default function ModalUpdateCreate({
    title,
    open,
    changeStatus,
    selectedData,
}: ModalUpdateCreateProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<UploadFile>({
        name: "",
        uid: "",
        url: "",
    });
    const category:MenuProps["items"] = [
        {
            key: "1",
            label: "1",
        },
        {
            key: "2",
            label: "2",
        },
        {
            key: "3",
            label: "3",
        },
        {
            key: "4",
            label: "4",
        },
        {
            key: "5",
            label: "5",
        },
        {
            key: "6",
            label: "6",
        },
        {
            key: "7",
            label: "7",
        },
        {
            key: "8",
            label: "8",
        },
        {
            key: "9",
            label: "9",
        },
        {
            key: "10",
            label: "10",
        },
    ]
    const [datas, setDatas] = useState<CreateProductType>({
        product_title: "",
        product_description: "",
        product_price: 0,
        product_image: "",
        product_category:""
    })
    const [token, setToken] = useState("");
    const auth = useAuth();

    useEffect(() => {
        if (!selectedData) return;
        const { product_id, product_price, product_title, product_category, product_description } = selectedData;
        setDatas({
            product_id:product_id,
            product_price:product_price,
            product_title:product_title,
            product_category:product_category || "",
            product_description:product_description || "",
        })
    },[])

    const handlePreview = async (file:UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    }

    const handleChange: UploadProps["onChange"] = (info) => {
            setIsLoading(true);
            getBase64(info.file.originFileObj as FileType)
                .then((val) => {
                    setIsLoading(false);
                    setImage({
                        ...image,
                        url:val
                    })
                })
            return;
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
        {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const formatter: InputNumberProps<number>["formatter"] = (value) => {
        const [start, end] = `${value}`.split(".") || []
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `$ ${end ? `${v}.${end}` : `${v}`}`;
    } 
    
    const {confirm, info} = Modal

    const handleDropdownOnclick:MenuProps["onClick"] = (value) => {
        setDatas({
            ...datas,
            product_category:value.key
        })
    }

    const onOk: ModalFuncProps["onOk"] = () => {
        confirm({
            title: `Yakin ingin ${title}?`,
            icon: <ExclamationCircleFilled />,
            onOk: async () => {
                const token = await auth.getToken();
                if(!token) return Promise.reject("Token not found")
                if (title === "Tambah Produk") {
                    return await createProductData(token,datas)
                } else if (title === "Update") {
                    return await updateProductData(token,datas);
                }
            },
            onCancel: () => { }
        });
    };

    const onCancel:ModalFuncProps["onCancel"] = () => {
        changeStatus(false);
    }

    return (
        <Modal
            title={title}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
        >
            <Row gutter={"20px"}>
                <Col>
                    <Upload
                        name="product_image"
                        listType="picture-card"
                        showUploadList={false}
                        onChange={handleChange}
                        onPreview={handlePreview}
                    >
                        {
                            image.url ? (
                                <img draggable={false} src={image.url} alt="Product_image" style={{ width:"100%" }}/>
                            ) : (
                                    uploadButton
                            )
                        }

                    </Upload>
                </Col>
                <Col>
                    <Title level={5}>Upload Gambar Produk</Title>
                </Col>
            </Row>
            <Row gutter={"20px"}>
                <Col style={{ marginTop:"20px" }}>
                    <label htmlFor="product_name">Nama : </label>
                    <Input
                        name="product_name"
                        placeholder="nama produk baru"
                        onChange={(value) => {
                            setDatas({
                                ...datas,
                                product_title: value.target.value
                            })
                        }}
                        value={datas.product_title}
                    />
                </Col>
                <Col style={{ marginTop:"20px" }}>
                    <label htmlFor="product_price">Harga : </label>
                    <InputNumber<number>
                        name="product_price"
                        placeholder="harga produk"
                        formatter={formatter}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        onChange={(value) => setDatas({
                            ...datas,
                            product_price: value || 0
                        })
                        }
                        style={{ display: "block" }}
                        value={Number(datas.product_price)}
                    />
                </Col>
                <Col style={{ marginTop:"20px" }}>
                        <label htmlFor="Category" style={{ display:"block" }}>Category:</label>
                        <Dropdown.Button
                            menu={{ 
                                items: category,
                                selectable:true,
                                onClick: handleDropdownOnclick,
                            }}
                            loading={isLoading}
                            size={"middle"}
                            >
                        {datas.product_category.replace("category ", "")}
                        </Dropdown.Button>
                    </Col>
            </Row>
            <Row>
                <Col style={{ marginTop:"10px" }} span={24}>
                    <label htmlFor="product_name">Nama Description : </label>
                    <TextArea
                        name="product_name"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="nama produk baru"
                        onChange={(value) => {
                            setDatas({
                                ...datas,
                                product_description:value.target.value
                            })
                        }}
                        value={datas.product_description}
                    />
                </Col>
            </Row>            
        </Modal>
    )
}