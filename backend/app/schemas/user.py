from pydantic import BaseModel, EmailStr
from uuid import UUID

# Shared properties
class UserBase(BaseModel):
    email: EmailStr

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str
    full_name: str | None = None

# Properties to return to client (Never return the password!)
class UserResponse(UserBase):
    id: str
    full_name: str | None = None
    is_active: bool

    class Config:
        from_attributes = True