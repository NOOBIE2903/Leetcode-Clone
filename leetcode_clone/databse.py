# import os
# import dj_database_url

# os.environ['DATABASE_URL'] = 'postgresql://leetcode_clone_db_brzs_user:btTMdVsgiHsiPxUPv7POElLwxRdDZiYT@dpg-d42sgu0dl3ps73co8f70-a.oregon-postgres.render.com:5432/leetcode_clone_db_brzs'

# db_config = dj_database_url.config()
# print("Database config:", db_config)

# Temporary debug - remove after testing
import os
print("SECRET_KEY length:", len(os.environ.get('SECRET_KEY', '')))
print("SECRET_KEY value:", os.environ.get('SECRET_KEY'))