from datetime import datetime
import uuid


def generate_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:10]}"

def current_timestamp():
    return datetime.now().isoformat() + "Z"