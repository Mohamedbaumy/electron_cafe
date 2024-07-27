import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const Orders = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: orders,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['orders/get_orders', { ...state }],
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

  const addOrderMutation = handleMutation(
    (data) => addItem('/orders/create_order', data),
    'تمت إضافة الطلب بنجاح',
    'فشلت عملية إضافة الطلب'
  )
  const updateOrderMutation = handleMutation(
    (data) => updateItem('/orders/update_order', data),
    'تم تحديث الطلب بنجاح',
    'فشلت عملية تحديث الطلب'
  )
  const deleteOrderMutation = handleMutation(
    (id) => deleteItem('/orders/delete_order', id),
    'تم حذف الطلب بنجاح',
    'فشلت عملية حذف الطلب'
  )

  const handleEdit = (order) => {
    setEditMode(true)
    setSelectedOrder(order)
    reset(order)
    setIsModalVisible(true)
  }

  const handleDelete = (orderId) => deleteOrderMutation.mutate(orderId)

  const onSubmit = (data) => {
    if (editMode) {
      updateOrderMutation.mutate({ ...data, id: selectedOrder.id })
    } else {
      addOrderMutation.mutate(data)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedOrder(null)
    reset({ customer_id: '', date: '', total_price: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'المعرف', dataIndex: 'id', key: 'id' },
    { title: 'الزبون', dataIndex: 'customer_id', key: 'customer_id', align: 'center' },
    { title: 'التاريخ', dataIndex: 'date', key: 'date', align: 'center' },
    { title: 'إجمالي السعر', dataIndex: 'total_price', key: 'total_price', align: 'center' },
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
          <p className="text-2xl font-semibold">الطلبات</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة طلب جديد">
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
        dataSource={orders?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: orders.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل طلب' : 'أضافة طلب'}
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="الزبون">
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: 'الزبون مطلوب' }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="التاريخ">
            <Controller
              name="date"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
          </Form.Item>
          <Form.Item label="إجمالي السعر">
            <Controller
              name="total_price"
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

export default Orders
