from flask import Flask,render_template,request,jsonify,json,Response,session,redirect
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


@app.route('/ajax/get/usernameexists',methods=['POST'])
def usernameExists():
    if request.is_json:
        jsonstr = request.get_json()
        print(jsonstr)
        try:
            username = jsonstr['username']
        except:
            return Response(status=500)
        print(username)
        try:
            conn = connection()
            c=conn.cursor()
        except:
            print("db connection error")
        try:
            query = 'SELECT EXISTS( SELECT * FROM User WHERE username = %s);'
            print(query)
            c.execute(query,(thwart(username),))
            result = c.fetchone()
            print(result)
            response = {
                "code":200,
                "exist":result[0]
            }
            return jsonify(response)
        except:
            print("query error")
            response = {
                "code":500,
            }
            return jsonify(response)

@app.route("/login",methods=['GET','POST'])
def login():
    if session.get('logged_in'):
        return redirect('/')
    errors=[]
    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('pass')
        if username!=None and password!=None:
            conn = connection()
            c = conn.cursor()
            query = 'Select password,active,Isadmin from User where username = %s;'
            print(query)
            c.execute(query,(thwart(username),))
            result = c.fetchone()
            print(result)
            if result != None:
                password_hash = result[0]
                active  = result[1]
                isadmin = result[2]
                if check_password_hash(password_hash,password):
                    if active == 1:
                        session['logged_in'] = True
                        session['username'] = username
                        if isadmin == 1:
                            session['isadmin'] = True
                        return redirect('/')
                    else:
                        errors = ['acount has not been activated']
                else:
                    errors = ['wrong username or password']

            else:
                errors = ['that username does not exist']
    return render_template('login_page.html',errors=errors)

@app.route('/logout',methods = ['GET'])
def logout():
    session.pop('logged_in',None)
    session.pop('username',None)
    return redirect('/')




        
                        

@app.route("/ajax/post/registeruser",methods=['POST'])
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

        try:
            conn = connection()
            c=conn.cursor()
        except:
            print("db connection error")
        try:
            hashed_password = generate_password_hash(result['password1'])
            query = "INSERT INTO `sis_project`.`User` ( `Username`, `Password`, `Email`, `Isadmin`, `active`) VALUES (%s, %s, %s, '0', '0');"
            print(query)
            c.execute(query,(thwart(result['username']),thwart(hashed_password),thwart(result['email'])))
            conn.commit()
        except:
            response = {
                "code":500,
            }
            return jsonify(response) 
        response = {
                "code":200,
            }
        return jsonify(response)
    return Response(status=401)
    





if __name__ == "__main__":
    app.secret_key = "hosuhojfdoasidjpqwe21413"
    app.run(port=8080)