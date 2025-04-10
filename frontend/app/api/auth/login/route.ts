import { NextResponse } from 'next/server';
import { backendUrl } from '../../../../lib/config/server-api-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Direct connection to the backend with proper timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(body),
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    // Return the response with the expected structure:
    // { data: { email, name, userId }, message: "...", success: true/false }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: '登录失败，请稍后再试',
        error: String(error)
      },
      { status: 500 }
    );
  }
}
