class CalcTest {
  constructor(tests) {
    const calcTests = tests.filter((test) => {
      return tests.test_type === 3
    })
  }

  get() {
    return this.tests
  }
}
