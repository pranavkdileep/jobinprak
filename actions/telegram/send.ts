"use server";

export interface TelegramResult {
  success: boolean;
  message: string;
}

export async function sendTelegramMessage(
  username: string,
  message: string
): Promise<TelegramResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn("TELEGRAM_BOT_TOKEN not set — falling back to mock mode.");
    console.log(`[Mock Telegram] To: ${username}, Message: ${message}`);
    return { success: true, message: `Mock message sent to ${username}` };
  }

  const chatId = username;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      const desc = data.description || "Unknown error";
      console.error(`[Telegram] API error for ${username}: ${desc}`);
      return {
        success: false,
        message: `Telegram API error: ${desc}`,
      };
    }

    return { success: true, message: `Message sent to @${username}` };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Telegram] Failed to send to ${username}: ${errorMessage}`);
    return {
      success: false,
      message: `Failed to send message: ${errorMessage}`,
    };
  }
}