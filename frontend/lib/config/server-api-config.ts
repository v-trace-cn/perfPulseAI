// 强制指定所有环境的API地址
export const getBackendUrl = (): string => {
  // 开发环境直接使用本地IP地址
  if (process.env.NODE_ENV !== 'production') {
    return 'http://192.168.2.13:5006'; // 确保与您后端实际地址一致
  }
  return 'https://api.perfpulseai.com'; // 生产环境地址
};

// 导出直接使用的URL
export const backendUrl = getBackendUrl();

// 增强的fetch函数（保留原有实现）
export async function serverFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API请求失败: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}