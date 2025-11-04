"use client"
import React, { useState, useEffect } from "react";
import { Button, Col, Dropdown, Popover, Input, Row,Tag,Typography,Switch, Space, Modal,Upload, InputNumber } from "antd";
import type { MenuProps,PaginationProps, ModalFuncProps, GetProp, UploadFile, UploadProps, InputNumberProps } from "antd";
import { Product, ProductListParams } from "@/lib/dataInterface";
import TextArea from "antd/es/input/TextArea";
import { DeleteOutlined, EditOutlined,PlusOutlined,LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { createProductData, GetAllData, updateProductData } from "@/lib/requestFunctions";
import TableData from "@/components/Tabel";
import ModalUpdateCreate from "@/components/Modal";

export interface DataTable extends Product{
    key: React.Key
}

const { Search } = Input;

const { Title, Text } = Typography;


type MenuItems = {
    key: React.Key,
    label: string
}

type SearchItems = {
    product_title: string,
    product_description:  string,
    product_category: string
}

type SearchItemsIndex = keyof DataTable;

export default function ProductPage() {
    const [productData, setProductData] = useState<DataTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [pagination, setPagination] = useState<ProductListParams>({
        page: 0,
        limit: 10,
        offset: 0,
        search:""
    });
    const [search, setSearch] = useState<SearchItems>({
        product_title:"",
        product_description: "",
        product_category:""
    })
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [selectedRow, setSelectedRow] = useState<DataTable>();
    
    
    function SaveToUseState(data: Product[]) {
        if (!data) return;
        let data_product: Product[] = data;
        let data_product_data_table:DataTable[] = data_product.map<DataTable>((product, index, arr) => {
            let data_product: DataTable = {
                key: index,
                ...product
            }
            return data_product
        })
        setProductData([]);
        setProductData(data_product_data_table);
        return;
    }
    
    function saveProductListParams(data:ProductListParams) {
        let data_product_params: ProductListParams = data;
        setPagination(data_product_params);
    }

    useEffect(() => {
        GetAllData("","",setIsLoading)
            .then(res => {
                if (res?.status === 200) {
                    SaveToUseState(res.data.data);
                    saveProductListParams(res.data.pagination)
                    setIsLoading(false);
                } else {
                    alert("Something is wrong");
                }
        });
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            let flattenSearch = `${search.product_title} ${search.product_description} ${search.product_category}`
            setIsLoading(true);
            GetAllData("search",flattenSearch,setIsLoading)
                .then(res => {
                    if (res?.status === 200) {
                        SaveToUseState(res.data.data);
                    }
                    setIsLoading(false);
                })
            
        }, 300)
        if (search.product_title === "" && search.product_description === "" && search.product_category === "") {
            return () => {
                clearTimeout(timer);
            }
        }
        return () => { clearTimeout(timer) };
    },[search])


    

    const handleSearch = (key: SearchItemsIndex, value: string) => {
        if (key === "product_title") {
            setSearch({
                ...search,
                "product_title": value
            })
        } else if (key === "product_description") {
            setSearch({
                ...search,
                "product_description": value
            })
        } else if (key === "product_category") {
            setSearch({
                ...search,
                "product_category":value
            })
        }
    }

    const getUniqueCategory = (): MenuProps["items"] => {
        let uniqueCategory:MenuItems[] = [];
        productData?.forEach((product,index) => {
            if (!product.product_category) return;

            const category = product.product_category.replace("category ", "");

            const exist = uniqueCategory.some(
                (item) => item?.label === category
            )
            
            if (exist) return;

            uniqueCategory.push({
                key: `${category}`,
                label:category
            })
        })
        if (uniqueCategory.length < 1) {
            uniqueCategory.push({
                key: "0",
                label:"none"
            })
            return uniqueCategory;
        }
        uniqueCategory.sort((a,b) => Number(a.label)-Number(b.label))

        const menu:MenuProps["items"] = uniqueCategory
        return menu;
    }

    const handleDropdownOnclick:MenuProps["onClick"] = (e) => {
        handleSearch("product_category", e.key)
    }

    const paginationOnChange: PaginationProps["onChange"] = (page) => {
        setIsLoading(true);
        setPagination({
            ...pagination,
            page: page
        });
        GetAllData("page", page.toString(), setIsLoading)
            .then(dat => {
                if (dat?.status === 200) {
                    SaveToUseState(dat.data.data)
                }
            })
        setIsLoading(false);
    }

    const Clear = () => {
        setSearch({
            product_title: "",
            product_description: "",
            product_category: ""
        });
        setSelectedRow({
            key:"",
            product_id: "",
            product_price: 0,
            created_timestamp: "",
            product_title: "",
            updated_timestamp:"",
        });
        
        setIsSelectionMode(false);
        
    }

    const handleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
    }
    
    const openModal = () => {
        setIsModalUpdateOpen(true);
        setModalTitle("Update");

    }

    return (
        <>
            <div style={{ marginBottom: "10px" }}>
                <Title level={5}>Search</Title>
                <Row gutter={[8,8]}>
                    <Col>
                        <label htmlFor="name">Name:</label>
                        <Search
                            name="name"
                            type="text"
                            placeholder="filter"
                            onChange={(event) => {
                                handleSearch("product_title", event.target.value);
                            }}
                            onSearch={(e) => {
                                handleSearch("product_title", e);
                            }}
                            value={search.product_title}
                        />
                    </Col>
                    <Col>
                        <label htmlFor="Description">Description:</label>
                        <Search
                            name="Description"
                            style={{ resize:"none", height:"20px" }}
                            placeholder="Description"
                            onChange={(event) => {
                                handleSearch("product_description",event.target.value);
                            }}
                            onSearch={(value) => {
                                handleSearch("product_description",value);
                            }}
                            value={search.product_description}
                            />
                    </Col>
                    <Col>
                        <label htmlFor="Category" style={{ display:"block" }}>Category:</label>
                        <Dropdown.Button
                            menu={{ 
                                items: getUniqueCategory(),
                                selectable:true,
                                onClick: handleDropdownOnclick,
                            }}
                            loading={isLoading}
                            size={"middle"}
                            >
                        {search.product_category}
                        </Dropdown.Button>
                    </Col>
                    <Col style={{ display:"flex", alignItems:"end"}}>
                        <Space >
                            <Button
                                size={"middle"}
                                onClick={Clear}
                                >
                            Clear
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Row style={{ margin: "10px 0px", borderTop:"0.1px solid gray", height:"50px"}}>
                    <Space>
                        <Text style={{ marginTop:"2px" }}>Search Tag:</Text>
                        <Col>
                            {
                                search.product_title !== "" ? (
                                    <Tag
                                        closable={{ 
                                            closeIcon: <DeleteOutlined />,
                                            "aria-label": 'Close Button'
                                        }}
                                        onClose={() => {
                                            handleSearch("product_title", "");
                                        }}

                                        >
                                        {`Name : ${search.product_title}`}
                                    </Tag>
                                ) : ""
                            }
                            {
                                search.product_description !== "" ? (
                                    <Tag
                                    closable={{ 
                                        closeIcon: <DeleteOutlined />,
                                        "aria-label": 'Close Button'
                                    }}
                                    onClose={() => {
                                        handleSearch("product_description", "");
                                    }}
                                        >
                                        {`Desc: ${search.product_description}`}
                                    </Tag>
                                ) : ""
                            }
                            {
                                search.product_category !== ""?(
                                    <Tag
                                    closable={{ 
                                        closeIcon: <DeleteOutlined />,
                                        "aria-label": 'Close Button'
                                    }}
                                    onClose={() => {
                                        handleSearch("product_category", "");
                                    }}
                                    >
                                        {`Category : ${search.product_category}`}
                                    </Tag>
                                ) : "" 
                            }
                        </Col>
                    </Space>
                </Row>
                <Row>
                    <Space style={{ display:"flex", marginLeft:"auto", gap:"20px" }}>
                        <Col >
                            <Switch onChange={handleSelectionMode} value={ isSelectionMode } />
                            <Text style={{ marginLeft:"10px" }}>Selection Mode</Text>
                        </Col>
                        <Row gutter={"5px"}>
                            <Col>
                                <Button
                                    size={"middle"}
                                    onClick={() => {
                                        setModalTitle("Tambah Produk")
                                        setIsModalUpdateOpen(true);
                                    }}
                                    color="green"
                                    variant="solid"
                                >
                                <PlusOutlined />
                                </Button>
                            </Col>
                            <Col>
                                <Popover content={(<p>Harap nyalakan selection mode dahulu</p>)}>
                                    <Button
                                        size={"middle"}
                                        onClick={openModal}
                                        color="primary"
                                        variant="outlined"
                                        popover="auto"
                                        disabled={selectedRow?.product_id? false:true}
                                    >
                                        <EditOutlined/>
                                    </Button>
                                </Popover>
                            </Col>
                            <Col>
                                <Popover content={(<p>Harap nyalakan selection mode dahulu</p>)}>
                                    <Button
                                        size={"middle"}
                                        onClick={Clear}
                                        color="danger"
                                        variant="outlined"
                                        popover="auto"
                                        disabled={selectedRow?.product_id? false:true}
                                    >
                                    <DeleteOutlined/>
                                    </Button>
                                </Popover>
                            </Col>
                        </Row>
                    </Space>
                </Row>
           </div>
            <TableData
                productData={productData}
                isSelectionMode={isSelectionMode}
                isLoading={isLoading}
                pagination={pagination}
                paginationOnChange={paginationOnChange}
                setSelectedRow={setSelectedRow}
            />
            {

                isModalUpdateOpen ? (
                    <ModalUpdateCreate
                        title={modalTitle}
                        open={true}
                        changeStatus={() => { 
                            setIsModalUpdateOpen(false);
                        }}
                        selectedData={selectedRow}
                    />
                ):""

            }
        </>
    )
}



