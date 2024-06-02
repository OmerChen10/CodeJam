from constants import SecurityConfig
import hashlib
import secrets


class HashUtils:

    @staticmethod
    def hash_password(text: str, salt: str) -> str:
        text = SecurityConfig.PEPPER + salt + text
        return hashlib.sha256(text.encode()).hexdigest()
    

    @staticmethod
    def hash_text(text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()
    

    @staticmethod
    def generate_salt() -> str:
        return secrets.token_hex(16)
    