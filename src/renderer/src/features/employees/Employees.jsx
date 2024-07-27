import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button, Modal, Form, message, Row, Col, Tooltip, Table, Input, Card } from 'antd'
import { fetchData, addItem, updateItem, deleteItem } from '../api'
import { Icon } from '@iconify/react'
import { useTable } from '@hooks/useTable'

const Employees = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const [state, dispatch] = useTable()

  const queryOptions = {
    initialData: { data: [], recordsTotal: 0 },
    onError: () => message.error('فشلت عملية الجلب')
  }

  const {
    data: employees,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['employees/get_employees', { ...state }],
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

  const addEmployeeMutation = handleMutation(
    (data) => addItem('/employees/create_employee', data),
    'تمت إضافة الموظف بنجاح',
    'فشلت عملية إضافة الموظف'
  )
  const updateEmployeeMutation = handleMutation(
    (data) => updateItem('/employees/update_employee', data),
    'تم تحديث الموظف بنجاح',
    'فشلت عملية تحديث الموظف'
  )
  const deleteEmployeeMutation = handleMutation(
    (id) => deleteItem('/employees/delete_employee', id),
    'تم حذف الموظف بنجاح',
    'فشلت عملية حذف الموظف'
  )

  const handleEdit = (employee) => {
    setEditMode(true)
    setSelectedEmployee(employee)
    reset(employee)
    setIsModalVisible(true)
  }

  const handleDelete = (employeeId) => deleteEmployeeMutation.mutate(employeeId)

  const onSubmit = (data) => {
    if (editMode) {
      updateEmployeeMutation.mutate({ ...data, id: selectedEmployee.id })
    } else {
      addEmployeeMutation.mutate(data)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedEmployee(null)
    reset({ name: '', role: '', phone: '' })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الدور', dataIndex: 'role', key: 'role', align: 'center' },
    { title: 'رقم الهاتف', dataIndex: 'phone', key: 'phone', align: 'center' },
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
          <p className="text-2xl font-semibold">الموظفين</p>
        </Col>
        <Col span={8}>
          <Input.Search
            placeholder="بحث"
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            value={state.search}
          />
        </Col>
        <Col span={8} className="flex justify-end">
          <Tooltip title="أضافة موظف جديد">
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
        dataSource={employees?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: state.length,
          total: employees.total,
          onChange: (page, pageSize) => {
            dispatch({ type: 'SET_PAGE', payload: page })
            dispatch({ type: 'SET_LENGTH', payload: pageSize })
          }
        }}
        rowKey="id"
      />
      <Modal
        title={editMode ? 'تعديل موظف' : 'أضافة موظف'}
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
          <Form.Item label="الدور">
            <Controller
              name="role"
              control={control}
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

export default Employees
