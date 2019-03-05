import MySQLdb

def connection():
    conn = MySQLdb.connect(host="localhost",
                           user = "sis_app",
                           passwd = "p@ssword",
                           db = "sis_project")

    return conn