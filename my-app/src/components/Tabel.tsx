import { DataTable } from "@/app/product/page";
import { Product, ProductListParams } from "@/lib/dataInterface";
import { PaginationProps, TableProps, TableColumnsType } from "antd";
import { Typography, Table } from "antd"

const { Title, Text } = Typography;


interface TableDataProps {
    productData: DataTable[],
    isSelectionMode: boolean,
    isLoading: boolean,
    pagination: ProductListParams,
    paginationOnChange: PaginationProps["onChange"],
    setSelectedRow:React.Dispatch<React.SetStateAction<DataTable | undefined>>
}

export default function TableData({
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