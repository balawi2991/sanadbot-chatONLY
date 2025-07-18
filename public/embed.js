(function() {
  'use strict';
  
  // منع التحميل المتكرر
  if (window.SanadBotLoaded || window.SanadBot) {
    console.warn('SanadBot: Widget already loaded');
    return;
  }
  window.SanadBotLoaded = true;
  
  console.log('SanadBot: Starting widget initialization...');

  // الحصول على معرف البوت من السكريپت
  const currentScript = document.currentScript || document.querySelector('script[data-agent-id]');
  const botId = currentScript?.getAttribute('data-agent-id');
  
  if (!botId) {
    console.error('SanadBot: Bot ID is required. Please add data-agent-id attribute to the script tag.');
    return;
  }

  // إعدادات البوت
  const scriptSrc = currentScript.src;
  const scriptUrl = new URL(scriptSrc);
  const WIDGET_API_URL = `${scriptUrl.protocol}//${scriptUrl.host}/api/widget/${botId}`;
  
  // تحميل البوت مباشرة
  function loadWidget() {
    console.log('SanadBot: Loading widget from:', WIDGET_API_URL);
    const script = document.createElement('script');
    script.src = WIDGET_API_URL;
    script.async = true;
    script.onload = function() {
      console.log('SanadBot: Widget script loaded successfully');
    };
    script.onerror = function() {
      console.error('SanadBot: Failed to load widget from:', WIDGET_API_URL);
    };
    document.head.appendChild(script);
  }

  // تحميل البوت عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }

})();