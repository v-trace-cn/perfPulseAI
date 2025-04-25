import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.reward import Reward, Redemption, RewardSuggestion
from app.models.user import User

router = APIRouter(prefix="/api/reward", tags=["reward"])

@router.get("/")
def get_rewards(page: int = 1, per_page: int = 10, db: Session = Depends(get_db)):
    query = db.query(Reward).filter_by(available=True)
    total = query.count()
    items = query.order_by(Reward.created_at.desc()).offset((page-1)*per_page).limit(per_page).all()
    return {"data": {"rewards": [r.to_dict() for r in items], "total": total, "page": page, "per_page": per_page}, "message": "查询成功", "success": True}

@router.get("/{reward_id}")
def get_reward(reward_id: str, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="找不到奖励")
    return {"data": reward.to_dict(), "message": "查询成功", "success": True}

@router.post("/")
def create_reward(data: dict = Body(...), db: Session = Depends(get_db)):
    new_reward = Reward(id=str(uuid.uuid4()), name=data.get("name"), description=data.get("description"), cost=int(data.get("cost",0)), icon=data.get("icon"), available=data.get("available", True))
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return {"data": new_reward.to_dict(), "message": "创建成功", "success": True}

@router.post("/{reward_id}/redeem")
def redeem_reward(reward_id: str, data: dict = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.get("user_id")).first()
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="找不到用户")
    if not reward:
        raise HTTPException(status_code=404, detail="找不到奖励")
    if not reward.available:
        raise HTTPException(status_code=400, detail="该奖励不可用")
    if user.points < reward.cost:
        raise HTTPException(status_code=400, detail="积分不足")
    user.points -= reward.cost
    redemption = Redemption(id=str(uuid.uuid4()), user_id=user.id, reward_id=reward_id, timestamp=datetime.utcnow(), status="pending")
    db.add(redemption)
    db.commit()
    db.refresh(redemption)
    return {"data": redemption.to_dict(), "message": "奖励兑换成功", "success": True}

@router.get("/redemptions")
def get_redemptions(user_id: str = None, db: Session = Depends(get_db)):
    q = db.query(Redemption)
    if user_id:
        q = q.filter(Redemption.user_id == user_id)
    items = q.order_by(Redemption.timestamp.desc()).all()
    return {"data": [r.to_dict() for r in items], "message": "查询成功", "success": True}

@router.post("/{reward_id}/like")
def like_reward(reward_id: str, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="找不到奖励")
    reward.likes = (reward.likes or 0) + 1
    db.commit()
    return {"data": {"likes": reward.likes}, "message": "点赞成功", "success": True}

@router.post("/{reward_id}/suggest")
def suggest_reward_change(reward_id: str, data: dict = Body(...), db: Session = Depends(get_db)):
    suggestion = RewardSuggestion(id=str(uuid.uuid4()), user_id=data.get("user_id","anonymous"), reward_id=reward_id if reward_id!="new" else None, suggestion_text=data.get("suggestion",""), suggested_value=data.get("suggested_value"), timestamp=datetime.utcnow(), status="pending")
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return {"data": {"suggestion_id": suggestion.id}, "message": "建议已提交，感谢您的反馈！", "success": True}

@router.post("/suggest-new")
def suggest_new_reward(data: dict = Body(...), db: Session = Depends(get_db)):
    suggestion = RewardSuggestion(id=str(uuid.uuid4()), user_id=data.get("user_id","anonymous"), reward_id=None, suggestion_text=data.get("suggestion",""), suggested_value=data.get("suggested_value"), timestamp=datetime.utcnow(), status="pending")
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return {"data": {"suggestion_id": suggestion.id}, "message": "新奖励建议已提交，感谢反馈！", "success": True}
