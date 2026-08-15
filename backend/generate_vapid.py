from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
import base64


def base64url_encode(data: bytes) -> str:
    """
    Convert bytes to Base64 URL-safe format
    without padding.
    """

    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def generate_vapid_keys():
    """
    Generate VAPID public/private key pair.
    """

    private_key = ec.generate_private_key(
        ec.SECP256R1()
    )

    public_key = private_key.public_key()

    private_numbers = private_key.private_numbers()

    private_key_bytes = private_numbers.private_value.to_bytes(
        32,
        byteorder="big"
    )

    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )

    private_key_string = base64url_encode(
        private_key_bytes
    )

    public_key_string = base64url_encode(
        public_key_bytes
    )

    return public_key_string, private_key_string


if __name__ == "__main__":

    public_key, private_key = generate_vapid_keys()

    print()
    print("=" * 60)
    print("BOOKVERSE VAPID KEYS")
    print("=" * 60)

    print()
    print("VAPID PUBLIC KEY:")
    print(public_key)

    print()
    print("VAPID PRIVATE KEY:")
    print(private_key)

    print()
    print("=" * 60)
    print("IMPORTANT:")
    print("Keep the private key secret.")
    print("=" * 60)