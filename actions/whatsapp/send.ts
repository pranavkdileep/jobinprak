"use server";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
    try {
        console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
        return { success: false };
    }
}