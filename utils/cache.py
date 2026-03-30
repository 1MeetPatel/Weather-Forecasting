import time

class SimpleCache:
    def __init__(self, ttl_seconds=600):
        self.cache = {}
        self.ttl = ttl_seconds

    def get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return data
            else:
                del self.cache[key] # Expired
        return None

    def set(self, key, value):
        self.cache[key] = (value, time.time())

# Global cache instance
weather_cache = SimpleCache()
