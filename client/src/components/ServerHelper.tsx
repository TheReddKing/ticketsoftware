export enum ServerURL {
  get = "/api/v1/ticket/get",
  add = "/api/v1/ticket/add",
  login = "/api/v1/login"
}
const ServerHelper = {
  post: async (
    url: ServerURL,
    data: any
  ): Promise<{ success: boolean; [key: string]: any }> => {
    try {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const response = await fetch(url, config);
      if (response.ok) {
        const json = await response.json();
        return json;
      }
    } catch (error) {}
    return { success: false };
  }
};

export default ServerHelper;
