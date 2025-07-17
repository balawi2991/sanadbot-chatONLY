(function() {
  // التحقق من وجود معرف البوت
  const script = document.currentScript;
  const botId = script.getAttribute('data-bot-id');
  
  if (!botId) {
    console.error('SanadBot: Bot ID is required. Please add data-bot-id attribute to the script tag.');
    return;
  }

  // إنشاء iframe للبوت
  function createBotIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = `${script.src.replace('/embed.js', '')}/embed/${botId}`;
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 999998;
      background: transparent;
      pointer-events: none;
    `;
    iframe.id = 'sanadbot-iframe';
    
    // السماح بالتفاعل مع العناصر داخل iframe
    iframe.onload = function() {
      iframe.style.pointerEvents = 'auto';
    };
    
    return iframe;
  }

  // لا حاجة لإنشاء زر مخصص - ChatWidget سيعرض الزر الأصلي

  // إدارة حالة البوت
  let isOpen = false;
  let iframe = null;

  function openBot() {
    if (isOpen) return;
    
    isOpen = true;
    iframe = createBotIframe();
    document.body.appendChild(iframe);
  }

  function closeBot() {
    if (!isOpen) return;
    
    isOpen = false;
    
    if (iframe) {
      document.body.removeChild(iframe);
      iframe = null;
    }
  }

  // الاستماع للرسائل من iframe
  window.addEventListener('message', function(event) {
    if (event.data === 'sanadbot-close') {
      closeBot();
    }
  });

  // الاستماع لضغطة مفتاح Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isOpen) {
      closeBot();
    }
  });

  // تشغيل البوت مباشرة عند تحميل الصفحة
  function initBot() {
    openBot();
  }

  // تشغيل البوت عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBot);
  } else {
    initBot();
  }

  // إضافة API عام للتحكم في البوت
  window.SanadBot = {
    close: closeBot,
    isOpen: function() {
      return isOpen;
    }
  };
})();