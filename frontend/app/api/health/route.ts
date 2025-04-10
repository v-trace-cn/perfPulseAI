import { NextResponse } from 'next/server';
import { backendUrl } from '../../../lib/config/server-api-config';

export async function GET() {
  const testUrl = `${backendUrl}/api/health`;
  console.log(`正在测试后端连接: ${testUrl}`);

  try {
    // 测试性请求，添加详细日志
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Origin': 'http://192.168.2.13:3000' // 确保与前端地址一致
      }
    });

    console.log(`后端响应状态: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('后端健康检查响应:', data);
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': 'http://192.168.2.13:3000'
      }
    });
  } catch (error) {
    console.error('连接测试失败:', {
      error: (error as Error).message,
      attemptedUrl: testUrl,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      {
        success: false,
        message: '后端连接测试失败',
        diagnostic: {
          backendUrl: testUrl,
          error: (error as Error).message,
          suggestion: '请检查后端服务是否运行以及CORS配置'
        }
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://192.168.2.13:3000'
        }
      }
    );
  }
}