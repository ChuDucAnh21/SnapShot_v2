"""
API: POST /api/auth/register

Mục đích
- Minh họa cách FE gọi API đăng ký tài khoản và hiểu rõ dữ liệu trả về.
- Kiểm thử 2 tình huống:
  1) Happy path: đăng ký với email mới -> 200 + access_token + user + learner
  2) Conflict: đăng ký lại cùng email -> 409

Endpoint
- POST {BASE_URL}/api/auth/register
Headers
- Content-Type: application/json
Body (JSON)
{
  "email": "parent@example.com",
  "password": "string (>=6)",
  "full_name": "Tên phụ huynh",
  "child_name": "Tên bé",
  "child_age": 3..12
}

Response (200 OK) - mẫu
{
  "status": "success",
  "access_token": "<token>",
  "user": {
    "user_id": "...",
    "email": "...",
    "full_name": "..."
  },
  "learner": {
    "learner_id": "...",
    "name": "...",
    "age": 7
  }
}

Response (409) - email đã tồn tại
{
  "detail": "Email already registered"
}

Cách chạy (khuyến nghị -s để hiện log):
    pytest -q -s tests/test_auth_register.py
"""

import os
import uuid
import pytest
import requests
from pydantic import BaseModel, EmailStr, ValidationError, Field
from typing import Literal

# =========================
# Cấu hình chung
# =========================
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000").rstrip("/")
TIMEOUT_SEC = float(os.getenv("HTTP_TIMEOUT", "10"))

# =========================
# Schemas (Pydantic) để FE tham chiếu
# =========================
class UserModel(BaseModel):
    user_id: str
    email: EmailStr
    full_name: str

class LearnerModel(BaseModel):
    learner_id: str
    name: str
    age: int = Field(ge=3, le=12)

class RegisterOKResp(BaseModel):
    status: Literal["success"]
    access_token: str
    user: UserModel
    learner: LearnerModel

# =========================
# Helpers
# =========================
def _random_email() -> str:
    return f"parent_{uuid.uuid4().hex[:8]}@example.com"

def _post_register(payload: dict) -> requests.Response:
    url = f"{BASE_URL}/api/auth/register"
    print(f"\n[REQUEST] POST {url}")
    print(f"[BODY] {payload}")
    r = requests.post(url, json=payload, timeout=TIMEOUT_SEC)
    print(f"[RESPONSE] HTTP {r.status_code}")
    for k in ["content-type", "server", "date"]:
        if k in r.headers:
            print(f"[HEADER] {k}: {r.headers[k]}")
    print(f"[BODY]\n{r.text}\n")
    return r

# =========================
# Tests
# =========================
def test_register_happy_path():
    """
    Case 1: Đăng ký với email mới.
    - Expect: 200 OK và body parse được theo RegisterOKResp.
    - FE tham khảo: payload và response mẫu sẽ được in ra log.
    """
    payload = {
        "email": _random_email(),
        "password": "secret12",
        "full_name": "Phụ huynh Iruka",
        "child_name": "Bé Cá Heo",
        "child_age": 7,
    }

    try:
        r = _post_register(payload)
    except requests.exceptions.ConnectionError as e:
        pytest.skip(f"Server chưa chạy tại {BASE_URL}: {e}")
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/register sau {TIMEOUT_SEC}s")

    assert r.status_code == 200, f"HTTP {r.status_code}: {r.text}"

    # parse theo schema để FE thấy rõ keys
    try:
        data = r.json()
        parsed = RegisterOKResp.model_validate(data)
    except ValueError:
        pytest.fail(f"Response không phải JSON: {r.text}")
    except ValidationError as ve:
        pytest.fail(f"JSON sai schema RegisterOKResp: {ve}\nBody: {r.text}")

    # Log tóm tắt cho FE
    print("[PARSED]")
    print(f"- status      : {parsed.status}")
    print(f"- access_token: {parsed.access_token[:12]}... (ẩn bớt)")
    print(f"- user_id     : {parsed.user.user_id}")
    print(f"- user_email  : {parsed.user.email}")
    print(f"- learner_id  : {parsed.learner.learner_id}")
    print(f"- learner_name: {parsed.learner.name}")
    print(f"- learner_age : {parsed.learner.age}")

def test_register_conflict_same_email():
    """
    Case 2: Đăng ký 2 lần cùng 1 email -> lần 2 phải 409.
    """
    email = _random_email()
    payload = {
        "email": email,
        "password": "secret12",
        "full_name": "Phụ huynh Iruka",
        "child_name": "Bé Cá Heo",
        "child_age": 8,
    }

    # Lần 1: thành công
    try:
        r1 = _post_register(payload)
    except requests.exceptions.ConnectionError as e:
        pytest.skip(f"Server chưa chạy tại {BASE_URL}: {e}")
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/register (lần 1) sau {TIMEOUT_SEC}s")
    assert r1.status_code == 200, f"Lần 1 phải 200, thực tế {r1.status_code}: {r1.text}"

    # Lần 2: cùng email -> 409
    try:
        r2 = _post_register(payload)
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/register (lần 2) sau {TIMEOUT_SEC}s")

    assert r2.status_code == 409, f"Lần 2 kỳ vọng 409, thực tế {r2.status_code}: {r2.text}"
    # Nếu muốn kiểm tra message:
    try:
        body2 = r2.json()
        detail = body2.get("detail")
        assert detail in ("Email already registered", "Email already registered."), f"detail khác kỳ vọng: {detail}"
    except ValueError:
        pytest.fail(f"Response conflict không phải JSON: {r2.text}")
