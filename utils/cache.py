import time

class SimpleCache:
    def __init__(self, ttl_seconds=600, max_size=1000):
        self.cache = {}
        self.ttl = ttl_seconds
        self.max_size = max_size

    def get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return data
            else:
                del self.cache[key] # Expired
        return None

    def set(self, key, value):
        if len(self.cache) >= self.max_size:
            self._evict()
        self.cache[key] = (value, time.time())
        
    def _evict(self):
        # Evict expired first
        now = time.time()
        expired = [k for k, (v, ts) in self.cache.items() if now - ts >= self.ttl]
        for k in expired:
            del self.cache[k]
            
        # If still too large, remove oldest
        if len(self.cache) >= self.max_size:
            # list() converts keys view to list, dict maintains insertion order (Python 3.7+)
            oldest_keys = list(self.cache.keys())[:self.max_size // 5]
            for k in oldest_keys:
                del self.cache[k]

# Global cache instance
weather_cache = SimpleCache()
