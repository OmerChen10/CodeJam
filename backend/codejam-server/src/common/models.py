import dataclasses


@dataclasses.dataclass
class Account:
    id: int
    name: str
    email: str

@dataclasses.dataclass
class Project:
    id: int
    name: str
    author: str
    description: str
    admin: bool