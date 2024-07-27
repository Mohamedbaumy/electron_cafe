import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const Customers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: customers,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['customers/get_customers', { ...state }],
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

  const addCustomerMutation = handleMutation(
    (data) => addItem('/customers/create_customer', data),
    'تمت إضافة الزبون بنجاح',
    'فشلت عملية إضافة الزبون'
  )
  const updateCustomerMutation = handleMutation(
    (data) => updateItem('/customers/update_customer', data),
    'تم تحديث الزبون بنجاح',
    'فشلت عملية تحديث الزبون'
  )
  const deleteCustomerMutation = handleMutation(
    (id) => deleteItem('/customers/delete_customer', id),
    'تم حذف الزبون بنجاح',
    'فشلت عملية حذف الزبون'
  )

  const handleEdit = (customer) => {
    setEditMode(true)
    setSelectedCustomer(customer)
    reset(customer)
    setIsModalVisible(true)
  }

  const handleDelete = (customerId) => deleteCustomerMutation.mutate(customerId)

  const onSubmit = (data) => {
    if (editMode) {
      updateCustomerMutation.mutate({ ...data, id: selectedCustomer.id })
    } else {
      addCustomerMutation.mutate(data)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedCustomer(null)
    reset({ name: '', phone: '', debt: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'رقم الهاتف', dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: 'الديون', dataIndex: 'debt', key: 'debt', align: 'center' },
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
          <p className="text-2xl font-semibold">الزبائن</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة زبون جديد">
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
        dataSource={customers?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: customers.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل زبون' : 'أضافة زبون'}
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="الاسم">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'الاسم مطلوب' }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="رقم الهاتف">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="الديون">
            <Controller
              name="debt"
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

export default Customers
