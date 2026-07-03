import os
import time
import json
import base64
import hmac
import hashlib
import secrets
# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.environ.get("SECRET_KEY", "un_secreto_super_seguro_por_defecto_para_desarrollo_123!").encode('utf-8')
DEFAULT_ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")

# CONTRASEÑA POR DEFECTO HASHED: "EvenetsAdmin2026!"
# Para generarlo, usamos pbkdf2_hmac con un salt fijo en este caso para fallback,
# pero permitimos su sobreescritura total por variable de entorno.
FALLBACK_SALT = bytes.fromhex("b4f177de49c362ab8ea0a427f42d8f99")
FALLBACK_HASH = hashlib.pbkdf2_hmac('sha256', b"EvenetsAdmin2026!", FALLBACK_SALT, 100000).hex()
DEFAULT_ADMIN_PASSWORD_HASH = f"{FALLBACK_SALT.hex()}:{FALLBACK_HASH}"

ADMIN_PASSWORD_HASH = os.environ.get("ADMIN_PASSWORD_HASH", DEFAULT_ADMIN_PASSWORD_HASH)

# Contenedor de Tokens de Seguridad
security = HTTPBearer()

def hash_password(password: str) -> str:
    """Genera un hash PBKDF2 de la contraseña con un salt aleatorio."""
    salt = secrets.token_bytes(16)
    db_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"{salt.hex()}:{db_hash.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña ingresada coincide con el hash almacenado."""
    try:
        salt_hex, hash_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)
        test_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return secrets.compare_digest(expected_hash, test_hash)
    except Exception:
        return False

def create_access_token(data: dict, expires_in: int = 86400) -> str:
    """Genera un token firmado con HMAC-SHA256 y tiempo de expiración."""
    payload = data.copy()
    payload["exp"] = int(time.time()) + expires_in
    payload_str = json.dumps(payload)
    payload_b64 = base64.urlsafe_b64encode(payload_str.encode('utf-8')).decode('utf-8')
    
    # Firmamos el Base64 del payload
    signature = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"

def verify_access_token(token: str) -> dict:
    """Verifica la firma y la fecha de vencimiento de un token."""
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_b64, signature = parts
        
        # Verificar firma HMAC
        expected_signature = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
        if not secrets.compare_digest(expected_signature, signature):
            return None
            
        # Decodificar payload
        payload_bytes = base64.urlsafe_b64decode(payload_b64.encode('utf-8'))
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Verificar expiración
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependencia de FastAPI para proteger rutas administrativas exigiendo Bearer Token."""
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión de administrador inválida o expirada. Vuelve a iniciar sesión.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload.get("sub")
