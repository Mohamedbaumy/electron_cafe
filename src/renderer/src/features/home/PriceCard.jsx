import React, { useEffect } from 'react'
import { Row, Col, Form, AutoComplete, InputNumber, Button, Segmented } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'

const PriceCard = () => {
  const { control, setValue, watch } = useFormContext()

  const products = watch('products')
  const discount = watch('discount')
  const payed = watch('payed')

  useEffect(() => {
    const totalPrice =
      products.reduce((total, product) => total + product.price * product.quantity, 0) - discount
    setValue('totalPrice', totalPrice)
  }, [products, discount, setValue])

  useEffect(() => {
    const totalPrice = watch('totalPrice')
    const rest = payed - totalPrice
    setValue('rest', rest)
  }, [payed, watch('totalPrice'), setValue])

  return (
    <Row gutter={[8, 8]} justify="space-evenly" align="bottom">
      <Col md={20}>
        <Controller
          name="customerId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Form.Item label={'العميل أو التربيزة'} labelCol={{ span: 24 }}>
              <AutoComplete
                {...field}
                options={[]}
                className="w-full"
                placeholder="ابحث أو أضف عميل"
              />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={4}>
        <Controller
          name="dept"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Form.Item label={'الدين'} labelCol={{ span: 24 }}>
              <InputNumber {...field} className="w-full" placeholder="أدخل الدين" />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={24}>
        <Controller
          name="status"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Segmented {...field} options={['دين', 'صالة', 'تيك أواي']} block />
          )}
        />
      </Col>
      <Col md={24}>
        <Controller
          name="payStatus"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Segmented {...field} options={['تم التسديد', 'في الصاله']} block />
          )}
        />
      </Col>
      <Col md={6}>
        <Controller
          name="discount"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Form.Item label={'الخصم'} labelCol={{ span: 24 }}>
              <InputNumber {...field} className="w-full" placeholder="أدخل الخصم" />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={6}>
        <Controller
          name="totalPrice"
          control={control}
          render={({ field }) => (
            <Form.Item label={'السعر الكلي'} labelCol={{ span: 24 }}>
              <InputNumber
                {...field}
                className="w-full"
                disabled
                placeholder="السعر الكلي بعد الخصم"
                value={field.value}
              />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={6}>
        <Controller
          name="payed"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Form.Item label={'المدفوع من الزبون'} labelCol={{ span: 24 }}>
              <InputNumber {...field} className="w-full" placeholder="أدخل المبلغ المدفوع" />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={6}>
        <Controller
          name="rest"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Form.Item label={'الباقي'} labelCol={{ span: 24 }}>
              <InputNumber {...field} className="w-full" placeholder="المبلغ المتبقي" disabled />
            </Form.Item>
          )}
        />
      </Col>
      <Col md={24}>
        <Button type="primary" className="w-full" onClick={() => console.log('Save clicked')}>
          حفظ
        </Button>
      </Col>
    </Row>
  )
}

export default PriceCard
