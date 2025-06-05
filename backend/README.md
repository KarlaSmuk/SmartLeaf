# InSync Backend

Welcome to the **InSync Backend**! This guide will help you set up and run the backend environment for the
project.

## 📌 Prerequisites

Ensure you have the following installed before proceeding:

- [Python](https://www.python.org/downloads/) (latest stable version)
- [pip](https://pip.pypa.io/en/stable/) (comes with Python)
- [Conda Environment](https://docs.conda.io/projects/conda/en/latest/index.html)
- [Git](https://git-scm.com/)

## 🚀 Setup Instructions

### 1️⃣ Enter Backend Directory

```sh
cd backend
```

### 2️⃣ Create a Conda Environment

### 3️⃣ Install Dependencies

```sh
pip install -r requirements.txt
```

### 4️⃣ Apply Migrations To PostgreSQL Database

```sh
cd src
```

```sh
alembic upgrade head
```

### 5️⃣ Running FastAPI

```sh
uvicorn main:app --reload
```
