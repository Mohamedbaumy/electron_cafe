import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const OrderDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: orderDetails,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['orderDetails/get_order_details', { ...state }],
    queryFn: fetchData,
    ...queryOptions
  })

  const handleMutation = (mutationFn, successMessage, errorMessage) => {
    return useMutation({
      mutationFn,
      onSuccess: () => {
        message.success(successMessage)
        refetch()
        setIsModalVisible(false)
      },
      onError: () => message.error(errorMessage)
    })
  }

  const addOrderDetailMutation = handleMutation(
    (data) => addItem('/order_details/create_order_detail', data),
    'تمت إضافة تفاصيل الطلب بنجاح',
    'فشلت عملية إضافة تفاصيل الطلب'
  )
  const updateOrderDetailMutation = handleMutation(
    (data) => updateItem('/order_details/update_order_detail', data),
    'تم تحديث تفاصيل الطلب بنجاح',
    'فشلت عملية تحديث تفاصيل الطلب'
  )
  const deleteOrderDetailMutation = handleMutation(
    (id) => deleteItem('/order_details/delete_order_detail', id),
    'تم حذف تفاصيل الطلب بنجاح',
    'فشلت عملية حذف تفاصيل الطلب'
  )

  const handleEdit = (orderDetail) => {
    setEditMode(true)
    setSelectedOrderDetail(orderDetail)
    reset(orderDetail)
    setIsModalVisible(true)
  }

  const handleDelete = (orderDetailId) => deleteOrderDetailMutation.mutate(orderDetailId)

  const onSubmit = (data) => {
    if (editMode) {
      updateOrderDetailMutation.mutate({ ...data, id: selectedOrderDetail.id })
    } else {
      addOrderDetailMutation.mutate(data)
    }
  }
  const handleAddNew = () => {
    setEditMode(false)
    setSelectedOrderDetail(null)
    reset({ order_id: '', product_id: '', quantity: '', price: '', discount_price: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'المعرف', dataIndex: 'id', key: 'id' },
    { title: 'الطلب', dataIndex: 'order_id', key: 'order_id', align: 'center' },
    { title: 'المنتج', dataIndex: 'product_id', key: 'product_id', align: 'center' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    { title: 'السعر', dataIndex: 'price', key: 'price', align: 'center' },
    { title: 'السعر المخفض', dataIndex: 'discount_price', key: 'discount_price', align: 'center' },
    {
      title: 'الإجراء',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <Row gutter={16}>
          <Col span={12}>
            <Tooltip title="تعديل">
              <Button
                type="default"
                shape="circle"
                icon={<Icon icon="akar-icons:edit" />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          </Col>
          <Col span={12} className="flex justify-center">
            <Tooltip title="حذف">
              <Button
                type="default"
                shape="circle"
                icon={<Icon icon="akar-icons:trash-bin" />}
                onClick={() => handleDelete(record.id)}
              />
            </Tooltip>
          </Col>
        </Row>
      )
    }
  ]

  return (
    <Card className="min-h-screen">
      <Row gutter={16} className="mb-4 h-10">
        <Col span={8}>
          <p className="text-2xl font-semibold">تفاصيل الطلبات</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة تفاصيل طلب جديد">
            <Button
              type="default"
              shape="circle"
              icon={<Icon icon="akar-icons:plus" />}
              onClick={handleAddNew}
            />
          </Tooltip>
        </Col>
      </Row>
      <Table
        dataSource={orderDetails?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: orderDetails.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل تفاصيل طلب' : 'أضافة تفاصيل طلب'}
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="الطلب">
            <Controller
              name="order_id"
              control={control}
              rules={{ required: 'الطلب مطلوب' }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="المنتج">
            <Controller
              name="product_id"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="الكمية">
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="السعر">
            <Controller
              name="price"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="السعر المخفض">
            <Controller
              name="discount_price"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit" className="w-full">
              {editMode ? 'تحديث' : 'حفظ'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default OrderDetails
