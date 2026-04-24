"""
register_company.py

Provides the `register_new_company` function for multi-tenant onboarding.
Inserts a tenant, a default 'Admin' role, and an admin user inside a
single atomic PostgreSQL transaction.
"""

import uuid

import bcrypt
import psycopg2
from psycopg2 import errors as pg_errors

# ── connection helper ────────────────────────────────────────────────
# Replace these values with your actual database credentials or load
# them from environment variables / a config file.
DB_CONFIG = {
    "dbname": "your_db",
    "user": "your_user",
    "password": "your_password",
    "host": "localhost",
    "port": 5432,
}


def _get_connection():
    """Return a new psycopg2 connection with autocommit OFF (default)."""
    return psycopg2.connect(**DB_CONFIG)


# ── public API ───────────────────────────────────────────────────────
def register_new_company(
    company_name: str,
    company_email: str,
    admin_username: str,
    plain_password: str,
) -> dict:
    """
    Register a brand-new company (tenant) together with its first admin user.

    All three inserts run inside **one transaction**; if any step fails the
    entire operation is rolled back and the caller receives a clear error.

    Parameters
    ----------
    company_name : str
        Display name of the new company / tenant.
    company_email : str
        Primary contact e-mail for the tenant (must be unique).
    admin_username : str
        Username for the first admin user.
    plain_password : str
        Plain-text password – hashed with bcrypt before storage.

    Returns
    -------
    dict
        On success::

            {
                "success": True,
                "tenant_id": "<uuid>",
                "role_id": "<uuid>",
                "user_id": "<uuid>",
            }

        On failure::

            {
                "success": False,
                "error": "<human-readable message>",
            }
    """
    conn = None
    try:
        conn = _get_connection()
        cur = conn.cursor()

        # ── Step 1: Create tenant ────────────────────────────────────
        tenant_id = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO tenants (tenant_id, name, plan_type, contact_email)
            VALUES (%s, %s, %s, %s)
            """,
            (tenant_id, company_name, "free", company_email),
        )

        # ── Step 2: Create default 'Admin' role ─────────────────────
        role_id = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO roles (role_id, tenant_id, role_name)
            VALUES (%s, %s, %s)
            """,
            (role_id, tenant_id, "Admin"),
        )

        # ── Step 3: Hash password & create admin user ────────────────
        password_hash = bcrypt.hashpw(
            plain_password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        user_id = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO users (user_id, tenant_id, role_id, username, email, password_hash)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (user_id, tenant_id, role_id, admin_username, company_email, password_hash),
        )

        # ── Commit the whole transaction ─────────────────────────────
        conn.commit()

        return {
            "success": True,
            "tenant_id": tenant_id,
            "role_id": role_id,
            "user_id": user_id,
        }

    except pg_errors.UniqueViolation:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": (
                f"A tenant with the email '{company_email}' already exists. "
                "Please use a different email address."
            ),
        }

    except pg_errors.ForeignKeyViolation as exc:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": f"Foreign-key constraint violated: {exc}",
        }

    except psycopg2.DatabaseError as exc:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": f"Database error: {exc}",
        }

    except Exception as exc:
        if conn:
            conn.rollback()
        return {
            "success": False,
            "error": f"Unexpected error: {exc}",
        }

    finally:
        if conn:
            conn.close()


# ── quick manual test ────────────────────────────────────────────────
if __name__ == "__main__":
    result = register_new_company(
        company_name="Acme Corp",
        company_email="admin@acme.com",
        admin_username="acme_admin",
        plain_password="SuperSecret123!",
    )
    print(result)
