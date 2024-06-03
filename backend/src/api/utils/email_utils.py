import smtplib
import ssl
import threading
from utils import Logger
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from constants import EmailConfig

class EmailUtils():
    __instance = None

    def __init__(self):
        self.PORT = 465  # For SSL
        self.SMTP_SERVER = "smtp.gmail.com"
        
        with open(EmailConfig.EMAIL_CREDENTIALS_PATH, "r") as f:
            self.SENDER_EMAIL, self.PASSWORD = f.read().split("\n")

        with open(EmailConfig.EMAIL_HTML_PATH, "r") as f:
            self.EMAIL_HTML = f.read()

    @staticmethod
    def get_instance():
        if EmailUtils.__instance is None:
            EmailUtils.__instance = EmailUtils()
        return EmailUtils.__instance
    
    @Logger.catch_exceptions
    def send_code(self, receiver_email, subject, code):
        thread = threading.Thread(
            target=self._send_code, 
            args=(receiver_email, subject, code),
            daemon=True
        )
        thread.start()

    @Logger.catch_exceptions
    def _send_code(self, receiver_email, subject, code):
        # Create a multipart message and set headers
        message = MIMEMultipart()
        message["From"] = self.SENDER_EMAIL
        message["To"] = receiver_email
        message["Subject"] = subject

        # Add HTML body to email
        message.attach(MIMEText(
            self.EMAIL_HTML.replace("{{ code }}", code), 
            "html"
        ))

        # Convert message to string
        text_message = message.as_string()

        # Create a secure SSL context
        context = ssl.create_default_context()

        # Try to log in to server and send email
        with smtplib.SMTP_SSL(self.SMTP_SERVER, self.PORT, context=context) as server:
            server.login(self.SENDER_EMAIL, self.PASSWORD)
            server.sendmail(self.SENDER_EMAIL, receiver_email, text_message)


