import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: products,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['products/get_products', { ...state }],
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

  const addProductMutation = handleMutation(
    (data) => addItem('/products/create_product', data),
    'تمت إضافة المنتج بنجاح',
    'فشلت عملية إضافة المنتج'
  )
  const updateProductMutation = handleMutation(
    (data) => updateItem('/products/update_product', data),
    'تم تحديث المنتج بنجاح',
    'فشلت عملية تحديث المنتج'
  )
  const deleteProductMutation = handleMutation(
    (id) => deleteItem('/products/delete_product', id),
    'تم حذف المنتج بنجاح',
    'فشلت عملية حذف المنتج'
  )

  const handleEdit = (product) => {
    setEditMode(true)
    setSelectedProduct(product)
    reset(product)
    setIsModalVisible(true)
  }

  const handleDelete = (productId) => deleteProductMutation.mutate(productId)

  const onSubmit = (data) => {
    if (editMode) {
      updateProductMutation.mutate({ ...data, id: selectedProduct.id })
    } else {
      addProductMutation.mutate(data)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedProduct(null)
    reset({ name: '', price: '', category_id: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'السعر', dataIndex: 'price', key: 'price', align: 'center' },
    { title: 'التصنيف', dataIndex: 'category_id', key: 'category_id', align: 'center' },
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
          <p className="text-2xl font-semibold">المنتجات</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة منتج جديد">
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
        dataSource={products?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: products.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل منتج' : 'أضافة منتج'}
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
          <Form.Item label="السعر">
            <Controller
              name="price"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="التصنيف">
            <Controller
              name="category_id"
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

export default Products
