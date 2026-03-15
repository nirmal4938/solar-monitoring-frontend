// src/services/alertRuleService.js

import axiosInstance from "./axiosInstance";

const BASE_URL = "/alert-rules";

export const alertRuleService = {

  /* ===============================
     GET ALL RULES BY PLANT
  =============================== */
  async getPlantRules(plantId) {
    const res = await axiosInstance.get(
      `${BASE_URL}/plant/${plantId}`
    );
    return res.data.data;
  },

  /* ===============================
     GET SINGLE RULE
  =============================== */
  async getRule(ruleId) {
    const res = await axiosInstance.get(
      `${BASE_URL}/${ruleId}`
    );
    return res.data.data;
  },

  /* ===============================
     CREATE RULE
  =============================== */
  async createRule(payload) {
    const res = await axiosInstance.post(
      BASE_URL,
      payload
    );
    return res.data.data;
  },

  /* ===============================
     UPDATE RULE
  =============================== */
  async updateRule(ruleId, payload) {
    const res = await axiosInstance.put(
      `${BASE_URL}/${ruleId}`,
      payload
    );
    return res.data.data;
  },

  /* ===============================
     DELETE RULE
  =============================== */
  async deleteRule(ruleId) {
    const res = await axiosInstance.delete(
      `${BASE_URL}/${ruleId}`
    );
    return res.data.success;
  },

  /* ===============================
     TOGGLE ACTIVE / INACTIVE
  =============================== */
  async toggleRule(ruleId) {
    const res = await axiosInstance.patch(
      `${BASE_URL}/${ruleId}/toggle`
    );
    return res.data.data;
  },

  /* ===============================
     CLONE RULE
  =============================== */
  async cloneRule(ruleId) {
    const res = await axiosInstance.post(
      `${BASE_URL}/${ruleId}/clone`
    );
    return res.data.data;
  },

  /* ===============================
     BULK STATUS UPDATE
  =============================== */
  async bulkStatus(ids, is_active) {
    const res = await axiosInstance.post(
      `${BASE_URL}/bulk-status`,
      { ids, is_active }
    );
    return res.data.success;
  },

  /* ===============================
     TEST RULE
  =============================== */
  async testRule(ruleId, testPayload) {
    const res = await axiosInstance.post(
      `${BASE_URL}/${ruleId}/test`,
      testPayload
    );
    return res.data.result;
  }
};