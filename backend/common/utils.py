import uuid, time, threading
import re

def generate_short_url(instance):
	# NOTE : Use for now : (issues : too many initial common characters, making it predictable)
	# CTODO-3
	
	# Get high-resolution timestamp in microseconds
	timestamp_us = int(time.time() * 1_000_000)
	
	# Get thread ID for multi-threading safety
	thread_id = threading.get_ident() % 10000
	
	object_id = id(instance) % 100000
	
	# Get UUID4 bytes for randomness
	uuid_bytes = uuid.uuid4().bytes
	
	# Combine all unique components into a large number
	combined = (timestamp_us << 32) + (thread_id << 16) + object_id
	combined_bytes = combined.to_bytes(12, 'big') + uuid_bytes[:4]
	
	# Convert to base62 (0-9, a-z, A-Z)
	return base62_encode(int.from_bytes(combined_bytes, 'big'))[-6:]

def base62_encode(number):
	chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	if number == 0:
		return chars[0]
	
	result = ''
	while number > 0:
		number, remainder = divmod(number, 62)
		result = chars[remainder] + result
	
	# Ensure minimum length of 10 characters
	return result.zfill(10)


def remove_protocol_and_www(url):
    # Remove http:// or https://
    url = re.sub(r'^https?://', '', url)
    # Remove www.
    url = re.sub(r'^www\.', '', url)
    return url