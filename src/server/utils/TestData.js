export default class TestData {
  constructor(test, fontSize) {
    this.test = test
    this.fontSize = fontSize || 12
    this.dependOn = []
    this.calc = {}
    try {
      const data = JSON.parse(test.option_test)
      this.test_type = Number(test.test_type) || 0
      switch (this.test_type) {
        case 0:
        case 3: {
          const reference = data.component[0].reference
          this.data = reference.map((ref) => {
            return {
              kit: ref.kit ?? null,
              unit: ref.unit ?? null,
              range: ref.range,
              gender: ref.gender === 'كلاهما' ? 'B' : ref.gender === 'ذكر' ? 'M' : 'F',
              result_type: ref.result,
              options: ref.result === 'select' ? ref.options : undefined,
              correct_options: ref.result === 'select' ? ref.right_options : undefined,
              age: {
                low: ref['age low'],
                low_unit: ref['age unit low'],
                high: ref['age high'],
                low_high: ref['age unit high']
              }
            }
          })
          break
        }
        case 1:
        case 2: {
          const reference = data.component
          this.data = reference.map((item) => {
            const ref = item.reference[0]

            return {
              name: item.name,
              unit: item.unit ?? null,
              type: item.type,
              multi: !!item.multi,
              calc: !!item.calc,
              eq: item.calc ? item.eq : undefined,
              range: ref.range ?? [],
              gender: ref.gender === 'كلاهما' ? 'B' : ref.gender === 'ذكر' ? 'M' : 'F',
              result_type: item.result,
              options: item.result === 'result' ? item.options : undefined,
              correct_options:
                item.result === 'result'
                  ? item.right_options
                    ? item.right_options
                    : item.options.slice(0, 1)
                  : undefined,
              age: {
                low: ref['age low'],
                low_unit: ref['age unit low'],
                high: ref['age high'],
                low_high: ref['age unit high']
              }
            }
          })
          break
        }
        default:
          console.log('Invalid test type')
          this.data = []
      }
    } catch (err) {
      console.log(err)
      this.data = []
      this.test_type = 0
    }
  }

  filter(kitFilter, unitFilter, ageFilter, genderFilter) {
    if (this.test_type !== 0 && this.test_type !== 3) return
    try {
      const kit = kitFilter ?? null
      const unit = unitFilter ?? null
      const age = ageFilter ?? 0 * 365
      const gender = genderFilter === 'ذكر' ? 'M' : 'F'
      const filteredData = this.data.filter((ref) => {
        let result = true
        const ageLow =
          ref.age.low * (ref.age.low_unit === 'عام' ? 365 : ref.age.low_unit === 'شهر' ? 30 : 1)
        const ageHigh =
          ref.age.high * (ref.age.high_unit === 'عام' ? 365 : ref.age.high_unit === 'شهر' ? 30 : 1)
        if (isNull(kit) || isNull(ref.kit)) {
          result = result && kit === ref.kit
        }
        if (isNull(unit) || isNull(ref.unit)) {
          result = result && unit === ref.unit
        }
        result = result && age >= ageLow && age <= ageHigh
        result = result && (gender === ref.gender || ref.gender === 'B')
        return result
      })
      this.data = filteredData[0] ?? {}
    } catch (err) {
      console.log(err)
      return []
    }
  }

  getResult() {
    try {
      const resultData = JSON.parse(this.test.result)
      if (this.test_type === 0 || this.test_type === 3) {
        const { name, range, result_type, correct_options, multi } = this.data
        const result = resultData[name] || ''
        switch (result_type) {
          case 'select':
          case 'result':
            this.data.result = {
              result,
              flag: correct_options.includes(result) || !result ? '' : 'R',
              checked: result.checked ?? true
            }
            break
          default: {
            const correctOptions = range
              ? range.length === 1
                ? range[0]
                : range.filter((r) => {
                    return r.correct
                  })[0]
              : { low: 0, high: 0 }
            const { low, high } = correctOptions
            // check if result between low and high
            this.data.result = {
              result,
              flag: (result >= low && result <= high) || !result ? '' : result < low ? 'L' : 'H',
              checked: result.checked ?? true
            }
            break
          }
        }
      } else if (this.test_type === 1 || this.test_type === 2) {
        this.data = this.data.map((item) => {
          const { name, range, result_type, correct_options, calc } = item
          const result = Number(resultData[name]) || ''
          if (calc) {
            this.dependOn = [...this.dependOn, ...item.eq]
            this.calc[name] = item.eq
          }
          switch (result_type) {
            case 'number':
            case 'text': {
              const correctOptions = range
                ? range.length === 1
                  ? range[0]
                  : range.filter((r) => {
                      return r.correct
                    })[0]
                : { low: 0, high: 0 }
              const { low, high } = correctOptions
              // check if result between low and high
              item.result = {
                result,
                flag: (result >= low && result <= high) || !result ? '' : result < low ? 'L' : 'H'
              }
              break
            }
            case 'select':
            case 'result':
              item.result = {
                result,
                flag: correct_options.includes(result) || !result ? '' : 'R'
              }
              break
            default:
              console.log('Invalid result type in getResult')
              return item
          }
          return item
        })
      }
    } catch (err) {
      console.log(err)
      return []
    }
  }

  getHeight(rangesLength) {
    const nameLength = Math.ceil((this?.test?.name?.length || 1) / 15)
    const max = Math.max(rangesLength, nameLength)
    let height = 1.572 * this.fontSize - 0.013
    height = height * max ?? height
    return Math.round(height * 100) / 100
  }

  get() {
    return this.data
  }

  getDependOn() {
    const results = {}
    const uniqueCalc = Array.from(new Set(this.dependOn))
    const operations = ['(', ')', '*', '/', '+', '-']
    const filteredCalc = uniqueCalc.filter(
      (item) => !operations.includes(item) && Number.isNaN(Number(item))
    )
    for (const item of this.data) {
      const {
        name,
        result: { result }
      } = item
      if (filteredCalc.includes(name)) {
        results[name] = result
      }
    }
    return results
  }

  getCalc() {
    return this.calc
  }
}

function isNull(value) {
  return !(
    value === null ||
    value === '' ||
    value === 'null' ||
    value === 'undefined' ||
    value === '0' ||
    value === 0
  )
}
