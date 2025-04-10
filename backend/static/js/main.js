// 基本前端脚本
document.addEventListener('DOMContentLoaded', function() {
    // 检查API连接状态
    fetch('/api/activities')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API连接失败');
        })
        .then(data => {
            console.log('API连接成功:', data);
            // 在这里可以初始化前端应用
            initApp();
        })
        .catch(error => {
            console.error('API错误:', error);
            document.querySelector('.loading').innerHTML = `
                <p>连接服务器时出现问题。</p>
                <p>错误信息: ${error.message}</p>
                <button onclick="location.reload()">重试</button>
            `;
        });
});

// 初始化应用
function initApp() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="app-container">
            <header>
                <h1>AI 治理系统</h1>
                <p>下一代 AI 治理与激励机制</p>
            </header>
            <main>
                <div class="card">
                    <h2>欢迎使用</h2>
                    <p>系统正在加载中，请稍候...</p>
                    <p>如果您看到此消息，说明后端API已成功连接，但不保证前端应用已正确加载。</p>
                    <p>请确保您的前端应用已正确配置。</p>
                </div>
            </main>
            <footer>
                <p>&copy; 2025 深圳浩迹智能科技有限公司</p>
            </footer>
        </div>
    `;

    // 添加基本样式
    const style = document.createElement('style');
    style.textContent = `
        .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
}

        header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        header h1 {
            color: #4f46e5;
            margin-bottom: 0.5rem;
}

        .card {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
        footer {
            text-align: center;
            margin-top: 2rem;
            color: #666;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
}
