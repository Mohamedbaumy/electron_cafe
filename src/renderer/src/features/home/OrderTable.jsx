import React from 'react'
import { Table, Button, InputNumber } from 'antd'
import { Icon } from '@iconify/react'

const OrderTable = ({ orderProducts, handelRemoveOrderProduct, handleQuantityChange }) => {
  return (
    <Table
      columns={[
        {
          title: 'المنتج',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          render: (text) => <p className="truncate">{text}</p>
        },
        { title: 'السعر', dataIndex: 'price', key: 'price', align: 'center' },
        {
          title: 'الكمية',
          dataIndex: 'quantity',
          key: 'quantity',
          align: 'center',
          render: (_, record, index) => (
            <InputNumber
              min={0}
              value={record.quantity}
              onChange={(value) => handleQuantityChange(index, value)}
            />
          )
        },
        {
          title: 'السعر الإجمالي',
          key: 'totalPrice',
          align: 'center',
          render: (_, record) => <span>{record.price * record.quantity}</span>
        },
        {
          title: 'الإجراء',
          key: 'action',
          align: 'center',
          render: (_, record) => (
            <Button type="default" danger onClick={() => handelRemoveOrderProduct(record._id)}>
              <Icon icon="fluent:delete-20-regular" />
            </Button>
          )
        }
      ]}
      dataSource={orderProducts}
      pagination={false}
      rowKey="_id"
      className="w-full"
    />
  )
}

export default OrderTable
