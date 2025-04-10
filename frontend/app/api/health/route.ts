import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Attempting to connect to backend health endpoint...');
    
    // Forward the request to the backend with CORS headers
    const response = await fetch('http://127.0.0.1:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add a timeout to avoid hanging requests
      signal: AbortSignal.timeout(5000)
    });

    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error response:', errorData);
      return NextResponse.json(
        { error: errorData.message || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend health data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check failed:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to connect to backend service', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
