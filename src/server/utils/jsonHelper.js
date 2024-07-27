export default class JsonHelper {
  constructor(string) {
    const json = JSON.parse(string)
    let references = []
    this.type = json.type || 'normal'
    this.default_reference = json

    this.value = this.type === 'calc' && json.value ? json.value : null

    this.result_type = 'number'
    if (json.component) {
      if (this.type === 'calc' || this.type === 'normal') {
        json.component =
          Array.isArray(json.component) && json.component.length > 0 ? json.component[0] : {}
        this.result_type = json.component.result || 'number'
      }
    } else {
      json.component = {}
    }

    if (json.component.reference) {
      references = json.component.reference
    }

    this.json = json.component
    this.references = references.map((reference, index) => {
      if (!reference.id) {
        reference.id = index
      }
      return reference
    })
  }

  isNull(value) {
    return (
      value === null ||
      value === '' ||
      value === 'null' ||
      value === 'undefined' ||
      value === '0' ||
      value === 0
    )
  }

  filter(fields) {
    if (['type', 'culture'].includes(this.type)) {
      this.references = this.default_reference
      return this
    }

    this.references = this._filterReferences(this.references, fields).map((reference) => ({
      ...reference,
      result_type: reference.result || this.result_type,
      type: this.type,
      value: this.value
    }))

    return this
  }

  filterToArray(fields) {
    return this._filterReferences(this.references, fields)
  }

  setHeight(font) {
    if (['type', 'culture'].includes(this.type)) {
      return this
    }

    let references = this.references
    let line = this.json.name ? Math.ceil(this.json.name.length / 25) : 1

    if (references.length === 0) {
      references = this.default_reference
      delete references.component
      references.range = []
      references.type = this.type || 'normal'
      references.result_type = this.result_type || 'number'
      references.height = 9 + (references.range.length || 1) * 5.5 + 1.15944 * font
    } else {
      references = references.map((reference) => {
        let height = reference.range
          ? reference.range.reduce((acc, range) => {
              const length =
                (range.name || '').length + (range.low || '').length + (range.high || '').length + 6
              return acc + Math.ceil((font * length * 0.5) / 185)
            }, 1)
          : 1
        height += line
        reference.height = 9.01 + height * 5.5 + 1.14 * font
        return reference
      })
    }

    this.references = references
    return this
  }

  row() {
    if (['type', 'culture'].includes(this.type)) {
      return this.default_reference
    }

    if (!this.references[0]) {
      return this.references
    }

    return this.references.length === 1
      ? this.references[0]
      : this.references.reduce((min, reference) => {
          const def = this._getAgeRange(min).high - this._getAgeRange(min).low
          const newRange = this._getAgeRange(reference).high - this._getAgeRange(reference).low
          return newRange < def ? reference : min
        })
  }

  get() {
    return this.references
  }

  _filterReferences(references, fields) {
    return references.filter((reference) => {
      return Object.entries(fields).every(([key, value]) => {
        if (reference.hasOwnProperty(key) || ['age', 'gender'].includes(key)) {
          if (['kit', 'unit'].includes(key)) {
            value = this.isNull(value) ? null : value
            reference[key] = this.isNull(reference[key]) ? null : reference[key]
          }
          if (key === 'age') {
            const age = value * 365
            const ageRange = this._getAgeRange(reference)
            return age >= ageRange.low && age <= ageRange.high
          } else if (key === 'gender') {
            const gender = reference[key] || 'كلاهما'
            return (
              gender === value ||
              gender === 'كلاهما' ||
              (gender === 'انثى' && value === 'انثي') ||
              (gender === 'انثي' && value === 'انثى')
            )
          } else {
            return Number(reference[key]) === Number(value)
          }
        }
        return false
      })
    })
  }

  _getAgeRange(reference) {
    const units = { عام: 365, شهر: 30 }
    const ageLow = (reference['age low'] || 0) * (units[reference['age unit low']] || 1)
    const ageHigh = (reference['age high'] || 0) * (units[reference['age unit high']] || 1)
    return { low: ageLow, high: ageHigh }
  }
}
