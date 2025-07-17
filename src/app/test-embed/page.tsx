export default function TestEmbedPage() {
  return (
    <html lang="ar">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>اختبار تضمين البوت - Sanad Bot</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
          }

          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .header p {
            font-size: 1.2rem;
            opacity: 0.9;
          }

          .content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
          }

          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
          }

          .feature {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            transition: transform 0.3s ease;
          }

          .feature:hover {
            transform: translateY(-5px);
            border-color: #667eea;
          }

          .feature h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3rem;
          }

          .bot-info {
            background: #e8f4f8;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
            border-left: 5px solid #667eea;
          }

          .bot-info h3 {
            color: #667eea;
            margin-bottom: 15px;
          }

          .info-item {
            margin-bottom: 10px;
            font-family: monospace;
            background: white;
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid #ddd;
          }

          .instruction {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
            color: #856404;
          }

          @media (max-width: 768px) {
            .header h1 {
              font-size: 2rem;
            }
            
            .content {
              padding: 20px;
            }
            
            .features {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>🤖 اختبار تضمين البوت</h1>
            <p>صفحة تجريبية لاختبار كيفية ظهور البوت في المواقع الخارجية</p>
          </div>

          <div className="content">
            <div className="features">
              <div className="feature">
                <h3>🎯 الهدف من الاختبار</h3>
                <p>التأكد من أن البوت يظهر بنفس الشكل والتصميم المطور داخل المنصة</p>
              </div>
              
              <div className="feature">
                <h3>🔧 المكونات المطلوبة</h3>
                <p>الزر العائم، نافذة المحادثة، والتخصيصات الخاصة بالعميل</p>
              </div>
              
              <div className="feature">
                <h3>✅ النتيجة المتوقعة</h3>
                <p>تجربة مطابقة 100% لما يراه العميل في لوحة التحكم</p>
              </div>
            </div>

            <div className="bot-info">
              <h3>📋 معلومات البوت المضمن:</h3>
              <div className="info-item">
                <strong>Bot ID:</strong> cmd6zy2o3000mvpl85isweckl
              </div>
              <div className="info-item">
                <strong>Server:</strong> http://localhost:3002
              </div>
              
              <div className="instruction">
                🔍 ابحث عن أيقونة المساعد العائمة في الزاوية اليمنى السفلى من الشاشة
              </div>
            </div>
          </div>
        </div>

        <script 
          src="http://localhost:3002/embed.js" 
          data-bot-id="cmd6zy2o3000mvpl85isweckl"
        ></script>
      </body>
    </html>
  );
}