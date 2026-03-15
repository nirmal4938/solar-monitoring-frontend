import * as Yup from "yup";

export const inverterValidation = Yup.object({

  name: Yup.string().required("Inverter name required"),

  manufacturer: Yup.string().nullable(),

  model: Yup.string().nullable(),

  serial_number: Yup.string().nullable(),

  capacity_kw: Yup.number().required().positive(),

  status: Yup.string().required("Status required"),

  mppt_count: Yup.number().nullable(),

  string_count: Yup.number().nullable(),

  efficiency_pct: Yup.number().nullable(),

  nominal_ac_voltage_v: Yup.number().nullable(),

  installation_date: Yup.date().nullable(),

  warranty_expiry_date: Yup.date().nullable()

});