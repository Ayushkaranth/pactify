"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(pactId: string, message: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  if (!message || message.trim() === '') {
    return { success: false, error: "Message cannot be empty." };
  }

  try {
    await connectDB();
    const newChat = new Chat({ pactId, senderId: userId, message });
    await newChat.save();

    revalidatePath(`/dashboard/pacts/${pactId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message." };
  }
}

export async function getMessagesAction(pactId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication failed." };
  }

  try {
    await connectDB();
    const messages = await Chat.find({ pactId }).sort({ createdAt: 1 });
    return { success: true, messages: JSON.parse(JSON.stringify(messages)) };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages." };
  }
}