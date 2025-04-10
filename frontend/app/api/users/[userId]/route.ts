import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    // 使用await处理params
    const params = await context.params;
    const userId = params.userId;
    console.log(`Getting user profile for userId: ${userId}`);
    
    // Forward the request to the backend
    const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
    });

    console.log('Backend user profile response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend user profile error response:', errorData);
      return NextResponse.json(
        { error: errorData.message || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend user profile data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('User profile error:', error);
    return NextResponse.json(
      { error: '获取用户资料失败', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    // 使用await处理params
    const params = await context.params;
    const userId = params.userId;
    const body = await request.json();
    console.log(`Updating user profile for userId: ${userId}`, body);
    
    // Forward the request to the backend
    const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(body),
    });

    console.log('Backend user update response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend user update error response:', errorData);
      return NextResponse.json(
        { error: errorData.message || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend user update data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: '更新用户资料失败', details: String(error) },
      { status: 500 }
    );
  }
}
