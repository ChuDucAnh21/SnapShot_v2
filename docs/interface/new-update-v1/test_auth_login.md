"""
API: POST /api/auth/login

Mục đích
- Minh họa cách FE gọi API đăng nhập và hiểu rõ dữ liệu trả về.
- Kiểm thử 2 tình huống:
  1) Happy path: email + password đúng -> 200 + access_token + user(user_id, learner_id)
  2) Sai mật khẩu -> 401

Endpoint
- POST {BASE_URL}/api/auth/login
Headers
- Content-Type: application/json
Body (JSON)
{
  "email": "parent@example.com",
  "password": "secret12"
}

Response (200 OK) - mẫu
{
  "status": "success",
  "access_token": "<token>",
  "user": {
    "user_id": "...",
    "learner_id": "..." | null
  }
}

Response (401) - sai thông tin
{
  "detail": "Invalid credentials"
}

Cách chạy (khuyến nghị -s để hiện log):
    pytest -q -s tests/test_auth_login.py
"""

import os
import uuid
import pytest
import requests
from pydantic import BaseModel, EmailStr, ValidationError
from typing import Optional, Literal

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000").rstrip("/")
TIMEOUT_SEC = float(os.getenv("HTTP_TIMEOUT", "10"))

# =========================
# Schemas tham chiếu cho FE
# =========================
class LoginOKUser(BaseModel):
    user_id: str
    learner_id: Optional[str] = None

class LoginOKResp(BaseModel):
    status: Literal["success"]
    access_token: str
    user: LoginOKUser

# =========================
# Helpers
# =========================
def _random_email() -> str:
    return f"parent_{uuid.uuid4().hex[:8]}@example.com"

def _register_account(email: str, password: str, child_age: int = 7) -> requests.Response:
    """Đăng ký nhanh 1 tài khoản để dùng cho login test."""
    url = f"{BASE_URL}/api/auth/register"
    payload = {
        "email": email,
        "password": password,
        "full_name": "Phụ huynh Iruka",
        "child_name": "Bé Cá Heo",
        "child_age": child_age,
    }
    print(f"\n[REQUEST] POST {url}")
    print(f"[BODY] {payload}")
    r = requests.post(url, json=payload, timeout=TIMEOUT_SEC)
    print(f"[RESPONSE] HTTP {r.status_code}")
    for k in ["content-type", "server", "date"]:
        if k in r.headers:
            print(f"[HEADER] {k}: {r.headers[k]}")
    print(f"[BODY]\n{r.text}\n")
    return r

def _post_login(email: str, password: str) -> requests.Response:
    url = f"{BASE_URL}/api/auth/login"
    payload = {"email": email, "password": password}
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
def test_login_happy_path():
    """
    Case 1: Đăng nhập đúng thông tin.
    - Chuẩn bị: tạo tài khoản mới qua /api/auth/register
    - Kỳ vọng: 200 OK, body parse được theo LoginOKResp
    """
    email = _random_email()
    password = "secret12"

    try:
        r_reg = _register_account(email, password)
    except requests.exceptions.ConnectionError as e:
        pytest.skip(f"Server chưa chạy tại {BASE_URL}: {e}")
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/register sau {TIMEOUT_SEC}s")
    assert r_reg.status_code == 200, f"Không đăng ký được tài khoản test: {r_reg.status_code} - {r_reg.text}"

    try:
        r = _post_login(email, password)
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/login sau {TIMEOUT_SEC}s")

    assert r.status_code == 200, f"HTTP {r.status_code}: {r.text}"

    # Parse theo schema để FE nắm rõ keys
    try:
        data = r.json()
        parsed = LoginOKResp.model_validate(data)
    except ValueError:
        pytest.fail(f"Response không phải JSON: {r.text}")
    except ValidationError as ve:
        pytest.fail(f"JSON sai schema LoginOKResp: {ve}\nBody: {r.text}")

    # Log tóm tắt cho FE
    print("[PARSED]")
    print(f"- status      : {parsed.status}")
    print(f"- access_token: {parsed.access_token[:12]}... (ẩn bớt)")
    print(f"- user_id     : {parsed.user.user_id}")
    print(f"- learner_id  : {parsed.user.learner_id}")

def test_login_wrong_password_401():
    """
    Case 2: Sai mật khẩu -> 401.
    - Chuẩn bị: tạo tài khoản mới
    - Thực hiện: login với wrong password
    - Kỳ vọng: 401 và body có 'detail': 'Invalid credentials'
    """
    email = _random_email()
    correct_password = "secret12"
    wrong_password = "wrongpass"

    try:
        r_reg = _register_account(email, correct_password, child_age=8)
    except requests.exceptions.ConnectionError as e:
        pytest.skip(f"Server chưa chạy tại {BASE_URL}: {e}")
    except requests.exceptions.Timeout:
        pytest.fail(f"Timeout khi gọi /api/auth/register sau {TIMEOUT_SEC}s")
    assert r_reg.status_code == 200, f"Không đăng ký được tài khoản test: {r_reg.status_code} - {r_reg.text}"

    r = _post_login(email, wrong_password)
    assert r.status_code == 401, f"Kỳ vọng 401, thực tế {r.status_code}: {r.text}"

    try:
        body = r.json()
    except ValueError:
        pytest.fail(f"Response 401 không phải JSON: {r.text}")

    assert body.get("detail") == "Invalid credentials", f"detail khác kỳ vọng: {body}"
