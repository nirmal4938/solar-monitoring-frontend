import axiosInstance from "./axiosInstance";

const alertService = {

  /**
   * Get ACTIVE alerts for a plant
   * GET /alerts/plant/:plantId/active
   */
  getActiveAlerts: async (plantId) => {
    const { data } = await axiosInstance.get(
      `/alerts/plant/${plantId}/active`
    );
    return data;
  },

  /**
   * Get ALERT HISTORY for a plant
   * GET /alerts/plant/:plantId/history
   */
  getAlertHistory: async (plantId) => {
    const { data } = await axiosInstance.get(
      `/alerts/plant/${plantId}/history`
    );
    return data;
  },

  /**
   * Acknowledge alert
   * PATCH /alerts/:alertId/acknowledge
   */
  acknowledgeAlert: async (alertId) => {
    const { data } = await axiosInstance.patch(
      `/alerts/${alertId}/acknowledge`
    );
    return data;
  },

  /**
   * Manually resolve alert
   * PATCH /alerts/:alertId/resolve
   */
  resolveAlert: async (alertId) => {
    const { data } = await axiosInstance.patch(
      `/alerts/${alertId}/resolve`
    );
    return data;
  }

};

export default alertService;