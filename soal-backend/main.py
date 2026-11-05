from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase_client import supabase

app = FastAPI(
    title="SOAL Backend API",
    description="API for managing KSSM exam papers, AI question banks, and collaborative HOD workflows.",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models for Request Validation ---

class CommentCreate(BaseModel):
    project_id: int
    user_id: int
    comment_text: str


class StatusUpdate(BaseModel):
    status: str  # 'Draft', 'Pending', 'Approved', 'Rejected'
    user_id_hod: Optional[int] = None


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    systemRole: str  # 'Teacher' or 'HOD'
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# --- General Routes ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the SOAL backend API!"}


# --- Authentication Endpoints ---

@app.post("/auth/register")
def register_user(user: UserRegister):
    # 1. Check if email already exists in Supabase
    existing_user = supabase.table("User").select("*").eq("email", user.email).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # Map 'HOD' to match database format 'HoD' if needed
    role_to_save = "HoD" if user.systemRole.upper() == "HOD" else "Teacher"

    # 2. Insert new user into Supabase 'User' table
    new_user_data = {
        "username": user.username,
        "email": user.email,
        "role": role_to_save,
        "password": user.password
    }

    response = supabase.table("User").insert(new_user_data).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create account.")

    created_user = response.data[0]
    return {
        "message": "User registered successfully",
        "user": {
            "id": created_user.get("user_id"),  # Using user_id from database schema
            "username": created_user.get("username"),
            "email": created_user.get("email"),
            "role": created_user.get("role")
        }
    }


@app.post("/auth/login")
def login_user(credentials: UserLogin):
    # 1. Fetch user from Supabase by email
    response = supabase.table("User").select("*").eq("email", credentials.email).execute()

    if not response.data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user = response.data[0]

    # 2. Verify password
    if user.get("password") != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Normalize role for frontend routing check ('HoD' or 'HOD' maps to 'HOD')
    db_role = user.get("role")
    normalized_role = "HOD" if db_role and db_role.lower() == "hod" else "Teacher"

    return {
        "message": "Login successful",
        "user": {
            "id": user.get("user_id"),  # Using user_id from database schema
            "username": user.get("username"),
            "email": user.get("email"),
            "role": normalized_role
        }
    }


# --- Exam Project & Comment Routes ---

@app.get("/projects/{project_id}")
def get_exam_project(project_id: int):
    response = supabase.table("exam_projects").select("*, templates(*), questions(*), dlp_glossaries(*)").eq("id", project_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Exam project not found.")
    return response.data[0]


@app.post("/comments/")
def create_comment(comment: CommentCreate):
    new_comment = {
        "project_id": comment.project_id,
        "user_id": comment.user_id,
        "comment_text": comment.comment_text
    }
    response = supabase.table("review_comments").insert(new_comment).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to record review comment.")
    return response.data[0]


@app.patch("/projects/{project_id}/status")
def update_project_status(project_id: int, update: StatusUpdate):
    update_data = {"status": update.status}
    if update.user_id_hod:
        update_data["user_id_hod"] = update.user_id_hod

    response = supabase.table("exam_projects").update(update_data).eq("id", project_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Project update failed.")
    return response.data[0]