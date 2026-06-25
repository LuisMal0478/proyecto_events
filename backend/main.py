import os
import re
import html
import time
from collections import defaultdict
from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException, Query, Request
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

import models, schemas, crud, security
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Evenets API",
    description="API protegida y securizada para la gestión de cotizaciones de alquileres y eventos",
    version="1.1.0"
)

# 1. CORS CONFIGURATION HARDENING
allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS")
if allowed_origins_raw:
    allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# 2. SECURITY HEADERS MIDDLEWARE
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "connect-src *; "
        "img-src 'self' data: blob: *; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    )
    return response

# 3. RATE LIMITING IMPLEMENTATION
class SimpleRateLimiter:
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.history = defaultdict(list)
        
    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        # Limpiar registros más viejos que la ventana de tiempo
        self.history[client_ip] = [t for t in self.history[client_ip] if now - t < self.window_seconds]
        
        if len(self.history[client_ip]) >= self.requests_limit:
            return False
            
        self.history[client_ip].append(now)
        return True

# Rate limits: 5 cotizaciones por minuto, 10 intentos de login por minuto
quote_rate_limiter = SimpleRateLimiter(requests_limit=5, window_seconds=60)
login_rate_limiter = SimpleRateLimiter(requests_limit=10, window_seconds=60)

# 4. INPUT SANITIZATION UTILITIES
def sanitize_text(text: str) -> str:
    """Elimina etiquetas HTML para prevenir Cross-Site Scripting (XSS)."""
    if not text:
        return text
    # Remover etiquetas HTML usando una expresión regular
    clean_text = re.sub(r'<[^>]*>', '', text)
    # Escapar caracteres de control HTML por seguridad adicional
    return html.escape(clean_text.strip())

def seed_gallery_if_empty(db: Session):
    if db.query(models.GalleryItem).count() == 0:
        default_items = [
            models.GalleryItem(
                src="/images/decoracion_cumpleanos.png",
                title="Cumpleaños Infantil Selva Pastel",
                category="Cumpleaños",
                desc="Arco orgánico de globos con cilindros temáticos."
            ),
            models.GalleryItem(
                src="/images/decoracion_babyshower.png",
                title="Baby Shower Dulce Oso",
                category="Baby Shower",
                desc="Fondo de madera con nubes flotantes y peluches."
            ),
            models.GalleryItem(
                src="/images/decoracion_bautizo.png",
                title="Bautizo Eucalipto Elegante",
                category="Bautizos",
                desc="Aro dorado con flores naturales y mesas cilíndricas."
            ),
            models.GalleryItem(
                src="/images/decoracion_cumpleanos.png",
                title="Mobiliario Cilindros y Fondos",
                category="Mobiliario",
                desc="Juego de cilindros de colores pastel con paneles listos para personalizar."
            ),
            models.GalleryItem(
                src="/images/decoracion_babyshower.png",
                title="Baby Shower Nubes de Ensueño",
                category="Baby Shower",
                desc="Montaje orgánico de globos rosados, blancos y lila."
            ),
            models.GalleryItem(
                src="/images/decoracion_bautizo.png",
                title="Primera Comunión Calidez y Luz",
                category="Bautizos",
                desc="Fondo sobrio con velas decorativas y detalles en dorado."
            ),
        ]
        db.add_all(default_items)
        db.commit()

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Evenets. Canal de comunicación seguro establecido."}

# Endpoint de Inicio de Sesión (Login)
@app.post("/api/auth/login")
def login(payload: schemas.LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if not login_rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo más tarde.")
    
    # Validar nombre de usuario
    if payload.username != security.DEFAULT_ADMIN_USER:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")
        
    # Validar contraseña
    if not security.verify_password(payload.password, security.ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")
        
    # Emitir token de seguridad firmado
    token = security.create_access_token(
        data={"sub": payload.username, "role": "admin"},
        expires_in=86400  # Vence en 24 horas
    )
    return {"access_token": token, "token_type": "bearer"}

# Endpoints de Cotizaciones
@app.post("/api/cotizaciones", response_model=schemas.Cliente)
def create_cotizacion(cliente: schemas.ClienteCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    if not quote_rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="Límite de solicitudes excedido. Intenta de nuevo en un minuto.")
        
    # Sanitizar campos recibidos
    cliente.nombre = sanitize_text(cliente.nombre)
    cliente.telefono = sanitize_text(cliente.telefono)
    cliente.evento = sanitize_text(cliente.evento)
    cliente.fecha_evento = sanitize_text(cliente.fecha_evento)
    cliente.ciudad = sanitize_text(cliente.ciudad)
    cliente.presupuesto = sanitize_text(cliente.presupuesto)
    
    return crud.create_cliente(db=db, cliente=cliente)

@app.get("/api/cotizaciones", response_model=List[schemas.Cliente])
def read_cotizaciones(
    search: Optional[str] = Query(None, description="Buscar por nombre, teléfono, evento o ciudad"),
    atendido: Optional[bool] = Query(None, description="Filtrar por estado atendido (true/false)"),
    db: Session = Depends(get_db),
    current_admin: str = Depends(security.get_current_admin)
):
    return crud.get_clientes(db=db, search=search, atendido=atendido)

@app.patch("/api/cotizaciones/{id}/atendido", response_model=schemas.Cliente)
def update_cotizacion_atendido(
    id: int, 
    payload: schemas.ClienteUpdate, 
    db: Session = Depends(get_db),
    current_admin: str = Depends(security.get_current_admin)
):
    if payload.atendido is None:
        raise HTTPException(status_code=400, detail="El campo 'atendido' es requerido")
    
    db_cliente = crud.update_cliente_atendido(db=db, cliente_id=id, atendido=payload.atendido)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente

@app.delete("/api/cotizaciones/{id}")
def delete_cotizacion(
    id: int, 
    db: Session = Depends(get_db),
    current_admin: str = Depends(security.get_current_admin)
):
    success = crud.delete_cliente(db=db, cliente_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": f"Registro con id {id} eliminado exitosamente"}

# Endpoints de la Galería
@app.get("/api/galeria", response_model=List[schemas.GalleryItem])
def read_gallery(db: Session = Depends(get_db)):
    seed_gallery_if_empty(db)
    return crud.get_gallery_items(db)

@app.post("/api/galeria", response_model=schemas.GalleryItem)
def create_gallery_item(
    item: schemas.GalleryItemCreate, 
    db: Session = Depends(get_db),
    current_admin: str = Depends(security.get_current_admin)
):
    # Sanitizar cadenas de texto
    item.title = sanitize_text(item.title)
    item.category = sanitize_text(item.category)
    item.desc = sanitize_text(item.desc)
    
    # Validar formato seguro de la imagen
    if not (item.src.startswith("data:image/") or item.src.startswith("http://") or item.src.startswith("https://") or item.src.startswith("/images/")):
        raise HTTPException(status_code=400, detail="Formato de origen de imagen inválido o inseguro.")
        
    return crud.create_gallery_item(db=db, item=item)

@app.delete("/api/galeria/{id}")
def delete_gallery_item(
    id: int, 
    db: Session = Depends(get_db),
    current_admin: str = Depends(security.get_current_admin)
):
    success = crud.delete_gallery_item(db=db, item_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Item no encontrado en la galería")
    return {"message": f"Imagen con id {id} eliminada exitosamente"}
