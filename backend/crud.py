from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
import models, schemas

def get_clientes(db: Session, search: str = None, atendido: bool = None):
    query = db.query(models.Cliente)
    
    if atendido is not None:
        query = query.filter(models.Cliente.atendido == atendido)
        
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                models.Cliente.nombre.ilike(search_filter),
                models.Cliente.telefono.ilike(search_filter),
                models.Cliente.evento.ilike(search_filter),
                models.Cliente.ciudad.ilike(search_filter)
            )
        )
        
    return query.order_by(desc(models.Cliente.fecha_registro)).all()

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    db_cliente = models.Cliente(
        nombre=cliente.nombre,
        telefono=cliente.telefono,
        evento=cliente.evento,
        fecha_evento=cliente.fecha_evento,
        invitados=cliente.invitados,
        ciudad=cliente.ciudad,
        presupuesto=cliente.presupuesto
    )
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def update_cliente_atendido(db: Session, cliente_id: int, atendido: bool):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if db_cliente:
        db_cliente.atendido = atendido
        db.commit()
        db.refresh(db_cliente)
    return db_cliente

def delete_cliente(db: Session, cliente_id: int):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if db_cliente:
        db.delete(db_cliente)
        db.commit()
        return True
    return False

# Funciones CRUD para la Galería
def get_gallery_items(db: Session):
    return db.query(models.GalleryItem).order_by(desc(models.GalleryItem.fecha_registro)).all()

def create_gallery_item(db: Session, item: schemas.GalleryItemCreate):
    db_item = models.GalleryItem(
        src=item.src,
        title=item.title,
        category=item.category,
        desc=item.desc
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_gallery_item(db: Session, item_id: int):
    db_item = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False
