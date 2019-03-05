from flask import Flask,render_template,request,jsonify,json,Response
from datetime import date
from marshmallow import Schema, fields, pprint, ValidationError
from werkzeug import generate_password_hash, check_password_hash
from dbconnection import connection
import MySQLdb
from MySQLdb import escape_string as thwart

class UserSchema(Schema):
    username = fields.Str(required=True)
    name = fields.Str(required=True)    
    email = fields.Email(required=True)
    dob = fields.Date(required=True)
    g_name = fields.Str(required=True)
    phone = fields.Str(required=True)
    branch = fields.Str(required=True)
    password1 = fields.Str(required=True)
    password2 =  fields.Str(required=True)
    address = fields.Str(required=True)
#todo put validation



app = Flask(__name__,static_url_path='',static_folder='templates/static/')

@app.route("/")
def main():
    return render_template('home.html')

@app.route("/register")
def register():
    return render_template('registration.html')




@app.route("/registeruser",methods=['POST'])
def registerUser():
    # print(request.is_json)
    if request.is_json:
        jsonstr = request.get_json()
        schema = UserSchema()
        try:
            result = schema.load(jsonstr)
            print(result)
        except ValidationError as err:
            print(err)
            error_list = []
            for e in err.messages.keys:
                error_list.extend(err.messages[e])
            response = {
                "code":500,
                "errors":error_list
            }
            return jsonify(response)

        conn = connection()
        c=conn.cursor()
        hashed_password = generate_password_hash(result['password1'])
        query = "INSERT INTO `sis_project`.`User` ( `Username`, `Password`, `Email`, `Isadmin`, `active`) VALUES (%s, %s, %s, '0', '0');"
        print(query)
        try:
            c.execute(query,(thwart(result['username']),thwart(hashed_password),thwart(result['email'])))
            conn.commit()
        except:
            return json.dumps("internal server error") 
        
        c.close()
        conn.close()
        response = {
                "code":200,
            }
        return jsonify(response)
    return Response(status=401)
    





if __name__ == "__main__":
    app.run(port=8080)