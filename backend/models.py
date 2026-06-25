from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    evento = Column(String, nullable=False)
    fecha_evento = Column(String, nullable=False)
    invitados = Column(Integer, nullable=False)
    ciudad = Column(String, nullable=False)
    presupuesto = Column(String, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    atendido = Column(Boolean, default=False)

class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True, index=True)
    src = Column(String, nullable=False) # Almacena Base64 o URL
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    desc = Column(String, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
