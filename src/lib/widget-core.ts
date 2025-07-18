/**
 * نظام إدارة الويدجت المركزي
 * يوحد منطق البوت بين React Component و Embed System
 */

import { prisma } from './prisma'

// أنواع البيانات المشتركة
export interface BotConfig {
  id: string
  name: string
  color: string
  logo?: string
  avatar?: string
  placeholder: string
  welcomeMessage: string
  personality: string
  isActive: boolean
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface ChatResponse {
  response: string
  responseType: 'qa' | 'rag' | 'fallback'
  botName: string
}

// فئة إدارة الويدجت المركزية
export class WidgetCore {
  private static instance: WidgetCore
  private botConfigs: Map<string, BotConfig> = new Map()

  private constructor() {}

  static getInstance(): WidgetCore {
    if (!WidgetCore.instance) {
      WidgetCore.instance = new WidgetCore()
    }
    return WidgetCore.instance
  }

  /**
   * تحميل إعدادات البوت من قاعدة البيانات
   * تم تعطيل الكاش لضمان التحديث الفوري للتخصيصات
   */
  async loadBotConfig(botId: string, useCache: boolean = false): Promise<BotConfig | null> {
    try {
      // التحقق من الكاش فقط إذا تم طلب ذلك صراحة
      if (useCache && this.botConfigs.has(botId)) {
        return this.botConfigs.get(botId)!
      }

      // تحميل من قاعدة البيانات دائماً للحصول على أحدث البيانات
      const bot = await prisma.bot.findUnique({
        where: { id: botId }
      })

      if (!bot || !bot.isActive) {
        // إزالة من الكاش إذا كان غير نشط
        this.botConfigs.delete(botId)
        return null
      }

      const config: BotConfig = {
        id: bot.id,
        name: bot.name,
        color: bot.color,
        logo: bot.logo,
        avatar: bot.avatar,
        placeholder: bot.placeholder,
        welcomeMessage: bot.welcome,
        personality: bot.personality,
        isActive: bot.isActive
      }

      // تحديث الكاش بالبيانات الجديدة
      this.botConfigs.set(botId, config)
      return config
    } catch (error) {
      console.error('Error loading bot config:', error)
      return null
    }
  }

  /**
   * إرسال رسالة والحصول على رد
   */
  async sendMessage(
    message: string,
    botId: string,
    clientId: string = 'anonymous'
  ): Promise<ChatResponse | null> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          botId,
          clientId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  /**
   * تنظيف الكاش
   */
  clearCache(botId?: string) {
    if (botId) {
      this.botConfigs.delete(botId)
    } else {
      this.botConfigs.clear()
    }
  }

  /**
   * إنشاء معرف فريد للعميل
   */
  generateClientId(botId: string, source: 'embed' | 'react' = 'embed'): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `${source}-${botId}-${timestamp}-${random}`
  }

  /**
   * التحقق من صحة معرف البوت
   */
  isValidBotId(botId: string): boolean {
    return typeof botId === 'string' && botId.length > 0
  }

  /**
   * إنشاء رسالة جديدة
   */
  createMessage(text: string, sender: 'user' | 'bot'): Message {
    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text,
      sender,
      timestamp: new Date()
    }
  }
}

// تصدير المثيل الوحيد
export const widgetCore = WidgetCore.getInstance()

// دوال مساعدة للاستخدام المباشر
export async function getBotConfig(botId: string): Promise<BotConfig | null> {
  return widgetCore.loadBotConfig(botId)
}

export async function sendChatMessage(
  message: string,
  botId: string,
  clientId?: string
): Promise<ChatResponse | null> {
  return widgetCore.sendMessage(message, botId, clientId)
}

export function createClientId(botId: string, source: 'embed' | 'react' = 'embed'): string {
  return widgetCore.generateClientId(botId, source)
}