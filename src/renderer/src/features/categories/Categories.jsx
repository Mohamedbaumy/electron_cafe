import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: categories,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['categories/get_categories', { ...state }],
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

  const addCategoryMutation = handleMutation(
    (data) => addItem('/categories/create_category', data),
    'تمت إضافة التصنيف بنجاح',
    'فشلت عملية إضافة التصنيف'
  )
  const updateCategoryMutation = handleMutation(
    (data) => updateItem('/categories/update_category', data),
    'تم تحديث التصنيف بنجاح',
    'فشلت عملية تحديث التصنيف'
  )
  const deleteCategoryMutation = handleMutation(
    (id) => deleteItem('/categories/delete_category', id),
    'تم حذف التصنيف بنجاح',
    'فشلت عملية حذف التصنيف'
  )

  const handleEdit = (category) => {
    setEditMode(true)
    setSelectedCategory(category)
    reset(category)
    setIsModalVisible(true)
  }

  const handleDelete = (categoryId) => deleteCategoryMutation.mutate(categoryId)

  const onSubmit = (data) => {
    if (editMode) {
      updateCategoryMutation.mutate({ ...data, id: selectedCategory.id })
    } else {
      addCategoryMutation.mutate(data)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedCategory(null)
    reset({ name: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
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
          <p className="text-2xl font-semibold">التصنيفات</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة تصنيف جديد">
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
        dataSource={categories?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: categories.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل تصنيف' : 'أضافة تصنيف'}
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

export default Categories
