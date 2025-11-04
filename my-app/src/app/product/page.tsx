"use client"
import React, { useState, useEffect } from "react";
import { Button, Col, Dropdown, Input, Row, Table,Tag,Typography,Switch, Space, Modal,Upload, InputNumber } from "antd";
import type { MenuProps, TableColumnsType, TableProps, PaginationProps, ModalFuncProps, GetProp, UploadFile, UploadProps, InputNumberProps } from "antd";
import { Product, ProductListParams } from "@/lib/dataInterface";
import TextArea from "antd/es/input/TextArea";
import { ItemType } from "antd/es/menu/interface";
import { DeleteOutlined, EditOutlined,PlusOutlined,LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { createProductData, GetAllData, updateProductData } from "@/lib/requestFunctions";

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

    const ClearFilter = () => {
        setSearch({
            product_title: "",
            product_description: "",
            product_category:""
        })
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
            <div style={{ marginBottom: "30px" }}>
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
                    <Col>
                        <Space/>
                        <Button
                            size={"middle"}
                            onClick={ClearFilter}
                        >
                        Clear
                        </Button>
                    </Col>
                    <Col>
                        <Space/>
                        <Button
                            size={"middle"}
                            onClick={() => {
                                setModalTitle("Tambah Produk")
                                setIsModalUpdateOpen(true);
                            }}
                            color="green"
                            variant="solid"
                        >
                        Add
                        </Button>
                    </Col>
                    <Col>
                        <Space/>
                        <Button
                            size={"middle"}
                            onClick={openModal}
                            color="primary"
                            variant="outlined"
                        >
                        <EditOutlined/>
                        </Button>
                    </Col>
                    <Col>
                        <Space/>
                        <Button
                            size={"middle"}
                            onClick={ClearFilter}
                            color="danger"
                            variant="outlined"
                        >
                        <DeleteOutlined/>
                        </Button>
                    </Col>
                </Row>
                <Row style={{ margin: "20px 0px" }}>
                    
                        <Space/>
                        <Space/>
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
                </Row>
                <Row>
                    <Col>
                        <Switch onChange={handleSelectionMode}/>
                        <Text style={{ marginLeft:"10px" }}>Selection Mode</Text>
                    </Col>
                </Row>
           </div>
           <p>{selectedRow?.product_title}</p>
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

interface TableDataProps {
    productData: DataTable[],
    isSelectionMode: boolean,
    isLoading: boolean,
    pagination: ProductListParams,
    paginationOnChange: PaginationProps["onChange"],
    setSelectedRow:React.Dispatch<React.SetStateAction<DataTable | undefined>>
}

function TableData({
    productData,
    isSelectionMode,
    isLoading,
    pagination,
    paginationOnChange,
    setSelectedRow
    }: TableDataProps) {

    const rowSelection: TableProps<DataTable>["rowSelection"] = {
        type: "radio",
        onChange: (selectedRowKey: React.Key[], selectedRow: DataTable[]) => {
            setSelectedRow(selectedRow[0]);
        },
                    
    }   
                
    const tableColumns: TableColumnsType<DataTable> = [
        {
            title: "Name",
            dataIndex: "product_title",
            width: "200px",
            ellipsis:true,
            render: (_, record) => {
                return (
                    <Title
                        level={5}
                        ellipsis={{ tooltip:record.product_title }}
                        style={{ width:"150px" }}
                    >
                        {record.product_title}
                    </Title>
                )
            }
        },{
            title: "Description",
            dataIndex: "product_description",
            render: (_, record) => {
                return (
                    <Text
                        ellipsis={{ tooltip:record.product_description }}
                    >
                        {record.product_description}
                    </Text>
                )
            }
        }, {
            title: "Category",
            dataIndex: "product_category",
            width:"100px",
            render: (_, record) => {
                if (!record.product_category) return;
                const category: string = record.product_category?.replace("category ", "")
                return (
                    <Text>
                        {category}
                    </Text>
                )
            }
        },{
            title: "Price",
            dataIndex: "product_price",
            width:"100px",
            render: (_, record) => {
                const price:string = `$${record.product_price}`
                return (
                    <Text>
                        {price}
                    </Text>
                )
            }
        }, 
    ]

    return (
        <Table<DataTable>
            columns={tableColumns}
            dataSource={productData}
            rowSelection={isSelectionMode ? rowSelection : undefined}
            sticky={true}
            scroll={{ y: 400 }}
            pagination={{
                defaultCurrent:1,
                current:pagination?.page || 1,
                total: 20,
                onChange:paginationOnChange
            }}
            loading={isLoading}
            />
    )

}



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

function ModalUpdateCreate({
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
    
    const {confirm} = Modal

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
                if (title === "Tambah Produk") {
                    return await createProductData(datas)
                } else if (title === "Update") {
                    return await updateProductData(datas);
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