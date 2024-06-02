from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
from constants import SecurityConfig
import binascii
from utils import Logger


class AesUtils:
    def __init__(self) -> None:
        with open(SecurityConfig.AES_KEY_PATH, "rb") as f:
            self.key = f.read()

        self.cipher = AES.new(self.key, AES.MODE_ECB)

    def encrypt(self, message) -> (bytes):
        data = pad(message.encode(), AES.block_size) 
        cipher_text = self.cipher.encrypt(data)
         
        return binascii.hexlify(cipher_text).decode()


    def decrypt(self, cipher_text) -> (str):
        try: 
            data = self.cipher.decrypt(binascii.unhexlify(cipher_text))
            return unpad(data, AES.block_size).decode()
        
        except:
            Logger.log_warning("[AesUtils] Failed to decrypt message.")
            return None


if __name__ == "__main__":
    with open("aes_key.bin", "wb") as f:
        f.write(get_random_bytes(16))
