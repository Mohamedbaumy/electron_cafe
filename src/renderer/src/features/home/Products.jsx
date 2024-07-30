import { Button, Space } from 'antd'

const Products = ({ handelAppendOrderProduct }) => {
  const products = [
    { id: 1, name: 'قهوة تركية', price: 15 },
    { id: 2, name: 'شاي بالنعناع', price: 10 },
    { id: 3, name: 'عصير برتقال طازج', price: 20 },
    { id: 4, name: 'كابتشينو', price: 25 },
    { id: 5, name: 'شاي كرك', price: 18 },
    { id: 6, name: 'عصير ليمون بالنعناع', price: 22 },
    { id: 7, name: 'قهوة فرنسية', price: 20 },
    { id: 8, name: 'عصير مانجو', price: 25 },
    { id: 9, name: 'قهوة أمريكية', price: 15 },
    { id: 10, name: 'عصير فراولة', price: 20 },
    { id: 11, name: 'شاي بالحليب', price: 12 },
    { id: 12, name: 'موكا', price: 30 },
    { id: 13, name: 'عصير جوافة', price: 20 },
    { id: 14, name: 'قهوة اسبريسو', price: 18 },
    { id: 15, name: 'شاي أخضر', price: 10 },
    { id: 16, name: 'عصير قصب', price: 10 },
    { id: 17, name: 'شوكولاتة ساخنة', price: 25 },
    { id: 18, name: 'عصير أناناس', price: 22 },
    { id: 19, name: 'قهوة لاتيه', price: 28 },
    { id: 20, name: 'شاي زنجبيل', price: 12 },
    { id: 21, name: 'عصير رمان', price: 25 },
    { id: 22, name: 'نيسكافيه', price: 15 },
    { id: 23, name: 'شاي بالياسمين', price: 12 },
    { id: 24, name: 'عصير تفاح', price: 22 },
    { id: 25, name: 'قهوة مثلجة', price: 30 },
    { id: 26, name: 'شاي مثلج', price: 15 },
    { id: 27, name: 'عصير كيوي', price: 25 },
    { id: 28, name: 'حليب بالتمر', price: 20 },
    { id: 29, name: 'عصير بطيخ', price: 18 },
    { id: 30, name: 'عصير ليمون', price: 12 },
    { id: 31, name: 'سحلب', price: 25 },
    { id: 32, name: 'عصير موز بالحليب', price: 22 },
    { id: 33, name: 'عصير جزر', price: 20 },
    { id: 34, name: 'قهوة عربية', price: 18 },
    { id: 35, name: 'عصير برقوق', price: 20 }
  ]

  return (
    <div className="grid grid-cols-6 gap-2">
      {products.map((product, index) => (
        <Button
          key={product.id}
          onClick={() => {
            handelAppendOrderProduct(product.id, product)
          }}
        >
          <p className="truncate">{product.name}</p>
        </Button>
      ))}
    </div>
  )
}

export default Products
