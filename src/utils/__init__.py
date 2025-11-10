import os

cur_dir = os.path.dirname(__file__)
env_file_path = os.path.join(cur_dir, "..", "..", ".env")
env_file_path = os.path.abspath(env_file_path)
