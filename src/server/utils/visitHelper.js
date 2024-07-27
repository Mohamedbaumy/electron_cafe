// utils/visitHelper.js

import moment from "moment";
import { createHash } from "./hashHelper.js";

const getBirthDate = (age) => {
  const ageInDays = age * 365;
  const birth = moment().subtract(ageInDays, "days").format("YYYY-MM-DD");
  return birth;
};

const getAge = (ageYear, ageMonth, ageDay) => {
  const ageInDays = ageYear * 365 + ageMonth * 30 + ageDay;
  return Number.parseFloat((ageInDays / 365).toFixed(3));
};

const splitData = (data) => {
  const ageMonth = data.age_month || 0;
  const ageDay = data.age_day || 0;
  const ageYear = data.age_year || 0;
  const age = getAge(ageYear, ageMonth, ageDay);
  const birth = getBirthDate(age);

  const doctorHash = data.doctor_hash || "";
  const address = data.address || "";
  const phone = data.phone || "";
  const visitsPatientId = data.patient || createHash();
  const note = data.note || "";
  const discount = data.discount || 0;
  const netPrice = data.net_price || 0;
  const totalPrice = data.total_price || 0;
  const tests = data.tests || "[]";
  const gender = data.gender || "ذكر";

  const patientData = {
    birth,
    age_year: ageYear,
    age_month: ageMonth,
    age_day: ageDay,
    gender,
    address,
    phone,
    hash: visitsPatientId,
  };

  if (data.name) {
    patientData.name = data.name;
  }

  const visitHash = data.hash || createHash();
  const visitData = {
    visits_patient_id: visitsPatientId,
    visit_date: data.visit_date,
    doctor_hash: doctorHash,
    visits_status_id: 2,
    note,
    total_price: totalPrice,
    dicount: discount,
    net_price: netPrice,
    age,
    hash: visitHash,
  };

  return {
    tests,
    patient: patientData,
    visit: visitData,
  };
};

const bothIsset = (var1, var2) => {
  return !var1 && !var2;
};

const checkGender = (gender1, gender2) => {
  const modifiedGender1 = gender1.replace("ى", "ي");
  const modifiedGender2 = gender2.replace("ى", "ي");
  return (
    modifiedGender1 === modifiedGender2 ||
    modifiedGender1 === "كلاهما" ||
    modifiedGender2 === "كلاهما"
  );
};

const checkAge = (age, low, high) => {
  return age >= low && age <= high;
};

export { splitData, bothIsset, checkGender, checkAge };
