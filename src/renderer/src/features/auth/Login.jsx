import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Spin, message, Form, Button } from 'antd'
import lightLogo from '/assets/logo-light.png'

import { login } from '../api'
import { useMutation } from '@tanstack/react-query'

import { DefaultInput, PasswordInput } from '@/components'

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      message.success('تم تسجيل الدخول بنجاح')
      const { token, user, refreshToken } = data
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    },
    onError: (error) => {
      console.log(error)
      message.error('اسم المستخدم او كلمة المرور غير صحيحة')
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    console.log(data)
    await loginMutation(data)
    setLoading(false)
  }

  return (
    <>
      {isPending && (
        <Spin
          fullscreen={true}
          size="large"
          tip={<span className="text-3xl text-white">جاري تنزيل البيانات</span>}
          wrapperClassName="fixed"
        />
      )}
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="flex flex-col gap-3">
        <div className="pointer-events-none flex justify-center">
          <img loading="lazy" src={lightLogo} alt="UNILAB SYSTEM" className="w-40" />
        </div>
        <br />
        <Controller
          name="username"
          control={control}
          defaultValue=""
          rules={{ required: 'يجب ادخال اسم المستخدم' }}
          render={({ field, ref }) => (
            <DefaultInput
              label="اسم المستخدم"
              {...field}
              error={errors.username?.message}
              ref={ref}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: 'يجب ادخال كلمة المرور' }}
          render={({ field, ref }) => (
            <PasswordInput
              label="كلمة المرور"
              {...field}
              error={errors.password?.message}
              ref={ref}
            />
          )}
        />
        <Button htmlType="submit">{loading ? <Spin /> : 'تسجيل الدخول'}</Button>
      </Form>
    </>
  )
}

export default Login
