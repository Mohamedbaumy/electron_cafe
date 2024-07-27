import models from './../models/index.js'

async function clean() {
  try {
    await models.Doctor.truncate()
    await models.Patient.truncate()
    await models.Visit.truncate()
    await models.Package.truncate()
    await models.PackageTests.truncate()
    await models.OfflineSync.truncate()
    await models.User.truncate()
    await models.VisitPackage.truncate()
    await models.VisitTest.truncate()
    await models.InvoiceWorker.truncate()
    await models.Invoice.truncate()
    await models.Expire.truncate()
    await models.Lab.truncate()
    await models.Test.truncate()

    return {
      message: 'تم تنظيف البيانات بنجاح'
    }
  } catch (error) {
    return {
      message: error.message,
      stack: error.stack
    }
  }
}

async function syncDataOnline() {
  // get rows if sync !== 0 1 for inserted rows and 2 for updated rows
  const classes = [
    models.Doctor,
    models.Patient,
    models.Visit,
    models.Package,
    models.PackageTests,
    models.User,
    models.VisitPackage,
    models.VisitTest,
    models.InvoiceWorker,
    models.Invoice,
    models.Test
  ]
  const insertedRows = await classes.reduce(async (acc, cls) => {
    const tableName = cls.getTableName()
    const rows = await cls.findAll({ where: { sync: 1 } })
    return Object.assign({}, await acc, {
      [tableName]: rows
    })
  }, Promise.resolve({}))

  const updatedRows = await classes.reduce(async (acc, cls) => {
    const tableName = cls.getTableName()
    const rows = await cls.findAll({ where: { sync: 2 } })
    return Object.assign({}, await acc, {
      [tableName]: rows
    })
  }, {})
  return {
    insertedRows,
    updatedRows
  }
}

export { clean, syncDataOnline }
