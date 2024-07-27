import { QueryTypes } from 'sequelize'
import sequelize from '../config/db.js'
import fs from 'node:fs'
import path from 'node:path'
import dns from 'node:dns'

import Tube from './../models/Tube.js'
import TubeTest from './../models/TubeTest.js'
import TestAlias from './../models/TestAlias.js'
import { Doctor } from './../models/Doctor.js'
import Invoice from './../models/Invoice.js'
import Patient from './../models/Patient.js'
import Test from './../models/Test.js'
import User from './../models/User.js'
import Visit from './../models/Visit.js'
import Package from './../models/Package.js'
import PackageTests from './../models/PackageTests.js'
import VisitPackage from './../models/VisitPackage.js'
import VisitTest from './../models/VisitTest.js'
import InvoiceWorker from './../models/InvoiceWorker.js'
import Group from './../models/Group.js'
import Lab from './../models/Lab.js'
import models from '../models/index.js'
import axios from 'axios'

// Function to check data
export async function checkData() {
  if (!(await isConnectedToInternet())) {
    return
  }
  const tubes = await Tube.findAll({ attributes: ['id'] })
  const tubeTests = await TubeTest.findAll({ attributes: ['id'] })
  const aliases = await TestAlias.findAll({ attributes: ['id'] })
  const groups = await Group.findAll({ attributes: ['id'] })
  const units = await models.Unit.findAll({ attributes: ['id'] })
  const kitsUnits = await models.KitUnit.findAll({ attributes: ['id'] })
  const devices = await models.Devices.findAll({ attributes: ['id'] })
  const kits = await models.Kits.findAll({ attributes: ['id'] })
  const departments = await models.Partment.findAll({ attributes: ['id'] })
  const categories = await models.Category.findAll({ attributes: ['id'] })

  const data = {
    tube: tubes.map((tube) => `${tube.id}`),
    test_alias: aliases.map((alias) => `${alias.id}`),
    system_group_name: groups.map((group) => `${group.id}`),
    tube_test: tubeTests.map((test) => `${test.id}`),
    lab_test_units: units.map((unit) => `${unit.id}`),
    lab_kit_unit: kitsUnits.map((kitUnit) => `${kitUnit.id}`),
    devices: devices.map((device) => `${device.id}`),
    kits: kits.map((kit) => `${kit.id}`),
    lab_doctor_partment: departments.map((department) => `${department.id}`),
    lab_test_catigory: categories.map((category) => `${category.id}`)
  }

  const url = 'http://umc.native-code-iq.com/app/index.php/data/get_new_data'
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  const result = await insertLabDataHelper(response.data)
  return result
}

// Function to insert lab data
export async function insertLabData(username, password) {
  try {
    const url = 'http://umc.native-code-iq.com/app/index.php/data/get_lab_data'
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const result = await insertLabDataHelper(response.data)
    return result
  } catch (error) {
    console.error('Request failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Helper function to insert lab data
export async function insertLabDataHelper(data) {
  const result = {
    success: false,
    error: null
  }
  const transaction = await sequelize.transaction()
  try {
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'lab':
          await Lab.bulkCreate(value, { transaction })
          break
        case 'lab_doctor':
          await Doctor.bulkCreate(value, { transaction })
          break
        case 'lab_invoice':
          for (const invoice of value) {
            if (invoice.logo?.startsWith('http')) {
              const localPath = await downloadImage(invoice.logo)
              if (localPath) {
                invoice.logo = localPath
              }
            }
          }
          await Invoice.bulkCreate(value, { transaction })
          break
        case 'lab_invoice_worker':
          await InvoiceWorker.bulkCreate(value, { transaction })
          break
        case 'lab_package':
          await Package.bulkCreate(value, { transaction })
          break
        case 'lab_pakage_tests':
          await PackageTests.bulkCreate(value, { transaction })
          break
        case 'lab_patient':
          await Patient.bulkCreate(value, { transaction })
          break
        case 'lab_visits':
          await Visit.bulkCreate(value, { transaction })
          break
        case 'lab_visits_package':
          await VisitPackage.bulkCreate(value, {
            transaction,
            updateOnDuplicate: ['visit_id', 'package_id']
          })
          break
        case 'lab_visits_tests':
          await VisitTest.bulkCreate(value, {
            transaction,
            updateOnDuplicate: ['visit_id', 'test_id']
          })
          break
        case 'system_users':
          await User.bulkCreate(value, { transaction })
          break
        case 'lab_test':
          await Test.bulkCreate(value, { transaction })
          break
        case 'tube':
          await Tube.bulkCreate(value, { transaction })
          break
        case 'test_alias':
          await TestAlias.bulkCreate(value, { transaction })
          break
        case 'system_group_name':
          await Group.bulkCreate(value, { transaction })
          break
        case 'tube_test':
          await TubeTest.bulkCreate(value, {
            transaction,
            updateOnDuplicate: ['test_id', 'tube_id']
          })
          break
        case 'lab_test_units':
          await models.Unit.bulkCreate(value, { transaction })
          break
        case 'lab_kit_unit':
          await models.KitUnit.bulkCreate(value, {
            transaction,
            updateOnDuplicate: ['kit', 'unit']
          })
          break
        case 'devices':
          await models.Devices.bulkCreate(value, { transaction })
          break
        case 'kits':
          await models.Kits.bulkCreate(value, { transaction })
          break
        case 'lab_doctor_partment':
          await models.Partment.bulkCreate(value, { transaction })
          break
        case 'lab_test_catigory':
          await models.Category.bulkCreate(value, { transaction })
          break
        default:
          break
      }
    }
    await transaction.commit()
    result.success = true
  } catch (error) {
    await transaction.rollback()
    result.error = error.message
  }
  return result
}

// Function to install rest data
export async function installRest() {
  // check internet connect with dns
  if (!(await isConnectedToInternet())) {
    return
  }

  const ids = await getSmallestId()
  const url = 'http://umc.native-code-iq.com/app/index.php/data/install_rest'
  const formData = new FormData()
  for (const key in ids) {
    if (Object.hasOwnProperty.call(ids, key)) {
      formData.append(key, JSON.stringify(ids[key]))
    }
  }
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  const result = await insertLabDataHelper(response.data)
  return result
}

const isConnectedToInternet = async () => {
  return new Promise((resolve, reject) => {
    dns.lookup('google.com', (err) => {
      if (err && err.code === 'ENOTFOUND') {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

// Function to get smallest ID from tables
export async function getSmallestId() {
  const tables = ['lab', 'lab_patient', 'lab_visits', 'lab_visits_package', 'lab_visits_tests']
  const data = {}
  for (const table of tables) {
    const result = await sequelize.query(`SELECT id FROM ${table} ORDER BY id ASC LIMIT 1`, {
      type: QueryTypes.SELECT
    })
    data[table] = result[0]?.id || 1
  }
  return data
}

export async function downloadImage(url) {
  const uploadDir = 'uploads'
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const fileName = path.basename(url)
  const filePath = path.join(uploadDir, fileName)

  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    })

    const writer = fs.createWriteStream(filePath)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath))
      writer.on('error', reject)
    })
  } catch (error) {
    console.error('Failed to download logo:', error)
    return null
  }
}
