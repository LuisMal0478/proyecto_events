from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    username: str = Field(..., max_length=50)
    password: str = Field(..., max_length=128)

class ClienteBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    telefono: str = Field(..., max_length=20)
    evento: str = Field(..., max_length=50)
    fecha_evento: str = Field(..., max_length=20)
    invitados: int = Field(..., ge=1, le=10000)
    ciudad: str = Field(..., max_length=50)
    presupuesto: str = Field(..., max_length=50)

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    atendido: Optional[bool] = None

class Cliente(ClienteBase):
    id: int
    fecha_registro: datetime
    atendido: bool

    class Config:
        from_attributes = True

class GalleryItemBase(BaseModel):
    src: str = Field(..., max_length=4194304)  # Límite de 4MB para Base64/URLs de imágenes
    title: str = Field(..., max_length=100)
    category: str = Field(..., max_length=50)
    desc: str = Field(..., max_length=500)

class GalleryItemCreate(GalleryItemBase):
    pass

class GalleryItem(GalleryItemBase):
    id: int
    fecha_registro: datetime

    class Config:
        from_attributes = True
