// src/analytics/trackUmamiEvents.ts

import dotenv from "dotenv";
dotenv.config();

const umamiUrl = process.env.UMAMI_URL;
const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;

export const trackUmamiEvent = async (
  eventName: string,
  eventData: object,
) => {
  try {
    if (!umamiUrl || !umamiWebsiteId) {
      console.error("Umami URL or Website ID is missing");
      return;
    }

    const data = eventData;

    const payload = {
      payload: {
        website: umamiWebsiteId,
        hostname: "MyProject.com",
        language: "en-US",
        referrer: "",
        screen: "",
        title: "MyProject",
        url: "/",
        name: eventName,
        data: data,
      },
      type: "event",
    };

    const response = await fetch(umamiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; WebApp/1.0)",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error tracking Umami event: ${errorData.message}`);
    }
  } catch (error: any) {
    console.error("Error tracking Umami event:", error.message);
  }
};
