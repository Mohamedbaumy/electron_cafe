import React, { useEffect } from 'react'
import { Row, Col, Card, Segmented, Form, AutoComplete, InputNumber, Button } from 'antd'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import Products from './Products'
import OrderTable from './OrderTable'
import PriceCard from './PriceCard'

const Home = () => {
  const methods = useForm({
    defaultValues: {
      products: [],
      discount: 0,
      totalPrice: 0,
      payed: 0,
      rest: 0,
      status: 'صالة',
      payStatus: 'تم التسديد'
    }
  })

  const { control, watch } = methods

  const {
    fields: orderProducts,
    append: appendProduct,
    update: updateProduct,
    remove: removeProduct
  } = useFieldArray({
    control,
    name: 'products'
  })

  const handelAppendOrderProduct = (id, product) => {
    const index = orderProducts.findIndex((p) => p._id === id)
    if (index === -1) {
      appendProduct({ _id: id, name: product.name, price: product.price, quantity: 1 })
    } else {
      const productFound = orderProducts[index]
      updateProduct(index, { ...productFound, quantity: productFound.quantity + 1 })
    }
  }

  const handelRemoveOrderProduct = (id) => {
    const index = orderProducts.findIndex((p) => p._id === id)
    if (index !== -1) {
      removeProduct(index)
    }
  }

  const handleQuantityChange = (index, value) => {
    const productFound = orderProducts[index]
    updateProduct(index, { ...productFound, quantity: value })
  }

  return (
    <FormProvider {...methods}>
      <div className="h-[95%] mx-5 grid grid-rows-5 gap-4">
        <div className="grid grid-cols-12 gap-4 h-full w-full row-span-3">
          <Card className="h-full col-span-5 overflow-y-auto">
            <OrderTable
              orderProducts={orderProducts}
              handelRemoveOrderProduct={handelRemoveOrderProduct}
              handleQuantityChange={handleQuantityChange}
            />
          </Card>
          <Card className="h-full col-span-1">2</Card>
          <Card className="h-full col-span-6">
            <PriceCard />
          </Card>
        </div>
        <div className="row-span-2">
          <Card className="h-full overflow-y-auto">
            <Segmented block options={['مشروبات', 'حلويات']} className="mb-5" />
            <Products handelAppendOrderProduct={handelAppendOrderProduct} />
          </Card>
        </div>
      </div>
    </FormProvider>
  )
}

export default Home
