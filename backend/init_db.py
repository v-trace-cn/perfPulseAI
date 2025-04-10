"""
初始化数据库并填充示例数据
运行此脚本以创建数据库表并添加一些初始数据
"""
from flask import Flask
from datetime import datetime, timedelta

from config import config
from database import db, init_db
from models.user import User
from models.reward import Reward
from models.activity import Activity
from models.scoring import ScoringCriteria, ScoringFactor, GovernanceMetric

def create_app(config_name='default'):
    """创建并配置Flask应用"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    init_db(app)
    return app

def add_sample_users(db_session):
    """添加示例用户"""
    print("添加示例用户...")
    user1 = User(
        name="张明",
        department="研发部",
        position="AI 研究员",
        email="zhangming@example.com",
        phone="13812345678",
        join_date=datetime.strptime("2022-03-15", "%Y-%m-%d").date(),
        points=1250,
        level=3
    )
    user1.set_password("password123")

    user2 = User(
        name="李华",
        department="产品部",
        position="产品经理",
        email="lihua@example.com",
        phone="13987654321",
        join_date = datetime.strptime("2022-01-10", "%Y-%m-%d").date(),
        points=980,
        level=2
    )
    user2.set_password("password123")

    try:
        db_session.add(user1)
        db_session.add(user2)
        db_session.commit()
    except InterruptedError as e:
        db_session.rollback()
        print(f"InterruptedError: {e}")
        # 使用 ON CONFLICT 更新
        db_session.execute(
            """
            INSERT INTO users (id, name, email, password_hash, department, position, phone, join_date, points, level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                name = EXCLUDED.name,
                department = EXCLUDED.department,
                position = EXCLUDED.position,
                phone = EXCLUDED.phone,
                join_date = EXCLUDED.join_date,
                points = EXCLUDED.points,
                level = EXCLUDED.level
            """,
            (
                user1.id, user1.name, user1.email, user1.password_hash,
                user1.department, user1.position, user1.phone, user1.join_date,
                user1.points, user1.level
            )
        )
        db_session.execute(
            """
            INSERT INTO users (id, name, email, password_hash, department, position, phone, join_date, points, level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                name = EXCLUDED.name,
                department = EXCLUDED.department,
                position = EXCLUDED.position,
                phone = EXCLUDED.phone,
                join_date = EXCLUDED.join_date,
                points = EXCLUDED.points,
                level = EXCLUDED.level
            """,
            (
                user2.id, user2.name, user2.email, user2.password_hash,
                user2.department, user2.position, user2.phone, user2.join_date,
                user2.points, user2.level
            )
        )
        db_session.commit()
    
    return [user1, user2]

def add_sample_activities(db_session, users):
    """添加示例活动"""
    print("添加示例活动...")
    
    # 示例活动
    activities = [
        Activity(
            id="1",
            title="AI模型优化",
            description="优化现有的AI模型以提高性能",
            points=25,
            user_id=users[0].id,
            status="completed",
            created_at=datetime.utcnow() - timedelta(minutes=10),
            completed_at=datetime.utcnow() - timedelta(minutes=5)
        ),
        Activity(
            id="2",
            title="前端界面更新",
            description="更新用户界面以提高用户体验",
            points=15,
            user_id=users[0].id,
            status="completed",
            created_at=datetime.utcnow() - timedelta(minutes=30),
            completed_at=datetime.utcnow() - timedelta(minutes=15)
        ),
        Activity(
            id="3",
            title="API使用说明",
            description="编写API文档以便开发者使用",
            points=20,
            user_id=users[0].id,
            status="completed",
            created_at=datetime.utcnow() - timedelta(hours=2),
            completed_at=datetime.utcnow() - timedelta(hours=1)
        ),
        Activity(
            id="4",
            title="性能瓶颈",
            description="解决系统性能瓶颈问题",
            points=30,
            user_id=users[1].id,
            status="completed",
            created_at=datetime.utcnow() - timedelta(days=1),
            completed_at=datetime.utcnow() - timedelta(hours=20)
        ),
        Activity(
            id="5",
            title="产品规划",
            description="参与产品规划讨论",
            points=10,
            user_id=users[1].id,
            status="pending",
            created_at=datetime.utcnow() - timedelta(days=1, hours=2)
        )
    ]
    
    for activity in activities:
        db_session.add(activity)
    
    db_session.commit()
    
    return activities

def add_sample_rewards(db_session):
    """添加示例奖励"""
    print("添加示例奖励...")
    
    # 示例奖励
    rewards = [
        Reward(id="1", name="额外休假日", description="获得一天带薪休假", cost=500, available=True),
        Reward(id="2", name="技术书籍", description="选择一本技术书籍", cost=300, available=True),
        Reward(id="3", name="设备升级", description="工作设备升级", cost=1000, available=True),
        Reward(id="4", name="专业会议", description="参加行业专业会议的机会", cost=800, available=True),
        Reward(id="5", name="培训课程", description="参加付费专业培训课程", cost=600, available=True)
    ]
    
    for reward in rewards:
        db_session.add(reward)
    
    db_session.commit()
    
    return rewards

def add_sample_scoring_criteria(db_session):
    """添加示例评分标准"""
    print("添加示例评分标准...")
    
    # 示例评分标准
    criteria = [
        ScoringCriteria(
            id="1", 
            category="代码提交", 
            description="提交高质量的代码到仓库", 
            base_points=10, 
            weight=1.0
        ),
        ScoringCriteria(
            id="2", 
            category="代码审查", 
            description="对他人代码进行有效审查", 
            base_points=5, 
            weight=0.8
        ),
        ScoringCriteria(
            id="3", 
            category="文档贡献", 
            description="编写或更新项目文档", 
            base_points=8, 
            weight=0.7
        ),
        ScoringCriteria(
            id="4", 
            category="问题解决", 
            description="解决项目中的bug或技术问题", 
            base_points=15, 
            weight=1.2
        ),
        ScoringCriteria(
            id="5", 
            category="知识分享", 
            description="分享技术文章或举办培训", 
            base_points=20, 
            weight=1.5
        )
    ]
    
    for criterion in criteria:
        db_session.add(criterion)
    
    db_session.commit()
    
    return criteria

def add_sample_scoring_factors(db_session):
    """添加示例评分因素"""
    print("添加示例评分因素...")
    
    # 示例评分因素
    factors = [
        ScoringFactor(
            id="1",
            label="代码质量",
            description="代码的质量和可维护性",
            type="select",
            options=[
                {"label": "低", "value": "low"},
                {"label": "中", "value": "medium"},
                {"label": "高", "value": "high"}
            ]
        ),
        ScoringFactor(
            id="2",
            label="完成时间",
            description="任务完成所需的时间",
            type="number",
            min_value=1,
            max_value=100
        ),
        ScoringFactor(
            id="3",
            label="创新程度",
            description="解决方案的创新程度",
            type="select",
            options=[
                {"label": "常规", "value": "standard"},
                {"label": "改进", "value": "improved"},
                {"label": "创新", "value": "innovative"}
            ]
        ),
        ScoringFactor(
            id="4",
            label="团队协作",
            description="是否促进了团队协作",
            type="checkbox"
        )
    ]
    
    for factor in factors:
        db_session.add(factor)
    
    db_session.commit()
    
    return factors

def add_sample_governance_metrics(db_session):
    """添加示例治理指标"""
    print("添加示例治理指标...")
    
    # 部门指标
    department_metrics = [
        GovernanceMetric(dimension="department", metric_name="代码质量", value=85),
        GovernanceMetric(dimension="department", metric_name="文档完整性", value=92),
        GovernanceMetric(dimension="department", metric_name="安全合规", value=88),
        GovernanceMetric(dimension="department", metric_name="性能效率", value=76),
        GovernanceMetric(dimension="department", metric_name="可维护性", value=90),
        GovernanceMetric(dimension="department", metric_name="可扩展性", value=82)
    ]
    
    # 全局指标
    global_metrics = [
        GovernanceMetric(dimension="global", metric_name="代码质量", value=80),
        GovernanceMetric(dimension="global", metric_name="文档完整性", value=85),
        GovernanceMetric(dimension="global", metric_name="安全合规", value=92),
        GovernanceMetric(dimension="global", metric_name="性能效率", value=88),
        GovernanceMetric(dimension="global", metric_name="可维护性", value=78),
        GovernanceMetric(dimension="global", metric_name="可扩展性", value=86)
    ]
    
    for metric in department_metrics + global_metrics:
        db_session.add(metric)
    
    db_session.commit()

def init_database():
    """初始化数据库并填充示例数据"""
    app = create_app()
    
    with app.app_context():
        # 创建所有表
        db.create_all()
        
        # 添加示例数据
        users = add_sample_users(db.session)
        add_sample_activities(db.session, users)
        add_sample_rewards(db.session)
        add_sample_scoring_criteria(db.session)
        add_sample_scoring_factors(db.session)
        add_sample_governance_metrics(db.session)
        
        print("数据库初始化完成！")

if __name__ == "__main__":
    init_database()
