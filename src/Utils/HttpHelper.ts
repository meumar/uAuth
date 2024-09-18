import { CustomError } from "../Exceptions/customError";

export const sendApiCall = async (
  method: string,
  url: string,
  data: any = null,
  headers: any = {}
) => {
  try {
    let fullUrl = url;
    let options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (method.toUpperCase() === "GET" && data) {
      const queryParams = new URLSearchParams(data).toString();
      fullUrl += `?${queryParams}`;
    } else if (method.toUpperCase() !== "GET") {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new CustomError(
        `sendApiCall error! Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
